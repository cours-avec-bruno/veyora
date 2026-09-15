/**
 * Les pages d'une destination — trois ou quatre selon ce qu'elle a à dire.
 *
 * À quatre pages : ouverture, pourquoi, pratique, local.
 * À trois pages : l'ouverture porte aussi le « pourquoi », ce qui change la
 * composition autant que la longueur — et donne son rythme au volume.
 */
import { page, esc, stars, hasPhoto, photoRatio, photo, routeline } from "./render.mjs";
import { outlinePath, project, parseCoords } from "./italy-map.mjs";

const ICONS = {
  mercato: "MER", trattoria: "TRA", caffe: "CAF",
  aperitivo: "APE", panetteria: "PAN", gelateria: "GEL",
};

const full = (d) => `${esc(d.name)}${d.subname ? " " + esc(d.subname) : ""}`;

/**
 * Hauteur d'une bande pleine largeur : celle qui laisse l'image entière.
 * Recadrer une photo de lac dans une bande trop haute ne montre que le ciel.
 */
const bandHeight = (key, width = 210, min = 78, max = 172) => {
  const r = photoRatio(key) || 1.5;
  return Math.max(min, Math.min(max, Math.round(width / r)));
};

/** Repère de situation : le pays d'un trait, un seul point. */
const locator = (d, light = false) => {
  const W = 100, H = 128;
  const [x, y] = project(parseCoords(d.coords), W, H);
  return `<svg viewBox="0 0 ${W} ${H}" style="width:17mm;height:21.8mm;display:block">
    <path d="${outlinePath(W, H)}" fill="none" stroke="${light ? "rgba(244,240,232,.55)" : "#bfb5a1"}" stroke-width="0.55" stroke-linejoin="round"/>
    <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.6" fill="none" stroke="#b4532e" stroke-width="0.6" opacity=".55"/>
    <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.2" fill="#b4532e"/>
  </svg>`;
};

/* ── briques réutilisables ───────────────────────────────────────── */

const metaRow = (d, light = false) => `
  <div class="rule" style="border-top-color:${light ? "rgba(244,240,232,.4)" : "var(--line-2)"};margin:6mm 0 3.5mm"></div>
  <div class="row between center">
    <span class="t-label"${light ? ' style="color:rgba(244,240,232,.85)"' : ""}>${esc(d.days)}</span>
    <span class="t-label"${light ? ' style="color:rgba(244,240,232,.85)"' : ""}>${esc(d.style)}</span>
    <span class="t-label"${light ? ' style="color:rgba(244,240,232,.85)"' : ""}>Sans voiture ${stars(d.ratings.sansVoiture)}</span>
  </div>`;

const titleBlock = (d, light = false) => `
  <div style="width:26mm;margin-bottom:5mm;color:${light ? "rgba(244,240,232,.8)" : "var(--line-2)"}">${routeline()}</div>
  <h2 class="t-giant"${light ? ' style="color:var(--paper)"' : ""}>${esc(d.name)}</h2>
  ${d.subname ? `<div class="t-h2" style="color:${light ? "rgba(244,240,232,.82)" : "var(--muted)"};margin-top:1mm">${esc(d.subname)}</div>` : ""}
  <p class="t-lead" style="${light ? "color:rgba(244,240,232,.92);" : ""}margin-top:5mm;max-width:114mm">${esc(d.lede)}</p>`;

