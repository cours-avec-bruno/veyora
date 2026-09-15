/**
 * Sourcing photographique — Unsplash.
 *
 * C'est la banque du VOL. 01 : licence commerciale, attribution non
 * obligatoire (nous créditons quand même), et un fonds de photographie de
 * voyage sans comparaison avec ce que Wikimedia Commons offre sous licence
 * non-ShareAlike.
 *
 *   UNSPLASH_ACCESS_KEY=xxx node src/source-unsplash.mjs            # tout
 *   UNSPLASH_ACCESS_KEY=xxx node src/source-unsplash.mjs annecy-hero # une clé
 *
 * Les images déjà présentes dans assets/photos/ sont conservées : effacez
 * celles que vous voulez remplacer. Les crédits sont réécrits dans
 * assets/credits.json, au format attendu par la page Crédits du volume.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) {
  console.error(
    "UNSPLASH_ACCESS_KEY manquante.\n" +
    "Créez une application sur https://unsplash.com/developers (gratuit),\n" +
    "puis relancez :  UNSPLASH_ACCESS_KEY=votre_clé node src/source-unsplash.mjs"
  );
  process.exit(1);
}

const DIR = fileURLToPath(new URL("../assets/", import.meta.url));
const API = "https://api.unsplash.com/search/photos";

/** [clé, requête, orientation] — une requête par image du volume. */
const WANTED = [
  ["cover",            "french railway track countryside",      "portrait"],
  ["annecy-hero",      "Annecy lake france",                    "landscape"],
  ["annecy-2",         "Annecy old town canal",                 "portrait"],
  ["annecy-3",         "Annecy lake mountains cycling",         "landscape"],
  ["strasbourg-hero",  "Strasbourg cathedral",                  "portrait"],
  ["strasbourg-2",     "Strasbourg Petite France canal",        "landscape"],
  ["strasbourg-3",     "Strasbourg street alsace",              "landscape"],
  ["saint-malo-hero",  "Saint-Malo ramparts brittany",          "landscape"],
  ["saint-malo-2",     "Saint-Malo old town street",            "portrait"],
  ["saint-malo-3",     "Brittany coast path cliffs",            "landscape"],
  ["la-rochelle-hero", "La Rochelle old port towers",           "landscape"],
  ["la-rochelle-2",    "Ile de Re salt marshes cycling",        "landscape"],
  ["la-rochelle-3",    "Ile de Re white village hollyhocks",    "portrait"],
  ["biarritz-hero",    "Biarritz beach surf basque",            "landscape"],
  ["biarritz-2",       "Bayonne colourful houses river",        "portrait"],
  ["biarritz-3",       "Saint Jean de Luz harbour basque",      "landscape"],
  ["sete-hero",        "Sete canal fishing boats france",       "landscape"],
  ["sete-2",           "oyster farming lagoon mediterranean",   "landscape"],
  ["sete-3",           "Sete rooftops mediterranean port",      "portrait"],
  ["arles-hero",       "Arles roman amphitheatre provence",     "landscape"],
  ["arles-2",          "Camargue flamingos marshes",            "landscape"],
  ["arles-3",          "Arles provence street",                 "portrait"],
  ["briancon-hero",    "Briancon alps fortified town",          "landscape"],
  ["briancon-2",       "alpine old town street france",         "portrait"],
  ["briancon-3",       "Ecrins national park alps hiking",      "landscape"],
  ["clermont-hero",    "Puy de Dome volcano auvergne",          "landscape"],
  ["clermont-2",       "Clermont-Ferrand black cathedral",      "portrait"],
  ["clermont-3",       "Chaine des Puys volcanoes auvergne",    "landscape"],
  ["dijon-hero",       "Dijon burgundy rooftops",               "landscape"],
  ["dijon-2",          "Burgundy vineyard cote de nuits",       "landscape"],
  ["dijon-3",          "Dijon old street burgundy",             "portrait"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(query, orientation) {
  const qs = new URLSearchParams({ query, orientation, per_page: "8", content_filter: "high" });
  const res = await fetch(`${API}?${qs}`, {
    headers: { Authorization: `Client-ID ${KEY}`, "Accept-Version": "v1" },
  });
  if (res.status === 403) throw new Error("quota Unsplash atteint (50 requêtes/h en mode démo)");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { results = [] } = await res.json();
  return results;
}

/** Signale à Unsplash qu'une photo a été utilisée — requis par leurs conditions. */
const trackDownload = (photo) =>
  fetch(`${photo.links.download_location}`, { headers: { Authorization: `Client-ID ${KEY}` } }).catch(() => {});

const main = async () => {
  await mkdir(`${DIR}photos/`, { recursive: true });
  const only = process.argv.slice(2);
  const credits = existsSync(`${DIR}credits.json`)
    ? JSON.parse(await readFile(`${DIR}credits.json`, "utf8")) : {};
  const missing = [];

  for (const [key, query, orientation] of WANTED) {
    if (only.length && !only.includes(key)) continue;
    if (existsSync(`${DIR}photos/${key}.jpg`)) { console.log(`· ${key} conservé`); continue; }
    try {
      const [photo] = await search(query, orientation);
      if (!photo) { missing.push(key); console.log(`✗ ${key.padEnd(18)} aucun résultat`); continue; }
      const url = `${photo.urls.raw}&w=2400&q=85&fm=jpg&fit=max`;
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      await writeFile(`${DIR}photos/${key}.jpg`, buf);
      await trackDownload(photo);
      credits[key] = {
        title: photo.description ?? photo.alt_description ?? null,
        creator: photo.user.name,
        username: photo.user.username,
        license: "Unsplash License",
        source: "Unsplash",
        page: photo.links.html,
        width: photo.width, height: photo.height, bytes: buf.length,
        query,
      };
      console.log(`✓ ${key.padEnd(18)} ${photo.user.name.slice(0, 22).padEnd(22)} « ${query} »`);
      await sleep(400);
    } catch (e) {
      missing.push(key);
      console.log(`✗ ${key.padEnd(18)} ${e.message}`);
      if (/quota/.test(e.message)) break;
    }
  }

  await writeFile(`${DIR}credits.json`, JSON.stringify(credits, null, 2));
  console.log(`\n${Object.keys(credits).length} images créditées.${missing.length ? " Manquantes : " + missing.join(", ") : ""}`);
  console.log("Puis : node src/optimize-photos.mjs && node src/build.mjs");
};

main();
