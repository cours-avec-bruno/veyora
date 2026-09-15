/**
 * Rendu du VOL. 03 — pages d'ouverture et appareil d'entrée.
 * Chaque fonction retourne le HTML d'une page A4.
 */
import { existsSync, readFileSync } from "node:fs";
import { outlinePaths, outlinePath, project, parseCoords } from "./italy-map.mjs";

const PHOTOS = new URL("../assets/print/", import.meta.url);
export const hasPhoto = (key) => key && existsSync(new URL(`${key}.jpg`, PHOTOS));

const CREDITS = (() => {
  try { return JSON.parse(readFileSync(new URL("../assets/credits.json", import.meta.url), "utf8")); }
  catch { return {}; }
})();
/** Rapport largeur / hauteur d'une image retenue, 0 si elle n'existe pas. */
export const photoRatio = (key) => {
  const c = CREDITS[key];
  return c ? c.width / c.height : 0;
};

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** ★★★★☆ — notation éditoriale, jamais présentée comme une mesure. */
export const stars = (n, max = 5) =>
  `<span class="stars">${"★".repeat(n)}<span class="off">${"★".repeat(max - n)}</span></span>`;

export const photo = (key) =>
  hasPhoto(key) ? `<img src="../assets/print/${key}.jpg" alt="">` : "";

/** Ligne de trajet ○——● */
export const routeline = () => `<div class="routeline"><i></i><s></s><i class="full"></i></div>`;

let pageNo = 0;
export const resetFolio = () => { pageNo = 0; };

export const page = (inner, { cls = "", folio = true, left = "", right = "", id = "" } = {}) => {
  pageNo += 1;
  const f = folio
    ? `<div class="folio"><span class="t-micro">${left || "VEYORA GUIDES / VOL. 03"}</span><span class="t-micro">${right || String(pageNo).padStart(2, "0")}</span></div>`
    : "";
  return `<section class="page ${cls}"${id ? ` id="${id}"` : ""}>${inner}${f}</section>`;
};

/* ─────────────────────────────────────────────── COUVERTURE ─────── */

/**
 * La couverture porte le motif du volume : le pays réduit à un contour d'un
 * cheveu et à dix points. Aucune photographie — l'emblème est plus juste.
 */
