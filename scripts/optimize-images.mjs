// Generates responsive WebP variants of public/images/*.jpg for static hosting.
// Output: public/images/_opt/<width>/<key>.webp (gitignored, rebuilt on each build).
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [96, 384, 640, 960, 1280, 1920]; // keep in sync with src/lib/image-widths.ts
const SRC = path.resolve("public/images");
const OUT = path.join(SRC, "_opt");

const files = (await readdir(SRC)).filter((f) => f.endsWith(".jpg"));
let made = 0;

await Promise.all(
  files.map(async (file) => {
    const key = file.replace(/\.jpg$/, "");
    const input = path.join(SRC, file);
    const srcTime = (await stat(input)).mtimeMs;
    for (const w of WIDTHS) {
      const dir = path.join(OUT, String(w));
      const out = path.join(dir, `${key}.webp`);
      try {
        if ((await stat(out)).mtimeMs >= srcTime) continue; // up to date
      } catch {}
      await mkdir(dir, { recursive: true });
      await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: w <= 96 ? 50 : 72 }).toFile(out);
      made++;
    }
  }),
);

console.log(`optimize-images: ${files.length} photos, ${made} variants generated`);
