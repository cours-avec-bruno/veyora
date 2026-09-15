/**
 * Assemble le VOL. 03 en un document HTML paginé, puis le rend en PDF via
 * Chromium. Aucune dépendance de rendu : le navigateur est déjà là.
 */
import { writeFile, readFile, mkdir, stat, rename, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { meta, manifesto, howToUse, trainPage, network, responsible, checklist, closing, nextVolumes, sourcesNote } from "../data/meta.mjs";
import { destinations } from "../data/destinations.mjs";
import { profiles, awards, comparisonNote, scoreNote } from "../data/editorial.mjs";
import { cover, manifestoPages, howToPage, mapPage, indexPage, resetFolio } from "./render.mjs";
import { destinationPages } from "./render-dest.mjs";
import * as back from "./render-back.mjs";

const run = promisify(execFile);
const OUT = new URL("../out/", import.meta.url);
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const SECTIONS = [
  { id: "comparaison", label: "Alors, on part où ? — le comparatif" },
  { id: "profils", label: "Quelle Italie cherchez-vous ?" },
  { id: "top", label: "Le Top Veyora" },
  { id: "rails", label: "L'Italie commence sur les rails" },
  { id: "reseau", label: "Et si vous n'en faisiez pas qu'une ?" },
  { id: "autrement", label: "Voyager autrement" },
  { id: "pratique", label: "Prêt à partir ?" },
  { id: "sources", label: "Sources & mise à jour" },
];

const buildHtml = async () => {
  resetFolio();
  const css = await readFile(new URL("./styles.css", import.meta.url), "utf8");
  const creditsPath = new URL("../assets/credits.json", import.meta.url);
  const credits = existsSync(creditsPath) ? JSON.parse(await readFile(creditsPath, "utf8")) : {};
  const usedKeys = destinations.flatMap((d) => [d.photos.hero, ...d.photos.secondary]);

  const pages = [
    cover(meta, destinations),
    ...manifestoPages(manifesto),
    howToPage(howToUse),
    mapPage(destinations),
    indexPage(destinations, SECTIONS),
    ...destinations.map((d, i) => destinationPages(d, i, scoreNote)),
    back.comparison(destinations, comparisonNote),
    back.profilesPage(profiles, destinations),
    back.awardsPage(awards, destinations),
    back.trainPageRender(trainPage),
    back.networkPage(network),
    back.responsiblePage(responsible),
    back.checklistPage(checklist),
    back.sourcesPage(sourcesNote),
    back.creditsPage(credits, usedKeys),
    back.lastPage(closing, nextVolumes, meta),
  ];

  const count = pages.join("").match(/class="page /g)?.length ?? 0;
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>VEYORA GUIDES / VOL. 03 — ITALIE</title>
<meta name="author" content="Veyora">
<meta name="description" content="${meta.subtitle}">
<style>${css}</style>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;

  await mkdir(OUT, { recursive: true });
  const htmlPath = new URL("guide.html", OUT);
  await writeFile(htmlPath, html);
  return { htmlPath, count };
};

const toPdf = async (htmlPath) => {
  const pdf = fileURLToPath(new URL("veyora-vol-03-italie.pdf", OUT));
  await run(CHROME, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
    "--run-all-compositor-stages-before-draw", "--virtual-time-budget=30000",
    "--no-pdf-header-footer", "--generate-pdf-document-outline",
    `--print-to-pdf=${pdf}`, htmlPath.href,
  ], { maxBuffer: 1 << 26 });
  return pdf;
};

/** Chromium embarque les bitmaps décodés et suréchantillonne : on corrige. */
const compress = async (pdf) => {
  const script = fileURLToPath(new URL("./compress-pdf.py", import.meta.url));
  const tmp = pdf.replace(/\.pdf$/, ".raw.pdf");
  await rename(pdf, tmp);
  const { stdout } = await run("python3", [script, tmp, pdf, "82", "2400"], { maxBuffer: 1 << 26 });
  process.stdout.write(stdout);
  await unlink(tmp);
};

const main = async () => {
  const { htmlPath, count } = await buildHtml();
  console.log(`HTML : ${count} pages → ${fileURLToPath(htmlPath)}`);
  if (process.argv.includes("--html-only")) return;
  const pdf = await toPdf(htmlPath);
  await compress(pdf);
  const { size } = await stat(pdf);
  console.log(`PDF  : ${(size / 1e6).toFixed(1)} Mo → ${pdf}`);
};

main().catch((e) => { console.error(e); process.exit(1); });
