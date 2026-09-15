/**
 * Les cinq pages d'une destination.
 * Une ouverture pleine page, puis quatre fiches : pourquoi, quoi,
 * combien/comment/quand, et où. Le découpage suit la règle du volume —
 * quand une page se charge, elle se divise.
 */
import { page, esc, stars, hasPhoto, photoRatio } from "./render.mjs";
import { outlinePath, project, parseCoords } from "./france-map.mjs";

const photo = (key) =>
  hasPhoto(key) ? `<img src="../assets/photos/${key}.jpg" alt="">` : "";

const routeline = (color = "currentColor") =>
  `<div class="routeline" style="color:${color}"><i></i><s></s><i class="full"></i></div>`;

/**
 * Hauteur d'une bande pleine largeur : celle qui laisse l'image entière.
 * Recadrer une photo de lac dans une bande trop haute ne montre que le ciel.
 */
const bandHeight = (key, width = 210, min = 78, max = 172) => {
  const r = photoRatio(key) || 1.5;
  return Math.max(min, Math.min(max, Math.round(width / r)));
};

/**
 * Repère de situation : le pays réduit à un contour d'un cheveu, un seul
 * point. Le lecteur sait où il est sans quitter la page.
 */
const locator = (d, light = false) => {
  const W = 100, H = 118;
  const [x, y] = project(parseCoords(d.coords), W, H);
  const stroke = light ? "rgba(244,240,232,.55)" : "#bfb5a1";
  return `<svg viewBox="0 0 ${W} ${H}" style="width:20mm;height:23.6mm;display:block">
    <path d="${outlinePath(W, H)}" fill="none" stroke="${stroke}" stroke-width="0.5" stroke-linejoin="round"/>
    <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4" fill="none" stroke="#b4532e" stroke-width="0.6" opacity=".55"/>
    <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.4" fill="#b4532e"/>
  </svg>`;
};

const ICONS = { market: "MAR", restaurant: "TAB", cafe: "CAF", bar: "BAR", breakfast: "PDJ" };

const ratingRows = (r) => [
  ["Trajet", r.trajet], ["Budget", r.budget], ["Nature", r.nature],
  ["Culture", r.culture], ["Sans voiture", r.sansVoiture],
];

const full = (d) => `${esc(d.name)}${d.subname ? " " + esc(d.subname) : ""}`;

/* ── A · IMMERSION ───────────────────────────────────────────────── */

/**
 * Trois mises en page, choisies d'après le format réel de la photographie.
 * Une image en paysage forcée dans une pleine page portrait perd la moitié
 * de sa largeur : elle prend donc une bande, et le texte occupe le papier.
 */
