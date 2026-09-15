/** Télécharge les images retenues et écrit les crédits définitifs. */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { PICKS } from "../data/photo-picks.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Commons limite le débit : on temporise et on réessaie. */
async function get(url, tries = 6) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    await sleep(3000 * (i + 1));
  }
  return null;
}

const DIR = fileURLToPath(new URL("../assets/", import.meta.url));
const UA = "veyora-guide-builder/1.0 (editorial use)";
const man = JSON.parse(await readFile(`${DIR}candidates/manifest.json`, "utf8"));

await mkdir(`${DIR}photos/`, { recursive: true });
const credits = {};
const misses = [];

for (const [key, pick] of Object.entries(PICKS)) {
  if (!pick) { misses.push(`${key} (sans image, par choix)`); continue; }
  const [group, fragment] = pick;
  const hit = (man[group] ?? []).find((c) => c.title.includes(fragment));
  if (!hit) { misses.push(`${key} — introuvable : « ${fragment} »`); continue; }
  let buf;
  if (existsSync(`${DIR}photos/${key}.jpg`)) {
    buf = await readFile(`${DIR}photos/${key}.jpg`);
  } else {
    buf = await get(hit.url);
    if (!buf) { misses.push(`${key} — téléchargement refusé`); continue; }
    await writeFile(`${DIR}photos/${key}.jpg`, buf);
    await sleep(1200);
  }
  credits[key] = {
    title: hit.title, creator: hit.creator, license: hit.license,
    source: "Wikimedia Commons", page: hit.page,
    width: hit.width, height: hit.height, ratio: hit.ratio, bytes: buf.length,
  };
  console.log(`✓ ${key.padEnd(18)} ${String(hit.ratio).padEnd(5)} ${hit.license.padEnd(13)} ${hit.title.slice(0, 40)}`);
}

await writeFile(`${DIR}credits.json`, JSON.stringify(credits, null, 2));
console.log(`\n${Object.keys(credits).length} images retenues.`);
if (misses.length) console.log("À traiter :\n  " + misses.join("\n  "));
