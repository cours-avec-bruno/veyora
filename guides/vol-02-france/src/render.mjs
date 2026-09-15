/**
 * Rendu des pages du VOL. 02.
 * Chaque fonction retourne le HTML d'une page A4. Aucune ne dépasse
 * une idée : quand un bloc alourdit une page, il passe à la suivante.
 */
import { existsSync, readFileSync } from "node:fs";
import { outlinePath, project, parseCoords } from "./france-map.mjs";

const PHOTOS = new URL("../assets/print/", import.meta.url);
export const hasPhoto = (key) => key && existsSync(new URL(`${key}.jpg`, PHOTOS));

/** Rapport largeur / hauteur d'une image retenue, 0 si elle n'existe pas. */
const CREDITS = (() => {
  try { return JSON.parse(readFileSync(new URL("../assets/credits.json", import.meta.url), "utf8")); }
  catch { return {}; }
})();
export const photoRatio = (key) => {
  const c = CREDITS[key];
  return c ? c.width / c.height : 0;
};
const src = (key) => `../assets/print/${key}.jpg`;

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** ★★★★☆ — notation éditoriale, jamais présentée comme une mesure. */
export const stars = (n, max = 5) =>
  `<span class="stars">${"★".repeat(n)}<span class="off">${"★".repeat(max - n)}</span></span>`;

const img = (key, cls = "") =>
  hasPhoto(key)
    ? `<img src="${src(key)}" alt="">`
    : `<div class="${cls}" style="width:100%;height:100%;background:var(--paper-3)"></div>`;

/** Ligne de trajet ○——● */
const routeline = () => `<div class="routeline"><i></i><s></s><i class="full"></i></div>`;

let pageNo = 0;
export const resetFolio = () => { pageNo = 0; };

/**
 * Enveloppe de page. `folio` : false pour les pages sans numéro
 * (couverture, pages de silence).
 */
export const page = (inner, { cls = "", folio = true, left = "", right = "", id = "" } = {}) => {
  pageNo += 1;
  const f = folio
    ? `<div class="folio"><span class="t-micro">${left || "VEYORA GUIDES / VOL. 02"}</span><span class="t-micro">${right || String(pageNo).padStart(2, "0")}</span></div>`
    : "";
  return `<section class="page ${cls}"${id ? ` id="${id}"` : ""}>${inner}${f}</section>`;
};

/* ─────────────────────────────────────────────── COUVERTURE ─────── */

/**
 * La couverture ne repose pas sur une photographie : elle repose sur le
 * motif du volume — un pays réduit à un contour d'un cheveu et à dix points.
 * C'est l'emblème le plus juste d'un guide qui parle de trajets.
 */
export const cover = (meta, destinations = []) => {
  const W = 100, H = 118;
  const pts = destinations.map((d) => project(parseCoords(d.coords), W, H));
  return page(`
  <div style="position:absolute;right:-26mm;top:12mm;width:150mm;height:180mm;opacity:.5">
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%">
      <path d="${outlinePath(W, H)}" fill="none" stroke="#b9c0ab" stroke-width="0.22" stroke-linejoin="round"/>
      ${pts.map(([x, y]) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="0.75" fill="#b4532e"/>`).join("")}
    </svg>
  </div>

  <div class="pad col" style="color:var(--paper)">
    <div class="row between baseline">
      <span class="t-label" style="color:var(--sage)">${esc(meta.collection)} / VOL. ${esc(meta.volume)}</span>
      <span class="t-micro" style="color:var(--sage)">FR</span>
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

/* ───────────────────────────────────────────────── OUVERTURE ─────── */

export const openingPage = (opening) => page(`
  <div class="pad col">
    <div class="row between baseline">
      <span class="t-label">Ouverture</span>
      <span class="t-micro">FR / 46.60 / 2.35</span>
    </div>
    <div style="margin-top:38mm">
      <h2 class="t-giant">${opening.lines.map(esc).join("<br>")}</h2>
    </div>
    <div class="auto" style="max-width:118mm;padding-bottom:6mm">
      <div class="rule rule--ink" style="width:22mm;margin-bottom:6mm"></div>
      <div class="t-body">${opening.body.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
    </div>
  </div>`, { left: "OUVERTURE" });

/* ─────────────────────────────────────────────────── SOMMAIRE ───── */

