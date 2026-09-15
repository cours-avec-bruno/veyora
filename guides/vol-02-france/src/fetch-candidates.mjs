/**
 * Récupère des candidats photographiques par CATÉGORIE Commons (et non par
 * recherche plein texte, qui confond « boulevard de Strasbourg à Toulouse »
 * avec Strasbourg). Produit des vignettes et un manifeste ; la sélection
 * finale se fait à l'œil, sur planche-contact.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const API = "https://commons.wikimedia.org/w/api.php";
const UA = "veyora-guide-builder/1.0 (editorial use)";
const DIR = fileURLToPath(new URL("../assets/candidates/", import.meta.url));

export const GROUPS = {
  annecy:     ["Category:Lac d'Annecy", "Category:Old town of Annecy", "Category:Palais de l'Isle", "Category:Thiou", "Category:Semnoz"],
  strasbourg: ["Category:Cathédrale Notre-Dame de Strasbourg", "Category:Petite France (Strasbourg)", "Category:Ponts couverts de Strasbourg", "Category:Neustadt (Strasbourg)", "Category:Strasbourg"],
  "saint-malo": ["Category:Remparts de Saint-Malo", "Category:Intra-muros (Saint-Malo)", "Category:Pointe du Grouin", "Category:Cancale", "Category:Saint-Malo"],
  "la-rochelle": ["Category:Vieux-Port de La Rochelle", "Category:Tours de La Rochelle", "Category:Île de Ré", "Category:Ars-en-Ré", "Category:Saint-Martin-de-Ré", "Category:La Rochelle"],
  biarritz:   ["Category:Grande Plage (Biarritz)", "Category:Rocher de la Vierge", "Category:Saint-Jean-de-Luz", "Category:Nive", "Category:Biarritz", "Category:Bayonne"],
  sete:       ["Category:Étang de Thau", "Category:Canaux de Sète", "Category:Mont Saint-Clair", "Category:Bouzigues", "Category:Sète"],
  arles:      ["Category:Arènes d'Arles", "Category:Camargue", "Category:Cloître Saint-Trophime", "Category:Théâtre antique d'Arles", "Category:Arles"],
  briancon:   ["Category:Cité Vauban (Briançon)", "Category:Pont d'Asfeld", "Category:Parc national des Écrins", "Category:Vallée de la Clarée", "Category:Briançon"],
  clermont:   ["Category:Puy de Dôme", "Category:Chaîne des Puys", "Category:Puy de Pariou", "Category:Cathédrale Notre-Dame-de-l'Assomption de Clermont-Ferrand", "Category:Clermont-Ferrand"],
  dijon:      ["Category:Palais des ducs de Bourgogne", "Category:Vineyards in Côte-d'Or", "Category:Côte de Nuits", "Category:Beaune", "Category:Rues de Dijon", "Category:Dijon"],
  rail:       ["Category:Railway lines in France", "Category:Trains in France", "Category:TGV", "Category:Rail transport in France"],
};

const OK = /^(cc0|cc[ -]by[ -]\d|public domain|pd|no restrictions)/i;
const BAD = /sa/i;
/* Commons mêle photos, gravures, plans, blasons, inscriptions et objets de musée. */
const REJECT = /(engraving|gravure|lithograph|drawing|dessin|painting|peinture|tableau|carte |map |plan |blason|coat.of.arms|logo|manuscript|stamp|timbre|coin |medal|inscription|dédicace|musée arch|diagram|schéma|portrait de|statue de|\.svg|\.tif|\.pdf|\.png)/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params, tries = 6) {
  const qs = new URLSearchParams({ format: "json", formatversion: "2", ...params });
  for (let i = 0; i < tries; i++) {
    const res = await fetch(`${API}?${qs}`, { headers: { "User-Agent": UA, Accept: "application/json" } });
    const t = await res.text();
    if (res.ok && t.trim().startsWith("{")) return JSON.parse(t);
    await sleep(2000 * (i + 1));
  }
  return null;
}

const lic = (m) => (m?.LicenseShortName?.value ?? "").replace(/<[^>]+>/g, "").trim();
const artist = (m) => (m?.Artist?.value ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 60) || null;

async function fromCategory(cat, limit = 60) {
  const j = await api({
    action: "query", generator: "categorymembers",
    gcmtitle: cat, gcmtype: "file", gcmlimit: String(limit),
    prop: "imageinfo", iiprop: "url|size|extmetadata|mime", iiurlwidth: "360",
  });
  await sleep(900);
  const pages = j?.query?.pages ?? [];
  const out = [];
  for (const p of pages) {
    const i = p.imageinfo?.[0];
    if (!i || i.mime !== "image/jpeg") continue;
    const title = p.title.replace(/^File:/, "");
    if (REJECT.test(title)) continue;
    const l = lic(i.extmetadata);
    if (!OK.test(l) || BAD.test(l)) continue;
    if (i.width < 1800) continue;
    out.push({
      title, license: l, creator: artist(i.extmetadata),
      url: i.url, thumb: i.thumburl, page: i.descriptionurl,
      width: i.width, height: i.height,
      ratio: +(i.width / i.height).toFixed(2), cat,
    });
  }
  return out;
}

const main = async () => {
  await mkdir(DIR, { recursive: true });
  const only = process.argv[2];
  const manifest = {};
  for (const [group, cats] of Object.entries(GROUPS)) {
    if (only && group !== only) continue;
    const seen = new Set(); const list = [];
    for (const c of cats) {
      for (const it of await fromCategory(c)) {
        if (seen.has(it.page)) continue;
        seen.add(it.page); list.push(it);
      }
    }
    manifest[group] = list;
    console.log(`${group.padEnd(12)} ${String(list.length).padStart(3)} candidats`);
  }
  const path = `${DIR}manifest${only ? "-" + only : ""}.json`;
  await writeFile(path, JSON.stringify(manifest, null, 2));
  console.log(`→ ${path}`);
};

main();
