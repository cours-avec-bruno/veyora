/**
 * Sourcing photographique — API Wikimedia Commons.
 *
 * Deux exigences, dans cet ordre :
 *   1. QUALITÉ — on ne pioche que dans « Quality images », « Featured pictures »
 *      et « Valued images », relues par des pairs sur des critères techniques.
 *      Une recherche plein texte ordinaire ramène n'importe quoi (une gravure
 *      pour Bayonne, un joueur de hockey pour Briançon) : elle est inutilisable
 *      pour un document vendu.
 *   2. LICENCE — CC0, domaine public et CC BY uniquement. Le partage à
 *      l'identique (BY-SA) est écarté : il contaminerait le document entier.
 *
 * Chaque image retenue est créditée dans assets/credits.json (auteur,
 * licence, page d'origine).
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const API = "https://commons.wikimedia.org/w/api.php";
const UA = "veyora-guide-builder/1.0 (editorial use; contact via repository)";
const OUT = new URL("../assets/photos/", import.meta.url);
const CREDITS = new URL("../assets/credits.json", import.meta.url);

const POOLS = ['incategory:"Quality images"', 'incategory:"Featured pictures"', 'incategory:"Valued images"'];
const OK_LICENSE = /^(cc0|cc[ -]by[ -]\d|public domain|pd|no restrictions)/i;
const BAD_LICENSE = /sa/i;

/** [clé, [termes de recherche], orientation, mots interdits dans le titre] */
const WANTED = [
  ["annecy-hero",      ["Lac d'Annecy", "Annecy"],                             "landscape"],
  ["annecy-2",         ["Annecy", "Annecy vieille ville"],                     "portrait"],
  ["annecy-3",         ["Lac d'Annecy montagne", "Haute-Savoie lac"],          "landscape"],
  ["strasbourg-hero",  ["Strasbourg cathédrale", "Cathédrale Strasbourg"],     "portrait"],
  ["strasbourg-2",     ["Strasbourg Petite France", "Strasbourg"],             "landscape"],
  ["strasbourg-3",     ["Strasbourg place", "Strasbourg architecture"],        "landscape"],
  ["saint-malo-hero",  ["Saint-Malo", "Saint-Malo remparts"],                  "landscape"],
  ["saint-malo-2",     ["Saint-Malo rue", "Saint-Malo intra-muros"],           "portrait"],
  ["saint-malo-3",     ["Pointe du Grouin", "Côte d'Émeraude", "Cancale"],     "landscape"],
  ["la-rochelle-hero", ["La Rochelle tour", "La Rochelle vieux port"],         "landscape"],
  ["la-rochelle-2",    ["Île de Ré", "Ile de Re marais"],                      "landscape"],
  ["la-rochelle-3",    ["Saint-Martin-de-Ré", "Ars-en-Ré village"],            "portrait"],
  ["biarritz-hero",    ["Biarritz", "Biarritz plage"],                         "landscape"],
  ["biarritz-2",       ["Bayonne", "Bayonne Nive"],                            "portrait"],
  ["biarritz-3",       ["Saint-Jean-de-Luz", "Guéthary"],                      "landscape"],
  ["sete-hero",        ["Sète", "Sete Hérault"],                               "landscape"],
  ["sete-2",           ["Étang de Thau", "Bouzigues"],                         "landscape"],
  ["sete-3",           ["Sète ville", "Sète quartier"],                        "portrait"],
  ["arles-hero",       ["Arles amphithéâtre", "Arènes d'Arles"],               "landscape"],
  ["arles-2",          ["Camargue", "Camargue flamant"],                       "landscape"],
  ["arles-3",          ["Arles", "Arles rue"],                                 "portrait"],
  ["briancon-hero",    ["Briançon", "Hautes-Alpes Briançon"],                  "landscape"],
  ["briancon-2",       ["Briançon rue", "Briançon vieille ville"],             "portrait"],
  ["briancon-3",       ["Écrins", "Parc national des Écrins", "Clarée"],       "landscape"],
  ["clermont-hero",    ["Puy de Dôme", "Chaîne des Puys"],                     "landscape"],
  ["clermont-2",       ["Clermont-Ferrand cathédrale", "Clermont-Ferrand"],    "portrait"],
  ["clermont-3",       ["Chaîne des Puys", "Puy de Pariou", "Auvergne volcan"],"landscape"],
  ["dijon-hero",       ["Dijon", "Dijon place"],                               "landscape"],
  ["dijon-2",          ["Côte de Nuits", "Bourgogne vignoble", "Gevrey"],      "landscape"],
  ["dijon-3",          ["Dijon rue", "Dijon maison"],                          "portrait"],
  ["cover",            ["chemin de fer paysage France", "voie ferrée montagne", "railway landscape France"], "portrait"],
];