export const toc = (destinations, sections) => page(`
  <div class="pad col">
    <span class="t-label">Sommaire</span>
    <div class="rule rule--ink" style="margin-top:2.4mm"></div>

    <div style="margin-top:8mm;display:grid;grid-template-columns:1fr 1fr;gap:0 12mm">
      <div>
        <div class="t-micro" style="margin-bottom:3.5mm">Les dix destinations</div>
        ${destinations.map((d) => `
          <a href="#d-${d.n}" style="display:grid;grid-template-columns:7mm 1fr;gap:2mm;padding:1.9mm 0;border-bottom:.3pt solid var(--line)">
            <span class="t-meta" style="color:var(--clay)">${d.n}</span>
            <span>
              <span class="serif" style="font-size:11.5pt;line-height:1.05">${esc(d.name)}</span>
              <span class="t-micro" style="display:block;margin-top:.6mm">${esc(d.region.replace("FRANCE / ", ""))}</span>
            </span>
          </a>`).join("")}
      </div>
      <div>
        <div class="t-micro" style="margin-bottom:3.5mm">Le reste du volume</div>
        ${sections.map((s) => `
          <a href="#${s.id}" style="display:grid;grid-template-columns:7mm 1fr;gap:2mm;padding:1.9mm 0;border-bottom:.3pt solid var(--line)">
            <span class="t-meta muted">—</span>
            <span class="t-small" style="color:var(--ink)">${esc(s.label)}</span>
          </a>`).join("")}
      </div>
    </div>

    <div class="auto note" style="max-width:104mm">
      <div class="t-small">Le sommaire est cliquable. Chaque destination s'ouvre sur une page pleine, puis quatre pages de fiche : pourquoi, combien, comment, et quoi en faire.</div>
    </div>
  </div>`, { left: "SOMMAIRE", id: "sommaire" });

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
        <span class="t-label">Manifeste</span>
        <span class="t-micro">II</span>
      </div>
      <div class="auto" style="max-width:112mm;padding-bottom:10mm">
        ${m.body.map((p, i) => `<p class="${i === 0 ? "t-lead" : "t-body"}" style="margin-bottom:6mm">${esc(p)}</p>`).join("")}
        <div class="rule rule--ink" style="width:22mm;margin:8mm 0 5mm"></div>
        <p class="t-small italic">${esc(m.note)}</p>
      </div>
    </div>`, { left: "MANIFESTE" }),
];

/* ──────────────────────────────────────────────── CARTE FRANCE ──── */

/** Décalage de l'étiquette quand deux points sont proches. [dx, dy] */
const LABEL_NUDGE = {
  "07": [-6.5, 1.1],   // Arles, serré contre Sète
  "06": [2.6, 3.0],    // Sète, sous Arles
  "01": [2.6, -1.4],   // Annecy, au-dessus de Briançon
};

export const mapPage = (destinations) => {
  const W = 100, H = 118;
  const pts = destinations.map((d) => {
    const [x, y] = project(parseCoords(d.coords), W, H);
    const [dx, dy] = LABEL_NUDGE[d.n] ?? [2.7, 1.1];
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
        <path d="${outlinePath(W, H)}" fill="#ebe5d8" stroke="#bfb5a1" stroke-width="0.32"
              stroke-linejoin="round"/>
        ${pts.map((p) => `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="0.9" fill="none" stroke="#b4532e" stroke-width="0.7" opacity=".5"/>`).join("")}
        ${pts.map((p) => `
          <circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="1.45" fill="#b4532e"/>
          <text x="${(p.x + p.dx).toFixed(2)}" y="${(p.y + p.dy).toFixed(2)}"
                font-family="Geist Mono" font-size="2.9" fill="#161614">${p.d.n}</text>`).join("")}
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

export const indexPage = (destinations) => page(`
  <div class="pad col">
    <h2 class="t-h1" style="max-width:96mm">10 destinations.<br>10 façons de partir.</h2>
    <div class="rule rule--ink" style="margin-top:6mm"></div>
    <table class="tbl" style="margin-top:4mm">
      <thead><tr>
        <th style="width:8mm"></th><th>Destination</th><th>Région</th>
        <th>Depuis Paris</th><th>Budget</th><th>Type</th>
      </tr></thead>
      <tbody>
        ${destinations.map((d) => `
          <tr>
            <td class="n">${d.n}</td>
            <td class="name">${esc(d.name)}${d.subname ? `<span class="t-micro" style="display:block">${esc(d.subname)}</span>` : ""}</td>
            <td class="num">${esc(d.region.replace("FRANCE / ", ""))}</td>
            <td class="num">${esc(d.trip.from[0].time)}</td>
            <td class="num">${esc(d.budget.total)}</td>
            <td>${esc(d.kind)}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <div class="auto t-micro" style="padding-bottom:2mm">Budgets pour 3 jours / 2 nuits, par personne · ordres de grandeur</div>
  </div>`, { left: "INDEX", id: "index" });