const pageImmersion = (d, i) => {
  const key = d.photos.hero;
  const r = photoRatio(key);
  const mode = !hasPhoto(key) ? "field" : r < 0.95 ? "bleed" : "band";
  const low = i % 2 === 1;                       // alterne haut / bas

  const meta = (light) => `
    <div class="rule" style="border-top-color:${light ? "rgba(244,240,232,.4)" : "var(--line-2)"};margin:6mm 0 3.5mm"></div>
    <div class="row between center">
      <span class="t-label"${light ? ' style="color:rgba(244,240,232,.85)"' : ""}>${esc(d.days)}</span>
      <span class="t-label"${light ? ' style="color:rgba(244,240,232,.85)"' : ""}>${esc(d.kind)}</span>
      <span class="t-label"${light ? ' style="color:rgba(244,240,232,.85)"' : ""}>Sans voiture ${stars(d.ratings.sansVoiture)}</span>
    </div>`;

  /** Le repère se pose dans l'angle libre, jamais sur le texte. */
  const mark = (light) => `<div style="position:absolute;right:var(--m);${light ? "top:26mm" : "top:6mm"};opacity:.9">${locator(d, light)}</div>`;

  const title = (light) => `
    <div style="width:26mm;margin-bottom:5mm;color:${light ? "rgba(244,240,232,.8)" : "var(--line-2)"}">${routeline()}</div>
    <h2 class="t-giant"${light ? ' style="color:var(--paper)"' : ""}>${esc(d.name)}</h2>
    ${d.subname ? `<div class="t-h2" style="color:${light ? "rgba(244,240,232,.82)" : "var(--muted)"};margin-top:1mm">${esc(d.subname)}</div>` : ""}
    <p class="t-lead" style="${light ? "color:rgba(244,240,232,.92);" : ""}margin-top:5mm;max-width:112mm">${esc(d.lede)}</p>`;

  const head = (light) => `
    <div class="row between baseline">
      <span class="t-label"${light ? ' style="color:rgba(244,240,232,.75)"' : ""}>${esc(d.region)}</span>
      <span class="t-micro"${light ? ' style="color:rgba(244,240,232,.65)"' : ""}>FR / ${esc(d.coords)}</span>
    </div>`;

  /* Pleine page — réservée aux images verticales, qui la supportent. */
  if (mode === "bleed") {
    return page(`
      <div class="bleed">${photo(key)}</div>
      <div class="scrim"></div>
      ${mark(true)}
      <div class="pad col" style="color:var(--paper)">
        ${head(true)}
        <div class="row" style="margin-top:6mm;${i % 2 ? "justify-content:flex-end" : ""}">
          <span class="t-mega" style="color:var(--paper);opacity:.92">${d.n}</span>
        </div>
        <div class="auto" style="padding-bottom:3mm;max-width:132mm">
          ${title(true)}${meta(true)}
        </div>
      </div>`, { folio: false, id: `d-${d.n}` });
  }

  /* Bande photographique — le cas courant. */
  if (mode === "band") {
    const bandH = bandHeight(key, 210, 86, 158);
    const bandStyle = low
      ? `bottom:0;height:${bandH}mm`
      : `top:0;height:${bandH}mm`;
    return page(`
      <div class="frame" style="position:absolute;left:0;right:0;${bandStyle}">${photo(key)}</div>
      <div class="pad col" style="${low ? `bottom:auto;height:${297 - bandH - 13}mm` : `top:${bandH + 13}mm;bottom:13mm;height:auto`}">
        ${low ? head(false) : ""}
        <div class="${low ? "auto" : ""}" style="${low ? "padding-bottom:2mm" : ""}">
          <div class="row between end" style="margin-bottom:5mm">
            <span class="t-mega" style="font-size:58pt;line-height:.8;color:var(--clay)">${d.n}</span>
            <div style="text-align:right">
              ${locator(d)}
              <span class="t-micro" style="display:block;margin-top:1.6mm">FR / ${esc(d.coords)}</span>
            </div>
          </div>
          ${title(false)}${meta(false)}
        </div>
      </div>`, { folio: false, id: `d-${d.n}` });
  }

  /* Sans photographie — la page tient sur la typographie et le vide. */
  return page(`
    ${mark(true)}
    <div class="pad col">
      ${head(true)}
      <div class="row" style="margin-top:8mm"><span class="t-mega" style="color:var(--paper);opacity:.9">${d.n}</span></div>
      <div class="auto" style="padding-bottom:3mm;max-width:132mm">${title(true)}${meta(true)}</div>
    </div>`, { cls: "page--dark", folio: false, id: `d-${d.n}` });
};

/* ── B · POURQUOI ICI ? ──────────────────────────────────────────── */

const pageWhy = (d) => page(`
  <div class="pad col">
    <div class="row between baseline">
      <span class="t-label">${esc(d.name)}</span>
      <span class="t-micro">${d.n} / 10</span>
    </div>
    <div class="rule rule--ink" style="margin-top:2.4mm"></div>

    <h3 class="t-h1" style="margin-top:9mm">Pourquoi ici ?</h3>

    <div class="t-body" style="margin-top:6mm;max-width:118mm">
      ${d.why.map((p) => `<p>${esc(p)}</p>`).join("")}
    </div>

    <div style="margin-top:9mm" class="block">
      <span class="t-label">Parfait pour</span>
      <div class="tags">${d.perfectFor.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </div>

    ${d.photos.secondary[1] && hasPhoto(d.photos.secondary[1]) ? `
      <div class="frame" style="height:${bandHeight(d.photos.secondary[1], 174, 46, 66)}mm;margin-top:9mm">${photo(d.photos.secondary[1])}</div>` : ""}

    <div class="auto" style="padding-bottom:2mm">
      <div class="block">
        <span class="t-label">Indicateur Veyora</span>
        <div class="rule"></div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3mm">
          ${ratingRows(d.ratings).map(([l, v]) => `
            <div>
              <div class="t-micro" style="margin-bottom:1.4mm">${esc(l)}</div>
              ${stars(v)}
            </div>`).join("")}
        </div>
        <div class="t-micro" style="margin-top:3.5mm">Notation éditoriale Veyora — un avis, pas une mesure</div>
      </div>
    </div>
  </div>`, { left: `${full(d)} — ${d.n} / 10` });

