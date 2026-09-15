/** Planche unique : les meilleurs candidats de chaque groupe, pour arbitrer. */
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const DIR = fileURLToPath(new URL("../assets/candidates/", import.meta.url));
const UA = "veyora-guide-builder/1.0 (editorial use)";
const man = JSON.parse(await readFile(DIR + "manifest.json", "utf8"));
const GROUPS = process.argv.slice(2);
const PER = 8, W = 200, H = 142, PAD = 6, LBL = 12, COLS = 8;

const tiles = [];
for (const g of GROUPS) {
  const list = (man[g] || [])
    .map((c, i) => ({ ...c, i }))
    .sort((a, b) => (Math.abs(b.ratio - 1.45) < 0.001 ? 0 : 0) || (b.width * b.height) - (a.width * a.height))
    .slice(0, PER);
  for (const c of list) {
    try {
      const r = await fetch(c.thumb, { headers: { "User-Agent": UA } });
      tiles.push({ g, i: c.i, title: c.title, ratio: c.ratio,
        buf: await sharp(Buffer.from(await r.arrayBuffer())).resize(W, H, { fit: "cover" }).jpeg({ quality: 74 }).toBuffer() });
    } catch {}
  }
}
const rows = Math.ceil(tiles.length / COLS);
const comps = [];
tiles.forEach((t, k) => {
  const x = PAD + (k % COLS) * (W + PAD), y = PAD + Math.floor(k / COLS) * (H + PAD + LBL);
  comps.push({ input: t.buf, left: x, top: y });
  const label = `${t.g}#${t.i} ${t.ratio} ${t.title.slice(0, 22)}`.replace(/[<&]/g, "");
  comps.push({ input: Buffer.from(`<svg width="${W}" height="${LBL}"><text x="0" y="9" font-family="monospace" font-size="8.5" fill="#000">${label}</text></svg>`), left: x, top: y + H + 1 });
});
await sharp({ create: { width: COLS * (W + PAD) + PAD, height: rows * (H + PAD + LBL) + PAD, channels: 3, background: "#fff" } })
  .composite(comps).jpeg({ quality: 78 }).toFile("/tmp/mega.jpg");
console.log(tiles.length, "vignettes");