const ratingsBlock = (d, scoreNote) => `
  <div class="block">
    <span class="t-label">Indicateurs Veyora</span>
    <div class="rule"></div>
    <div style="display:grid;grid-template-columns:1fr auto;gap:7mm;align-items:center">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3.4mm 4mm">
        ${[["Budget", d.ratings.budget], ["Accessibilité", d.ratings.accessibilite], ["Culture", d.ratings.culture],
           ["Gastronomie", d.ratings.gastronomie], ["Nature", d.ratings.nature], ["Sans voiture", d.ratings.sansVoiture]]
          .map(([l, v]) => `<div><div class="t-micro" style="margin-bottom:1.2mm">${esc(l)}</div>${stars(v)}</div>`).join("")}
      </div>
      <div style="text-align:right;border-left:.3pt solid var(--line-2);padding-left:7mm">
        <div class="t-micro" style="margin-bottom:.6mm">Score Veyora</div>
        <span class="t-display clay" style="font-size:30pt">${esc(d.score)}</span><span class="t-h3 muted"> / 5</span>
      </div>
    </div>
    <p class="t-micro" style="margin-top:3mm;line-height:1.6;max-width:150mm">${esc(scoreNote)}</p>
  </div>`;

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
    <div class="t-micro" style="margin-top:3.5mm;line-height:1.5">Ordres de grandeur variables selon la saison, la réservation et le niveau de confort</div>
  </div>`;
};

const accessBlock = (d) => `
  <div class="block">
    <span class="t-label">Comment y aller ?</span>
    <div class="rule"></div>
    <div class="legs">
      ${d.access.from.map((f) => `
        <div class="leg">
          <span><span class="t-small" style="color:var(--ink)">Depuis ${esc(f.city)}</span>
            <span class="t-micro" style="margin-left:2.5mm">${esc(f.mode)}</span></span>
          <span class="t-meta" style="color:var(--ink)">${esc(f.time)} · ${esc(f.cost)}</span>
        </div>`).join("")}
    </div>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:4mm;margin-top:4.5mm;align-items:start">
      <div style="border:.4pt solid var(--clay);padding:2.2mm 3mm;text-align:center;min-width:28mm">
        <div class="t-micro clay" style="margin-bottom:.8mm">Choix Veyora</div>
        <div class="t-h3 clay" style="font-size:11pt">${esc(d.access.choice)}</div>
      </div>
      <p class="t-small">${esc(d.access.why)}</p>
    </div>
    ${d.access.warning ? `<div class="note" style="margin-top:4mm"><span class="t-micro clay">À savoir</span><p class="t-small" style="margin-top:.8mm">${esc(d.access.warning)}</p></div>` : ""}
  </div>`;

const fieldNoteBlock = (f) => !f ? "" : `
  <div style="background:var(--paper-2);padding:5.5mm 6mm;margin-top:7mm">
    <div class="row between baseline" style="margin-bottom:2.4mm">
      <span class="t-label t-label--clay">Field note ${f.n}</span>
      <span class="t-micro">${esc(f.title)}</span>
    </div>
    <p class="t-small">${esc(f.text)}</p>
  </div>`;

const seasonBlock = (d) => `
  <div class="block">
    <span class="t-label">Quand y aller ?</span>
    <div class="rule"></div>
    <div class="seasons">
      ${[["Printemps", d.season.spring], ["Été", d.season.summer], ["Automne", d.season.autumn], ["Hiver", d.season.winter]]
        .map(([l, v]) => `<div class="season"><div class="t-micro" style="margin-bottom:1.3mm">${esc(l)}</div>${stars(v)}</div>`).join("")}
    </div>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:4mm;margin-top:4.5mm;align-items:baseline">
      <span class="t-h3">Notre choix : <span class="clay">${esc(d.season.pick)}</span></span>
      <p class="t-small">${esc(d.season.why)}</p>
    </div>
  </div>`;

const dayBlock = (d) => `
  <div class="block">
    <span class="t-label">Une journée type</span>
    <div class="rule"></div>
    <div style="margin-top:1mm">
      ${d.day.map((s, i) => `
        <div style="display:grid;grid-template-columns:16mm 5mm 1fr;align-items:baseline;gap:2mm">
          <span class="t-meta" style="color:var(--ink)">${esc(s.time)}</span>
          <span class="t-micro clay" style="text-align:center">${i < d.day.length - 1 ? "↓" : "•"}</span>
          <span class="t-small" style="color:var(--ink);padding-bottom:2.6mm">${esc(s.label)}</span>
        </div>`).join("")}
    </div>
    <div class="t-micro" style="margin-top:1mm">Un rythme possible, pas un programme</div>
  </div>`;

const momentsBlock = (d) => `
  <div class="block">
    <span class="t-label">Les 3 moments à ne pas rater</span>
    <div class="rule rule--ink"></div>
    ${d.moments.map((m, i) => `
      <div style="display:grid;grid-template-columns:8mm 1fr;gap:2.6mm;padding:2.8mm 0;${i < 2 ? "border-bottom:.3pt solid var(--line)" : ""}">
        <span class="t-meta clay">${m.n}</span>
        <div>
          <div class="t-micro" style="margin-bottom:.8mm">${esc(m.kind)}</div>
          <div class="t-h3" style="font-size:13pt">${esc(m.title)}</div>
          <p class="t-small" style="margin-top:1mm;max-width:138mm">${esc(m.text)}</p>
        </div>
      </div>`).join("")}
  </div>`;

const tipBlock = (d) => `
  <div class="tip" style="margin-top:6mm">
    <div class="row between baseline" style="margin-bottom:3mm">
      <span class="t-label">Le tip Veyora</span>
      <span class="t-micro" style="color:var(--sage)">${d.n} / 10</span>
    </div>
    <p class="t-body" style="font-size:9.6pt">${esc(d.tip)}</p>
  </div>`;

const addressBlock = (d) => `
  <div class="block">
    <span class="t-label">Nos adresses</span>
    <div style="columns:2;column-gap:9mm;margin-top:1mm">
    ${d.addresses.map((a) => `
      <div class="addr" style="break-inside:avoid">
        <span class="addr-ico">${ICONS[a.icon] ?? "—"}</span>
        <div>
          <div class="row between baseline" style="gap:3mm">
            <span class="t-h3" style="font-size:11.5pt">${esc(a.name)}</span>
            <span class="t-meta" style="white-space:nowrap">${esc(a.price)}</span>
          </div>
          <div class="t-micro" style="margin:.8mm 0 1.4mm">${esc(a.area)}</div>
          <p class="t-small">${esc(a.why)}</p>
        </div>
      </div>`).join("")}
    </div>
    <div class="t-micro" style="margin-top:3mm;line-height:1.5">Seules les institutions publiques sont nommées. Les tables sont indiquées par type et par quartier — voir « Sources &amp; mise à jour »</div>
  </div>`;

const localBlocks = (d) => `
  <div class="grid2" style="gap:0 9mm;margin-top:6mm">
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
    </div>
  </div>`;

const avoidBlock = (d) => `
  <div class="block">
    <span class="t-label">À éviter</span>
    <div class="rule"></div>
    <p class="t-small">${esc(d.avoid)}</p>
  </div>`;

const compromiseBlock = (d) => `
  <div style="background:var(--paper-warm);padding:4.6mm 5mm;border-left:.8pt solid var(--clay)">
    <span class="t-label t-label--clay">Le bon compromis</span>
    <div class="t-h3" style="font-size:12pt;margin-top:2.4mm">${esc(d.compromise.do)}</div>
    <div class="t-micro" style="margin:1mm 0">plutôt que</div>
    <div class="t-h3 muted" style="font-size:12pt">${esc(d.compromise.rather)}</div>
    <p class="t-small" style="margin-top:2.6mm">${esc(d.compromise.why)}</p>
  </div>`;

const head = (d, light = false) => `
  <div class="row between baseline">
    <span class="t-label"${light ? ' style="color:rgba(244,240,232,.75)"' : ""}>${esc(d.region)}</span>
    <span class="t-micro"${light ? ' style="color:rgba(244,240,232,.65)"' : ""}>IT / ${esc(d.coords)}</span>
  </div>`;

const runningHead = (d) => `
  <div class="row between baseline">
    <span class="t-label">${esc(d.name)}</span>
    <span class="t-micro">${d.n} / 10</span>
  </div>
  <div class="rule rule--ink" style="margin-top:2.4mm"></div>`;

/* ── A · OUVERTURE ───────────────────────────────────────────────── */

const pageOpener = (d, i, withWhy) => {
  const key = d.photos.hero;
  const r = photoRatio(key);
  const mode = !hasPhoto(key) ? "field" : r < 0.95 ? "bleed" : "band";

  if (mode === "bleed" && !withWhy) {
    return page(`
      <div class="bleed">${photo(key)}</div>
      <div class="scrim"></div>
      <div style="position:absolute;right:var(--m);top:26mm">${locator(d, true)}</div>
      <div class="pad col" style="color:var(--paper)">
        ${head(d, true)}
        <div class="row" style="margin-top:6mm;${i % 2 ? "justify-content:flex-end" : ""}">
          <span class="t-mega" style="color:var(--paper);opacity:.92">${d.n}</span>
        </div>
        <div class="auto" style="padding-bottom:3mm;max-width:134mm">
          ${titleBlock(d, true)}${metaRow(d, true)}
        </div>
      </div>`, { folio: false, id: `d-${d.n}` });
  }

  if (mode === "field") {
    return page(`
      <div style="position:absolute;right:var(--m);top:26mm">${locator(d, true)}</div>
      <div class="pad col">
        ${head(d, true)}
        <div class="row" style="margin-top:8mm"><span class="t-mega" style="color:var(--paper);opacity:.9">${d.n}</span></div>
        <div class="auto" style="padding-bottom:3mm;max-width:134mm">${titleBlock(d, true)}${metaRow(d, true)}</div>
      </div>`, { cls: "page--dark", folio: false, id: `d-${d.n}` });
  }

  /* Bande photographique — le cas courant. Elle alterne haut et bas d'une
     destination à l'autre : c'est ce qui donne son rythme au feuilletage. */
  const bandH = bandHeight(key, 210, withWhy ? 72 : 86, withWhy ? 94 : 158);
  const low = i % 2 === 1;
  return page(`
    <div class="frame" style="position:absolute;left:0;right:0;${low ? "bottom" : "top"}:0;height:${bandH}mm">${photo(key)}</div>
    ${low ? `<div style="position:absolute;right:var(--m);top:13mm">${locator(d)}</div>` : ""}
    <div class="pad col" style="${low
      ? `top:13mm;bottom:auto;height:${297 - bandH - 24}mm`
      : `top:${bandH + 11}mm;bottom:13mm;height:auto`}">
      ${low ? `<div class="t-micro">IT / ${esc(d.coords)}</div>` : ""}
      <div class="${low ? "auto" : ""}">
        <div class="row between end" style="margin-bottom:4mm">
          <span class="t-mega" style="font-size:${withWhy ? 46 : 58}pt;line-height:.8;color:var(--clay)">${d.n}</span>
          ${low ? "" : `<div style="text-align:right">
            ${locator(d)}
            <span class="t-micro" style="display:block;margin-top:1.4mm">IT / ${esc(d.coords)}</span>
          </div>`}
        </div>
        ${titleBlock(d)}
        ${metaRow(d)}
      </div>
    </div>`, { folio: false, id: `d-${d.n}` });
};

/* ── B · POURQUOI ICI ? (version 4 pages) ────────────────────────── */

const pageWhy = (d, scoreNote) => page(`
  <div class="pad col">
    ${runningHead(d)}
    <h3 class="t-h1" style="margin-top:9mm">Pourquoi ici ?</h3>
    <div class="t-body" style="margin-top:6mm;max-width:118mm">
      ${d.why.map((p) => `<p>${esc(p)}</p>`).join("")}
    </div>
    <div style="margin-top:8mm" class="block">
      <span class="t-label">Parfait pour</span>
      <div class="tags">${d.perfectFor.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </div>
    ${d.photos.secondary[1] && hasPhoto(d.photos.secondary[1]) ? `
      <div class="frame" style="height:${bandHeight(d.photos.secondary[1], 174, 38, 46)}mm;margin-top:6mm">${photo(d.photos.secondary[1])}</div>` : ""}
    <div style="margin-top:6mm">${localBlocks(d)}</div>
    <div class="auto" style="padding-bottom:2mm">${ratingsBlock(d, scoreNote)}</div>
  </div>`, { left: `${full(d)} — ${d.n} / 10` });

/* ── C · PRATIQUE ────────────────────────────────────────────────── */

/** Quatre pages : budget, accès, note de trajet, saison et journée type. */
const pagePractical = (d) => page(`
  <div class="pad col">
    ${runningHead(d)}
    <div style="margin-top:6mm">${budgetBlock(d)}</div>
    <div style="margin-top:6mm">${accessBlock(d)}</div>
    ${fieldNoteBlock(d.fieldNote)}
    <div class="grid2 auto" style="gap:0 9mm;padding-bottom:2mm">
      <div>${seasonBlock(d)}</div>
      <div>${dayBlock(d)}</div>
    </div>
  </div>`, { left: `${full(d)} — ${d.n} / 10` });

/** Trois pages : les indicateurs rejoignent le pratique. */
const pagePracticalTight = (d, scoreNote) => page(`
  <div class="pad col">
    ${runningHead(d)}
    <div style="margin-top:6mm">${ratingsBlock(d, scoreNote)}</div>
    <div style="margin-top:6mm">${budgetBlock(d)}</div>
    <div style="margin-top:6mm">${accessBlock(d)}</div>
    ${fieldNoteBlock(d.fieldNote)}
    <div class="grid2 auto" style="gap:0 9mm;padding-bottom:2mm">
      <div>${seasonBlock(d)}</div>
      <div>${dayBlock(d)}</div>
    </div>
  </div>`, { left: `${full(d)} — ${d.n} / 10` });

/* ── D · LOCAL ───────────────────────────────────────────────────── */

/** Dernière page : les moments, le tip, les adresses et la table. */
const pageLocal = (d, withTaste) => page(`
  <div class="pad col">
    ${runningHead(d)}
    <div style="margin-top:6mm">${momentsBlock(d)}</div>
    ${tipBlock(d)}
    <div style="margin-top:6mm">${addressBlock(d)}</div>
    ${withTaste ? localBlocks(d) : ""}
    <div class="grid2 auto" style="gap:0 9mm;padding-bottom:2mm">
      <div>${avoidBlock(d)}</div>
      <div>${compromiseBlock(d)}</div>
    </div>
  </div>`, { left: `${full(d)} — ${d.n} / 10` });

/* ── assemblage ──────────────────────────────────────────────────── */

/**
 * Quatre pages pour chaque destination. Le rythme vient de la composition —
 * l'ouverture est tantôt une bande, tantôt une pleine page — et non d'un
 * nombre de pages variable : les modules du volume ne tiennent pas en trois.
 */
export const destinationPages = (d, i, scoreNote) =>
  [pageOpener(d, i, false), pageWhy(d, scoreNote), pagePractical(d), pageLocal(d, false)].join("\n");