/* ── C · TROIS CHOSES À FAIRE + LE TIP ───────────────────────────── */

const pageThings = (d) => page(`
  <div class="frame" style="position:absolute;inset:0 0 auto 0;height:${bandHeight(d.photos.secondary[0], 210, 80, 104)}mm">${photo(d.photos.secondary[0])}</div>
  <div class="pad col" style="top:auto;bottom:13mm;height:auto;max-height:${297 - bandHeight(d.photos.secondary[0], 210, 80, 104) - 20}mm">
    <div class="block">
      <span class="t-label">Trois choses à faire</span>
      <div class="rule rule--ink"></div>
      ${d.things.map((t, i) => `
        <div style="display:grid;grid-template-columns:9mm 1fr;gap:3mm;padding:4mm 0;${i < 2 ? "border-bottom:.3pt solid var(--line)" : ""}">
          <span class="t-meta clay">${t.n}</span>
          <div>
            <div class="t-micro" style="margin-bottom:1.2mm">${esc(t.kind)}</div>
            <div class="t-h3">${esc(t.title)}</div>
            <p class="t-small" style="margin-top:1.6mm;max-width:112mm">${esc(t.text)}</p>
          </div>
        </div>`).join("")}
    </div>

    <div class="tip" style="margin-top:7mm">
      <div class="row between baseline" style="margin-bottom:3mm">
        <span class="t-label">Le tip Veyora</span>
        <span class="t-micro" style="color:var(--sage)">${d.n} / 10</span>
      </div>
      <p class="t-body" style="font-size:9.6pt">${esc(d.tip)}</p>
    </div>
  </div>`, { left: `${full(d)} — ${d.n} / 10` });

/* ── D · COMBIEN, COMMENT, QUAND ─────────────────────────────────── */

const budgetBlock = (d) => {
  const vals = d.budget.lines.map((l) => parseInt(String(l.value).replace(/\D/g, ""), 10) || 0);
  const max = Math.max(...vals, 1);
  return `
  <div class="block">
    <span class="t-label">Combien prévoir ?</span>
    <div class="rule rule--ink"></div>
    <div class="budget-total" style="margin-bottom:5mm">
      <span class="t-display">${esc(d.budget.total)}</span>
      <span class="t-micro" style="max-width:34mm;line-height:1.5">${esc(d.budget.basis)}</span>
    </div>
    <div class="budget-lines">
      ${d.budget.lines.map((l, i) => `
        <div class="budget-row">
          <span class="t-small">${esc(l.label)}</span>
          <span class="bar"><span class="${i === 0 ? "accent" : ""}" style="width:${Math.round((vals[i] / max) * 100)}%"></span></span>
          <span class="t-meta">${esc(l.value)}</span>
        </div>`).join("")}
    </div>
    <div class="t-micro" style="margin-top:3.5mm;line-height:1.5">Ordres de grandeur pour un voyage économique à intermédiaire, variables selon la saison et la réservation</div>
  </div>`;
};

