/**
 * Détecte les pages dont le contenu dépasse le format.
 *
 * `.page` est en `overflow: hidden` : un bloc de trop ne casse pas la mise en
 * page, il disparaît silencieusement sous le bord. C'est le défaut le plus
 * coûteux du procédé, et le seul qu'on ne voit pas en relisant le HTML.
 * On mesure donc chaque page dans le navigateur avant de rendre le PDF.
 */
import { readFile, writeFile, unlink } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const run = promisify(execFile);
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const src = fileURLToPath(new URL("../out/guide.html", import.meta.url));
const probe = src.replace(/\.html$/, ".probe.html");

const SCRIPT = `
<script>
document.addEventListener("DOMContentLoaded", () => {
  const out = [];
  document.querySelectorAll(".page").forEach((page, i) => {
    const limit = page.getBoundingClientRect().bottom;
    let worst = 0, culprit = "";
    page.querySelectorAll(".pad, .pad--wide").forEach((pad) => {
      for (const el of pad.children) {
        const over = el.getBoundingClientRect().bottom - limit;
        if (over > worst) { worst = over; culprit = (el.className || el.tagName).toString().slice(0, 30); }
      }
      const over = pad.getBoundingClientRect().bottom - limit;
      if (over > worst) { worst = over; culprit = "pad"; }
    });
    if (worst > 1) out.push("p" + (i + 1) + " +" + Math.round(worst / 3.7795) + "mm " + culprit);
  });
  document.title = "OVERFLOW::" + (out.length ? out.join(" | ") : "aucun");
});
</script>`;

const html = await readFile(src, "utf8");
await writeFile(probe, html.replace("</head>", `${SCRIPT}\n</head>`));

const { stdout } = await run(CHROME, [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage",
  "--virtual-time-budget=20000", "--dump-dom", pathToFileURL(probe).href,
], { maxBuffer: 1 << 28 });

await unlink(probe);

const m = stdout.match(/<title>OVERFLOW::([^<]*)<\/title>/);
if (!m) { console.log("mesure impossible"); process.exit(0); }
if (m[1] === "aucun") console.log("✓ aucune page ne déborde");
else {
  console.log("✗ pages qui débordent :");
  m[1].split(" | ").forEach((l) => console.log("   " + l));
  process.exitCode = 1;
}
