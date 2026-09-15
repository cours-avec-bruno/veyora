/** Fin de volume : comparaison, profils, distinctions, trajets, annexes. */
import { page, esc, stars, hasPhoto } from "./render.mjs";

const dots = (n, max = 5) =>
  `<span class="t-meta" style="letter-spacing:.06em">${"●".repeat(n)}<span style="color:var(--line-2)">${"●".repeat(max - n)}</span></span>`;

const byN = (list, n) => list.find((d) => d.n === n);
const nameOf = (d) => `${d.name}${d.subname ? " " + d.subname : ""}`;

/* ── ALORS, ON PART OÙ ? ─────────────────────────────────────────── */

export const comparison = (destinations, note) => page(`
  <div class="pad--wide col">
    <h2 class="t-h1">Alors, on part où ?</h2>
    <div class="rule rule--ink" style="margin-top:5mm"></div>
    <table class="tbl" style="margin-top:4mm">
      <thead><tr>
        <th style="width:7mm"></th>
        <th style="width:34mm">Destination</th>
        <th style="width:26mm">Type</th>
        <th>Budget</th>
        <th>Durée</th>
        <th>Paris</th>
        <th>Lyon</th>
        <th>Nature</th>
        <th>Culture</th>
        <th>Sans&nbsp;voiture</th>
      </tr></thead>
      <tbody>
        ${destinations.map((d) => `
          <tr>
            <td class="n">${d.n}</td>
            <td class="name">${esc(d.name)}</td>
            <td style="font-size:7pt">${esc(d.kind)}</td>
            <td class="num">${esc(d.budget.total.replace(/ /g, " "))}</td>
            <td class="num">${esc(d.days.replace(" JOURS", " j").replace(" – ", "–"))}</td>
            <td class="num">${esc(d.trip.from[0].time)}</td>
            <td class="num">${esc((d.trip.from.find((f) => f.city === "Lyon") ?? { time: "—" }).time)}</td>
            <td class="dots">${dots(d.ratings.nature)}</td>
            <td class="dots">${dots(d.ratings.culture)}</td>
            <td class="dots">${dots(d.ratings.sansVoiture)}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <div class="auto t-micro" style="max-width:130mm;line-height:1.6;padding-bottom:2mm">${esc(note)}</div>
  </div>`, { left: "COMPARAISON", id: "comparaison" });

/* ── CHOISISSEZ SELON VOTRE ENVIE ────────────────────────────────── */

export const profilesPage = (p, destinations) => page(`
  <div class="pad col">
    <h2 class="t-h1" style="max-width:100mm">${esc(p.title.charAt(0) + p.title.slice(1).toLowerCase())}</h2>
    <p class="t-small" style="margin-top:4mm;max-width:104mm">${esc(p.intro)}</p>
    <div class="rule rule--ink" style="margin-top:6mm"></div>

    <div style="margin-top:2mm">
      ${p.groups.map((g) => `
        <div style="display:grid;grid-template-columns:52mm 1fr;gap:5mm;padding:5mm 0;border-bottom:.3pt solid var(--line);align-items:baseline">
          <span class="t-h3" style="font-size:13pt">« ${esc(g.q)} »</span>
          <div style="display:flex;gap:6mm;flex-wrap:wrap">
            ${g.picks.map((n) => { const d = byN(destinations, n); return `
              <span style="display:flex;gap:2mm;align-items:baseline">
                <span class="t-meta clay">${d.n}</span>
                <span class="serif" style="font-size:11.5pt">${esc(d.name)}</span>
              </span>`; }).join("")}
          </div>
        </div>`).join("")}
    </div>
    <div class="auto t-micro" style="padding-bottom:2mm">Chaque numéro renvoie à la fiche correspondante</div>
  </div>`, { left: "PROFILS", id: "profils" });

/* ── LE TOP VEYORA ───────────────────────────────────────────────── */

export const awardsPage = (a, destinations) => page(`
  <div class="pad col">
    <span class="t-label" style="color:var(--sage)">Distinctions</span>
    <h2 class="t-h1" style="color:var(--paper);margin-top:3mm">${esc(a.title.charAt(0) + a.title.slice(1).toLowerCase())}</h2>
    <p class="t-small" style="margin-top:4mm;max-width:104mm">${esc(a.intro)}</p>
    <div class="rule" style="margin-top:6mm"></div>

    <div style="margin-top:1mm">
      ${a.items.map((it) => { const d = byN(destinations, it.pick); return `
        <div style="padding:4.4mm 0;border-bottom:.3pt solid rgba(244,240,232,.22)">
          <div class="row between baseline" style="gap:5mm">
            <span class="t-label" style="color:var(--sage)">${esc(it.label)}</span>
            <span style="display:flex;gap:2.5mm;align-items:baseline">
              <span class="t-meta" style="color:var(--sage)">${d.n}</span>
              <span class="serif" style="font-size:14pt;color:var(--paper)">${esc(nameOf(d))}</span>
            </span>
          </div>
          <p class="t-small" style="margin-top:1.6mm;max-width:150mm">${esc(it.why)}</p>
        </div>`; }).join("")}
    </div>
  </div>`, { cls: "page--dark", left: "LE TOP VEYORA", id: "top" });

/* ── LE VOYAGE COMMENCE AVANT D'ARRIVER ──────────────────────────── */

export const journeyPages = (j) => {
  const half = Math.ceil(j.items.length / 2);
  const block = (it) => `
    <div style="padding:4.6mm 0;border-bottom:.3pt solid var(--line)">
      <div class="row between baseline" style="gap:4mm">
        <span class="t-h3" style="font-size:13pt">${esc(it.from)} <span class="clay">→</span> ${esc(it.to)}</span>
        <span class="t-meta" style="white-space:nowrap">${esc(it.time)}</span>
      </div>
      <div class="row" style="gap:5mm;margin:1.4mm 0 1.8mm">
        <span class="t-micro">${esc(it.mode)}</span>
        <span class="t-micro">${esc(it.dist)}</span>
        <span class="t-micro">${esc(it.cost)}</span>
      </div>
      <p class="t-small" style="max-width:150mm">${esc(it.why)}</p>
    </div>`;
  return [
    page(`
      <div class="pad col">
        <span class="t-label">Les trajets</span>
        <h2 class="t-display" style="margin-top:5mm">${j.lines.map(esc).join("<br>")}</h2>
        <p class="t-lead" style="margin-top:6mm;max-width:112mm">${esc(j.intro)}</p>
        <div class="rule rule--ink" style="margin-top:6mm"></div>
        <div>${j.items.slice(0, half).map(block).join("")}</div>
      </div>`, { left: "LES TRAJETS", id: "trajets" }),
    page(`
      <div class="pad col">
        <div class="row between baseline">
          <span class="t-label">Les trajets</span><span class="t-micro">II</span>
        </div>
        <div class="rule rule--ink" style="margin-top:2.4mm"></div>
        <div>${j.items.slice(half).map(block).join("")}</div>
        <div class="auto t-micro" style="padding-bottom:2mm">Prix et durées indicatifs · à vérifier au moment de la réservation</div>
      </div>`, { left: "LES TRAJETS" }),
  ];
};

/* ── VOYAGER AUTREMENT ───────────────────────────────────────────── */

export const responsiblePage = (r) => page(`
  <div class="pad col">
    <span class="t-label">Approche</span>
    <h2 class="t-h1" style="margin-top:3mm;max-width:96mm">${esc(r.title.charAt(0) + r.title.slice(1).toLowerCase())}</h2>
    <div class="rule rule--ink" style="margin-top:6mm"></div>
    <div class="t-body" style="margin-top:6mm;max-width:116mm">
      ${r.body.map((p) => `<p>${esc(p)}</p>`).join("")}
    </div>
    <div class="auto" style="padding-bottom:2mm">
      <div style="background:var(--paper-2);padding:6.5mm 7mm;max-width:150mm">
        <span class="t-label t-label--clay">${esc(r.impact.title)}</span>
        <p class="t-small" style="margin-top:3mm">${esc(r.impact.body)}</p>
      </div>
    </div>
  </div>`, { left: "VOYAGER AUTREMENT", id: "autrement" });

/* ── AVANT DE PARTIR + LE SAC ────────────────────────────────────── */

export const checklistPage = (c, bag) => page(`
  <div class="pad col">
    <div class="grid2" style="gap:0 10mm">
      <div>
        <span class="t-label">Pratique</span>
        <h3 class="t-h1" style="margin-top:3mm;font-size:26pt">${esc(c.title.charAt(0) + c.title.slice(1).toLowerCase())}</h3>
        <div class="rule rule--ink" style="margin-top:5mm"></div>
        <div style="margin-top:1mm">
          ${c.items.map((it) => `
            <div style="display:grid;grid-template-columns:5mm 1fr;gap:2.5mm;padding:3.4mm 0;border-bottom:.3pt solid var(--line);align-items:start">
              <span style="display:block;width:3mm;height:3mm;border:.4pt solid var(--ink-2);margin-top:1mm"></span>
              <span class="t-small" style="color:var(--ink)">${esc(it)}</span>
            </div>`).join("")}
        </div>
      </div>
      <div>
        <span class="t-label">Bonus</span>
        <h3 class="t-h1" style="margin-top:3mm;font-size:26pt">${esc(bag.title.charAt(0) + bag.title.slice(1).toLowerCase())}</h3>
        <div class="rule rule--ink" style="margin-top:5mm"></div>
        <p class="t-small" style="margin-top:3.5mm">${esc(bag.intro)}</p>
        ${bag.groups.map((g) => `
          <div style="margin-top:5mm">
            <span class="t-micro clay">${esc(g.kind)}</span>
            <div class="tags" style="margin-top:2mm">${g.items.map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</div>
          </div>`).join("")}
      </div>
    </div>
  </div>`, { left: "AVANT DE PARTIR", id: "pratique" });

/* ── SUITE DE LA COLLECTION ──────────────────────────────────────── */

export const nextPage = (n) => page(`
  <div class="pad col">
    <span class="t-label">La collection</span>
    <h2 class="t-display" style="margin-top:5mm;max-width:126mm">${esc(n.title)}</h2>
    <p class="t-lead" style="margin-top:6mm;max-width:112mm">${esc(n.body)}</p>
    <div class="auto" style="padding-bottom:4mm">
      <div class="rule rule--ink" style="margin-bottom:6mm"></div>
      <div class="grid3" style="gap:6mm">
        <div>
          <div class="t-micro" style="margin-bottom:2mm">Vol. 01</div>
          <div class="t-h3">10 escapades d'Europe</div>
          <div class="t-meta" style="margin-top:1.4mm">23 €</div>
        </div>
        <div>
          <div class="t-micro clay" style="margin-bottom:2mm">Vol. 02 — ce volume</div>
          <div class="t-h3">France</div>
          <div class="t-meta" style="margin-top:1.4mm">25 €</div>
        </div>
        <div style="display:flex;gap:7mm">
          ${n.shelf.map((s) => `
            <div>
              <div class="t-micro" style="margin-bottom:2mm">Vol. ${esc(s.volume)}</div>
              <div class="t-h3 muted">${esc(s.label)}</div>
            </div>`).join("")}
        </div>
      </div>
    </div>
  </div>`, { left: "LA COLLECTION", id: "collection" });

/* ── SOURCES ─────────────────────────────────────────────────────── */

export const sourcesPage = (s) => page(`
  <div class="pad col">
    <div class="row between baseline">
      <span class="t-label">${esc(s.title)}</span>
      <span class="t-micro">${esc(s.verified)}</span>
    </div>
    <div class="rule rule--ink" style="margin-top:2.4mm"></div>

    <div style="margin-top:7mm">
      <span class="t-label">Conventions</span>
      <div style="margin-top:2.5mm">
        ${s.conventions.map((c) => `<p class="t-small" style="margin-bottom:2.4mm;max-width:150mm">— ${esc(c)}</p>`).join("")}
      </div>
    </div>

    <div style="margin-top:8mm">
      <span class="t-label">Principales sources</span>
      <div class="rule" style="margin-top:2.4mm"></div>
      ${s.list.map((l) => `
        <div style="display:grid;grid-template-columns:62mm 1fr;gap:4mm;padding:2.6mm 0;border-bottom:.3pt solid var(--line)">
          <span class="t-small" style="color:var(--ink)">${esc(l.label)}</span>
          <span class="t-small">${esc(l.detail)}</span>
        </div>`).join("")}
    </div>
  </div>`, { left: "SOURCES", id: "sources" });

/* ── CRÉDITS PHOTOGRAPHIQUES ─────────────────────────────────────── */

export const creditsPage = (credits, used) => {
  const rows = used.filter((k) => credits[k]).map((k) => ({ k, ...credits[k] }));
  return page(`
    <div class="pad col">
      <span class="t-label">Crédits photographiques</span>
      <div class="rule rule--ink" style="margin-top:2.4mm"></div>
      <p class="t-small" style="margin-top:5mm;max-width:150mm">
        Toutes les photographies proviennent de Wikimedia Commons et sont publiées sous licence
        Creative Commons Attribution ou dans le domaine public. Aucune image sous licence
        « partage à l'identique » n'a été retenue.
      </p>
      <div style="margin-top:6mm;columns:2;column-gap:9mm">
        ${rows.map((r) => `
          <div style="break-inside:avoid;padding:1.9mm 0;border-bottom:.3pt solid var(--line)">
            <div class="t-micro" style="letter-spacing:.1em">${esc(r.k)}</div>
            <div class="t-small" style="line-height:1.45;margin-top:.6mm">
              ${esc((r.title || "").replace(/\.(jpg|jpeg)$/i, "").slice(0, 52))}${r.creator ? ` · ${esc(r.creator.slice(0, 34))}` : ""}
              <span class="muted"> · ${esc(r.license)}</span>
            </div>
          </div>`).join("")}
      </div>
      <div class="auto t-micro" style="padding-bottom:2mm">Les pages d'origine complètes sont listées dans le fichier de crédits accompagnant ce volume</div>
    </div>`, { left: "CRÉDITS" });
};

/* ── CONCLUSION ET DERNIÈRE PAGE ─────────────────────────────────── */

export const closingPage = (c) => page(`
  <div class="pad col" style="justify-content:center">
    <h2 class="t-display" style="color:var(--paper)">${c.lines.map(esc).join("<br>")}</h2>
    <div style="height:11mm"></div>
    <div class="rule" style="width:40mm;border-top-color:rgba(244,240,232,.45)"></div>
    <div style="height:6mm"></div>
    <p class="t-lead" style="color:var(--sage);max-width:104mm">${esc(c.note)}</p>
  </div>`, { cls: "page--dark", left: "" });

export const lastPage = (meta) => page(`
  <div class="pad col">
    <div class="auto"></div>
    <h2 class="t-giant" style="color:var(--paper)">À la prochaine<br>gare.</h2>
    <div class="auto"></div>
    <div>
      <div style="width:34mm;color:var(--sage);margin-bottom:6mm">
        <div class="routeline"><i></i><s></s><i class="full"></i></div>
      </div>
      <div class="row between baseline">
        <span class="serif" style="font-size:17pt;letter-spacing:.16em;color:var(--paper)">VEYORA</span>
        <span class="t-micro" style="color:var(--sage)">GUIDES / VOL. ${esc(meta.volume)}</span>
      </div>
      <div style="height:4mm"></div>
      <p class="t-small" style="color:var(--sage)">Continuez à explorer.</p>
    </div>
  </div>`, { cls: "page--deep", folio: false });