/* ── garde-fous de contenu ───────────────────────────────────────── */
/* Commons mélange photographies, gravures, cartes, plans et blasons. */
const REJECT = /(engraving|gravure|lithograph|drawing|dessin|painting|peinture|map |carte de|plan de|blason|coat of arms|logo|portrait de|manuscript|stamp|timbre|coin |medal|banknote|diagram|schéma|\.svg|\.pdf|\.tif)/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params, tries = 5) {
  const qs = new URLSearchParams({ format: "json", origin: "*", ...params });
  for (let i = 0; i < tries; i++) {
    const res = await fetch(`${API}?${qs}`, { headers: { "User-Agent": UA, Accept: "application/json" } });
    const text = await res.text();
    if (res.ok && text.trim().startsWith("{")) return JSON.parse(text);
    await sleep(1500 * (i + 1));            // temporisation : l'API limite le débit
  }
  return null;
}

const licenceOf = (m) => (m?.LicenseShortName?.value ?? "").replace(/<[^>]+>/g, "").trim();
const artistOf = (m) =>
  (m?.Artist?.value ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 70) || null;

function score(info, orientation) {
  const { width: w, height: h } = info;
  if (!w || !h || w < 1800) return -1;
  const ratio = w / h;
  const wantWide = orientation === "landscape";
  if (wantWide && ratio < 1.25) return -1;
  if (!wantWide && ratio > 0.92) return -1;
  const ideal = wantWide ? 1.55 : 0.72;
  return 6 - Math.abs(ratio - ideal) * 3 + Math.min(w, 6000) / 3000;
}

async function candidates(term) {
  const found = [];
  for (const pool of POOLS) {
    const j = await api({
      action: "query", generator: "search",
      gsrsearch: `${term} ${pool}`, gsrnamespace: "6", gsrlimit: "12",
      prop: "imageinfo", iiprop: "url|size|extmetadata|mime",
    });
    await sleep(700);
    const pages = j?.query?.pages ?? {};
    for (const p of Object.values(pages)) {
      const info = p.imageinfo?.[0];
      if (!info || info.mime !== "image/jpeg") continue;
      const title = p.title.replace(/^File:/, "");
      if (REJECT.test(title)) continue;
      const lic = licenceOf(info.extmetadata);
      if (!OK_LICENSE.test(lic) || BAD_LICENSE.test(lic)) continue;
      found.push({ title, info, lic, pool });
    }
    if (found.length >= 8) break;
  }
  return found;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 150_000) throw new Error("trop léger");
  await writeFile(dest, buf);
  return buf.length;
}

const main = async () => {
  await mkdir(OUT, { recursive: true });
  const credits = existsSync(CREDITS) ? JSON.parse(await readFile(CREDITS, "utf8")) : {};
  const taken = new Set(Object.values(credits).map((c) => c.page));
  const missing = [];

  for (const [key, terms, orientation] of WANTED) {
    const dest = new URL(`${key}.jpg`, OUT);
    if (existsSync(dest)) { console.log(`· ${key} conservé`); continue; }
    let done = false;
    for (const term of terms) {
      const list = (await candidates(term))
        .map((c) => ({ ...c, s: score(c.info, orientation) }))
        .filter((c) => c.s > 0)
        .sort((a, b) => b.s - a.s);
      for (const c of list.slice(0, 5)) {
        const page = c.info.descriptionurl;
        if (taken.has(page)) continue;
        try {
          const bytes = await download(c.info.url, dest);
          credits[key] = {
            title: c.title, creator: artistOf(c.info.extmetadata), license: c.lic,
            source: "Wikimedia Commons", pool: c.pool.replace(/incategory:"|"/g, ""),
            page, width: c.info.width, height: c.info.height, bytes, query: term,
          };
          taken.add(page);
          console.log(`✓ ${key.padEnd(17)} ${String(c.info.width).padStart(5)}×${String(c.info.height).padEnd(5)} ${c.lic.padEnd(12)} ${c.title.slice(0, 44)}`);
          done = true; break;
        } catch { /* candidat suivant */ }
      }
      if (done) break;
    }
    if (!done) { console.log(`✗ ${key.padEnd(17)} aucun candidat`); missing.push(key); }
  }

  await writeFile(CREDITS, JSON.stringify(credits, null, 2));
  console.log(`\n${Object.keys(credits).length} images.${missing.length ? " Manquantes : " + missing.join(", ") : " Aucune manquante."}`);
};

main();
