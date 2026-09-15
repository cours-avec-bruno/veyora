/**
 * Réduit les originaux Commons (jusqu'à 10 000 px, 250 Mo au total) au format
 * utile à l'impression : 2200 px sur le grand côté, soit ≈ 265 dpi en pleine
 * page A4. Au-delà, on alourdit le PDF sans rien gagner de visible.
 */
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("../assets/photos/", import.meta.url));
const DST = fileURLToPath(new URL("../assets/print/", import.meta.url));
const MAX = 2200;

await mkdir(DST, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f));
let before = 0, after = 0;

for (const f of files) {
  const out = DST + f;
  const src = SRC + f;
  before += (await stat(src)).size;
  if (existsSync(out)) { after += (await stat(out)).size; continue; }
  await sharp(src)
    .rotate()
    .resize(MAX, MAX, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);
  after += (await stat(out)).size;
}

console.log(`${files.length} images · ${(before / 1e6).toFixed(0)} Mo → ${(after / 1e6).toFixed(1)} Mo`);