export const cover = (meta, destinations = []) => {
  const W = 100, H = 128;
  const paths = outlinePaths(W, H);
  const pts = destinations.map((d) => project(parseCoords(d.coords), W, H));
  return page(`
  <div style="position:absolute;right:-14mm;top:16mm;width:120mm;height:196mm;opacity:.55">
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%">
      <path d="${paths.mainland}" fill="none" stroke="#b9c0ab" stroke-width="0.24" stroke-linejoin="round"/>
      <path d="${paths.sicily}"   fill="none" stroke="#b9c0ab" stroke-width="0.24" stroke-linejoin="round"/>
      <path d="${paths.sardinia}" fill="none" stroke="#b9c0ab" stroke-width="0.24" stroke-linejoin="round"/>
      ${pts.map(([x, y]) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="0.8" fill="#b4532e"/>`).join("")}
    </svg>
  </div>

  <div class="pad col" style="color:var(--paper)">
    <div class="row between baseline">
      <span class="t-label" style="color:var(--sage)">${esc(meta.collection)} / VOL. ${esc(meta.volume)}</span>
      <span class="t-micro" style="color:var(--sage)">IT</span>
    </div>

    <div class="auto" style="padding-bottom:1mm">
      <div style="width:34mm;color:var(--sage);margin-bottom:7mm">${routeline()}</div>
      <h1 class="t-mega" style="color:var(--paper)">${esc(meta.title)}</h1>
      <div style="height:8mm"></div>
      <div class="t-h2" style="color:var(--paper);line-height:1.16;letter-spacing:.01em">
        ${meta.coverLines.map((l) => esc(l)).join("<br>")}
      </div>
      <div style="height:10mm"></div>
      <div class="rule" style="border-top-color:rgba(244,240,232,.4)"></div>
      <div style="height:4mm"></div>
      <div class="row between baseline">
        <span class="t-label" style="color:var(--sage)">${esc(meta.kicker)}</span>
        <span class="t-meta" style="color:var(--sage)">${esc(meta.price)}</span>
      </div>
      <div style="height:13mm"></div>
      <div class="row between baseline">
        <span class="serif" style="font-size:20pt;letter-spacing:.17em;color:var(--paper)">VEYORA</span>
        <span class="t-micro" style="color:var(--sage)">${esc(meta.edition)}</span>
      </div>
    </div>
  </div>`, { cls: "page--deep", folio: false });
};

/* ─────────────────────────────────────────────────── MANIFESTE ──── */

export const manifestoPages = (m) => [
  page(`
    <div class="pad col" style="justify-content:center">
      <span class="t-label" style="color:var(--sage)">Manifeste</span>
      <div style="height:8mm"></div>
      <h2 class="t-display" style="color:var(--paper)">${m.lines.map(esc).join("<br>")}</h2>
      <div style="height:10mm"></div>
      <div style="width:40mm;color:var(--sage)">${routeline()}</div>
    </div>`, { cls: "page--dark", left: "MANIFESTE" }),
  page(`
    <div class="pad col">
      <div class="row between baseline">
        <span class="t-label">Manifeste</span><span class="t-micro">II</span>
      </div>
      <div class="auto" style="max-width:114mm;padding-bottom:10mm">
        ${m.body.map((p, i) => `<p class="${i === 0 ? "t-lead" : "t-body"}" style="margin-bottom:6mm">${esc(p)}</p>`).join("")}
        <div class="rule rule--ink" style="width:22mm;margin:8mm 0 5mm"></div>
        <p class="t-h3" style="max-width:104mm">${esc(m.punch)}</p>
      </div>
    </div>`, { left: "MANIFESTE" }),
];

/* ──────────────────────────────────────── COMMENT UTILISER ──────── */

export const howToPage = (h) => page(`
  <div class="pad col">
    <span class="t-label">Mode d'emploi</span>
    <h2 class="t-h1" style="margin-top:3mm;max-width:104mm">${esc(h.title.charAt(0) + h.title.slice(1).toLowerCase())}</h2>
    <p class="t-lead" style="margin-top:5mm;max-width:112mm">${esc(h.intro)}</p>
    <div class="rule rule--ink" style="margin-top:7mm"></div>

    <div style="margin-top:1mm">
      ${h.steps.map((s) => `
        <div style="display:grid;grid-template-columns:11mm 44mm 1fr;gap:4mm;padding:5.4mm 0;border-bottom:.3pt solid var(--line);align-items:baseline">
          <span class="t-meta clay">${s.n}</span>
          <span class="t-h3">${esc(s.label)}</span>
          <p class="t-small">${esc(s.text)}</p>
        </div>`).join("")}
    </div>

    <div class="auto note" style="max-width:120mm;padding-bottom:2mm">
      <p class="t-small">${esc(h.note)}</p>
    </div>
  </div>`, { left: "MODE D'EMPLOI", id: "mode-emploi" });

/* ─────────────────────────────────────────────── CARTE ITALIE ───── */

/** Décalage d'étiquette quand deux points se serrent. [dx, dy] */
const NUDGE = {
  "01": [-7.5, 0.6],   // Turin, contre le bord ouest
  "03": [-8.5, -1.4],  // Lac Majeur, au-dessus de Turin
  "02": [-7.5, 3.2],   // Gênes, sous Turin
  "05": [1.2, 3.4],    // Mantoue, sous Bolzano
  "09": [-7.5, 1.4],   // Lucques, côté mer
};

export const mapPage = (destinations) => {
  const W = 100, H = 128;
  const paths = outlinePaths(W, H);
  const pts = destinations.map((d) => {
    const [x, y] = project(parseCoords(d.coords), W, H);
    const [dx, dy] = NUDGE[d.n] ?? [2.8, 1.1];
    return { d, x, y, dx, dy };
  });

  return page(`
  <div class="pad col">
    <div class="row between baseline">
      <span class="t-label">La carte</span>
      <span class="t-micro">10 POINTS / 1 PAYS</span>
    </div>
    <div class="rule rule--ink" style="margin-top:2.4mm"></div>

    <div class="fill" style="position:relative;margin:6mm 0 4mm">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"
           style="position:absolute;inset:0;width:100%;height:100%">
        <path d="${paths.mainland}" fill="#ebe5d8" stroke="#bfb5a1" stroke-width="0.3" stroke-linejoin="round"/>
        <path d="${paths.sicily}"   fill="#ebe5d8" stroke="#bfb5a1" stroke-width="0.3" stroke-linejoin="round"/>
        <path d="${paths.sardinia}" fill="#ebe5d8" stroke="#bfb5a1" stroke-width="0.3" stroke-linejoin="round"/>
        ${pts.map((p) => `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="1.5" fill="none" stroke="#b4532e" stroke-width="0.6" opacity=".5"/>`).join("")}
        ${pts.map((p) => `
          <circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="1.3" fill="#b4532e"/>
          <text x="${(p.x + p.dx).toFixed(2)}" y="${(p.y + p.dy).toFixed(2)}"
                font-family="Geist Mono" font-size="2.7" fill="#161614">${p.d.n}</text>`).join("")}
      </svg>
    </div>

    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:2.6mm 3mm">
      ${destinations.map((d) => `
        <div style="border-top:.3pt solid var(--line-2);padding-top:1.6mm">
          <span class="t-meta clay">${d.n}</span>
          <div class="t-micro" style="margin-top:.5mm;letter-spacing:.09em">${esc(d.name)}</div>
        </div>`).join("")}
    </div>
  </div>`, { left: "LA CARTE", id: "carte" });
};

/* ──────────────────────────────────────────────────── INDEX ─────── */

export const indexPage = (destinations, sections) => page(`
  <div class="pad col">
    <h2 class="t-h1" style="max-width:104mm">10 destinations.<br>10 visages de l'Italie.</h2>
    <div class="rule rule--ink" style="margin-top:5mm"></div>
    <table class="tbl" style="margin-top:3mm">
      <thead><tr>
        <th style="width:7mm"></th><th style="width:33mm">Destination</th><th>Région</th>
        <th>Budget</th><th>Durée</th><th>Style</th>
      </tr></thead>
      <tbody>
        ${destinations.map((d) => `
          <tr>
            <td class="n"><a href="#d-${d.n}">${d.n}</a></td>
            <td class="name"><a href="#d-${d.n}">${esc(d.name)}</a>${d.subname ? `<span class="t-micro" style="display:block">${esc(d.subname)}</span>` : ""}</td>
            <td class="num">${esc(d.region.split(" / ")[0])}</td>
            <td class="num">${esc(d.budget.total.replace(/ /g, " "))}</td>
            <td class="num">${esc(d.days.replace(" JOURS", " j").replace(" – ", "–"))}</td>
            <td style="font-size:7pt">${esc(d.style)}</td>
          </tr>`).join("")}
      </tbody>
    </table>

    <div class="auto" style="padding-bottom:2mm">
      <div class="rule" style="margin-bottom:3.5mm"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 9mm">
        ${sections.map((s) => `
          <a href="#${s.id}" style="display:block;padding:1.7mm 0;border-bottom:.3pt solid var(--line)">
            <span class="t-small" style="color:var(--ink)">${esc(s.label)}</span>
          </a>`).join("")}
      </div>
      <div class="t-micro" style="margin-top:3.5mm">Le sommaire et la carte sont cliquables</div>
    </div>
  </div>`, { left: "INDEX", id: "index" });
