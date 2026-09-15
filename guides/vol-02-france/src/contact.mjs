/** Planche-contact des candidats d'un groupe, pour la sélection à l'œil. */
import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const DIR = fileURLToPath(new URL("../assets/candidates/", import.meta.url));
const UA = "veyora-guide-builder/1.0 (editorial use)";

const groups = process.argv.slice(2);
const load = async (g) => {
  for (const f of [`manifest-${g}.json`, "manifest.json"]) {
    try { const j = JSON.parse(await readFile(DIR + f, "utf8")); if (j[g]) return j[g]; } catch {}
  }
  return [];
};

const W = 210, H = 150, PAD = 6, LBL = 13, COLS = 7;

for (const g of groups) {
  const list = (await load(g)).slice(0, 42);
  const tiles = [];
  for (let i = 0; i < list.length; i++) {
    try {
      const r = await fetch(list[i].thumb, { headers: { "User-Agent": UA } });
      const b = Buffer.from(await r.arrayBuffer());
      tiles.push({ i, buf: await sharp(b).resize(W, H, { fit: "cover" }).jpeg({ quality: 74 }).toBuffer() });
    } catch { /* ignoré */ }
  }
  const rows = Math.ceil(tiles.length / COLS);
  const cw = COLS * (W + PAD) + PAD, ch = rows * (H + PAD + LBL) + PAD;
  const comps = [];
  for (let k = 0; k < tiles.length; k++) {
    const x = PAD + (k % COLS) * (W + PAD), y = PAD + Math.floor(k / COLS) * (H + PAD + LBL);
    comps.push({ input: tiles[k].buf, left: x, top: y });
    const t = list[tiles[k].i];
    const label = `${tiles[k].i} · ${t.ratio} · ${t.title.slice(0, 26)}`.replace(/[<&]/g, "");
    comps.push({
      input: Buffer.from(`<svg width="${W}" height="${LBL}"><text x="0" y="10" font-family="monospace" font-size="9" fill="#111">${label}</text></svg>`),
      left: x, top: y + H + 1,
    });
  }
  const out = `/tmp/cand-${g}.jpg`;
  await sharp({ create: { width: cw, height: ch, channels: 3, background: "#ffffff" } })
    .composite(comps).jpeg({ quality: 78 }).toFile(out);
  console.log(`${g}: ${tiles.length} vignettes → ${out}`);
}