const pagePractical = (d) => page(`
  <div class="pad col">
    <div class="row between baseline">
      <span class="t-label">${esc(d.name)}</span>
      <span class="t-micro">${d.n} / 10</span>
    </div>
    <div class="rule rule--ink" style="margin-top:2.4mm"></div>

    <div style="margin-top:8mm">${budgetBlock(d)}</div>

    <div class="block" style="margin-top:9mm">
      <span class="t-label">Le trajet</span>
      <div class="rule"></div>
      <div class="legs">
        ${d.trip.from.map((f) => `
          <div class="leg">
            <span><span class="t-small" style="color:var(--ink)">Depuis ${esc(f.city)}</span>
              <span class="t-micro" style="margin-left:2.5mm">${esc(f.mode)}</span></span>
            <span class="t-meta" style="color:var(--ink)">${esc(f.time)}</span>
          </div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:auto 1fr;gap:4mm;margin-top:4.5mm;align-items:start">
        <div style="border:.4pt solid var(--clay);padding:2.2mm 3mm;text-align:center;min-width:26mm">
          <div class="t-micro clay" style="margin-bottom:.8mm">Notre choix</div>
          <div class="t-h3 clay" style="font-size:11.5pt">${esc(d.trip.choice)}</div>
        </div>
        <p class="t-small">${esc(d.trip.why)}</p>
      </div>
      ${d.trip.warning ? `<div class="note" style="margin-top:4mm"><span class="t-micro clay">À vérifier</span><p class="t-small" style="margin-top:.8mm">${esc(d.trip.warning)}</p></div>` : ""}
    </div>

    <div class="auto" style="padding-bottom:2mm">
      <div class="block">
        <span class="t-label">Quand partir ?</span>
        <div class="rule"></div>
        <div class="seasons">
          ${[["Printemps", d.season.spring], ["Été", d.season.summer], ["Automne", d.season.autumn], ["Hiver", d.season.winter]]
            .map(([l, v]) => `<div class="season"><div class="t-micro" style="margin-bottom:1.3mm">${esc(l)}</div>${stars(v)}</div>`).join("")}
        </div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:4mm;margin-top:4.5mm;align-items:baseline">
          <span class="t-h3">Notre période : <span class="clay">${esc(d.season.pick)}</span></span>
          <p class="t-small">${esc(d.season.why)}</p>
        </div>
      </div>
    </div>
  </div>`, { left: `${full(d)} — ${d.n} / 10` });

/* ── E · OÙ MANGER, QUOI ÉVITER, QUEL COMPROMIS ──────────────────── */

const pageAddresses = (d, note) => page(`
  <div class="pad col">
    <div class="row between baseline">
      <span class="t-label">${esc(d.name)}</span>
      <span class="t-micro">${d.n} / 10</span>
    </div>
    <div class="rule rule--ink" style="margin-top:2.4mm"></div>

    <div class="block" style="margin-top:8mm">
      <span class="t-label">Bonnes adresses</span>
      ${d.addresses.map((a) => `
        <div class="addr">
          <span class="addr-ico">${ICONS[a.icon] ?? "—"}</span>
          <div>
            <div class="row between baseline" style="gap:3mm">
              <span class="t-h3" style="font-size:12pt">${esc(a.name)}</span>
              <span class="t-meta" style="white-space:nowrap">${esc(a.price)}</span>
            </div>
            <div class="t-micro" style="margin:.8mm 0 1.4mm">${esc(a.area)}</div>
            <p class="t-small">${esc(a.why)}</p>
          </div>
        </div>`).join("")}
      <div class="t-micro" style="margin-top:3mm;line-height:1.5">Seules les institutions publiques sont nommées. Les tables sont indiquées par type et par quartier — voir « Sources &amp; mise à jour »</div>
    </div>

    <div class="grid2" style="gap:0 9mm;margin-top:9mm">
      <div class="block">
        <span class="t-label">À goûter</span>
        <div class="rule"></div>
        <div class="tags" style="margin-bottom:3mm">${d.taste.items.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <p class="t-small">${esc(d.taste.where)}</p>
      </div>
      <div class="block">
        <span class="t-label">Comme un local</span>
        <div class="rule"></div>
        <p class="t-small">${esc(d.local)}</p>
        <div style="height:5mm"></div>
        <span class="t-label">À éviter</span>
        <div class="rule"></div>
        <p class="t-small">${esc(d.avoid)}</p>
      </div>
    </div>

    <div class="auto" style="padding-bottom:2mm">
      <div style="background:var(--paper-2);padding:6mm 6.5mm">
        <span class="t-label t-label--clay">Le bon compromis</span>
        <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:5mm;align-items:center;margin-top:3.5mm">
          <div class="t-h3">${esc(d.compromise.do)}</div>
          <div class="t-micro" style="text-align:center">plutôt que</div>
          <div class="t-h3 muted">${esc(d.compromise.rather)}</div>
        </div>
        <p class="t-small" style="margin-top:3.5mm">${esc(d.compromise.why)}</p>
      </div>
      ${d.crossSell ? `<p class="t-micro" style="margin-top:3.5mm;line-height:1.6">Envie d'aller plus loin ? ${esc(d.crossSell)}</p>` : ""}
      ${note ? `<div class="note" style="margin-top:4mm"><span class="t-micro clay">Field note ${note.n}</span><p class="t-small italic" style="margin-top:.8mm">${esc(note.text)}</p></div>` : ""}
    </div>
  </div>`, { left: `${full(d)} — ${d.n} / 10` });

/* ── assemblage ──────────────────────────────────────────────────── */

export const destinationPages = (d, i, note) => [
  pageImmersion(d, i),
  pageWhy(d),
  pageThings(d),
  pagePractical(d),
  pageAddresses(d, note),
].join("\n");
