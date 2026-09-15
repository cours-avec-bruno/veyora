/** Fin de volume : comparaison, profils, distinctions, réseau, annexes. */
import { page, esc, stars, routeline } from "./render.mjs";

const dots = (n, max = 5) =>
  `<span class="t-meta" style="letter-spacing:.06em">${"●".repeat(n)}<span style="color:var(--line-2)">${"●".repeat(max - n)}</span></span>`;

const byN = (list, n) => list.find((d) => d.n === n);
const nameOf = (d) => `${d.name}${d.subname ? " " + d.subname : ""}`;
const cap = (s) => s.charAt(0) + s.slice(1).toLowerCase();

/* ── ALORS, ON PART OÙ ? ─────────────────────────────────────────── */

export const comparison = (destinations, note) => page(`
  <div class="pad--wide col">
    <h2 class="t-h1">Alors, on part où ?</h2>
    <div class="rule rule--ink" style="margin-top:5mm"></div>
    <table class="tbl" style="margin-top:4mm">
      <thead><tr>
        <th style="width:7mm"></th>
        <th style="width:31mm">Destination</th>
        <th>Budget</th>
        <th>Durée</th>
        <th>Meilleur accès</th>
        <th>Nature</th>
        <th>Culture</th>
        <th>Table</th>
        <th>Sans&nbsp;voiture</th>
        <th style="width:9mm">Score</th>
      </tr></thead>
      <tbody>
        ${destinations.map((d) => `
          <tr>
            <td class="n">${d.n}</td>
            <td class="name">${esc(d.name)}</td>
            <td class="num">${esc(d.budget.total.replace(/ /g, " "))}</td>
            <td class="num">${esc(d.days.replace(" JOURS", " j").replace(" – ", "–"))}</td>
            <td class="num">${esc(d.access.from[0].city)} ${esc(d.access.from[0].time)}</td>
            <td class="dots">${dots(d.ratings.nature)}</td>
            <td class="dots">${dots(d.ratings.culture)}</td>
            <td class="dots">${dots(d.ratings.gastronomie)}</td>
            <td class="dots">${dots(d.ratings.sansVoiture)}</td>
            <td class="num clay">${esc(d.score)}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <div class="auto t-micro" style="max-width:140mm;line-height:1.6;padding-bottom:2mm">${esc(note)}</div>
  </div>`, { left: "COMPARAISON", id: "comparaison" });

/* ── QUELLE ITALIE CHERCHEZ-VOUS ? ───────────────────────────────── */

export const profilesPage = (p, destinations) => page(`
  <div class="pad col">
    <h2 class="t-h1" style="max-width:110mm">${esc(cap(p.title))}</h2>
    <p class="t-small" style="margin-top:4mm;max-width:108mm">${esc(p.intro)}</p>
    <div class="rule rule--ink" style="margin-top:6mm"></div>
    <div style="margin-top:1mm">
      ${p.groups.map((g) => `
        <div style="display:grid;grid-template-columns:58mm 1fr;gap:5mm;padding:4.6mm 0;border-bottom:.3pt solid var(--line);align-items:baseline">
          <span class="t-h3" style="font-size:12.5pt">« ${esc(g.q)} »</span>
          <div style="display:flex;gap:6mm;flex-wrap:wrap">
            ${g.picks.map((n) => { const d = byN(destinations, n); return `
              <a href="#d-${d.n}" style="display:flex;gap:2mm;align-items:baseline">
                <span class="t-meta clay">${d.n}</span>
                <span class="serif" style="font-size:11pt">${esc(d.name)}</span>
              </a>`; }).join("")}
          </div>
        </div>`).join("")}
    </div>
    <div class="auto t-micro" style="padding-bottom:2mm">Chaque numéro renvoie à la fiche correspondante</div>
  </div>`, { left: "PROFILS", id: "profils" });

/* ── LE TOP VEYORA ───────────────────────────────────────────────── */

export const awardsPage = (a, destinations) => page(`
  <div class="pad col">
    <span class="t-label" style="color:var(--sage)">Distinctions</span>
    <h2 class="t-h1" style="color:var(--paper);margin-top:3mm">${esc(cap(a.title))}</h2>
    <p class="t-small" style="margin-top:4mm;max-width:108mm">${esc(a.intro)}</p>
    <div class="rule" style="margin-top:6mm"></div>
    <div style="margin-top:1mm">
      ${a.items.map((it) => { const d = byN(destinations, it.pick); return `
        <div style="padding:5mm 0;border-bottom:.3pt solid rgba(244,240,232,.22)">
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

/* ── L'ITALIE COMMENCE SUR LES RAILS ─────────────────────────────── */

export const trainPageRender = (t) => page(`
  <div class="pad col">
    <span class="t-label">Les corridors</span>
    <h2 class="t-display" style="margin-top:4mm">${t.lines.map(esc).join("<br>")}</h2>
    <p class="t-small" style="margin-top:5mm;max-width:120mm">${esc(t.intro)}</p>
    <div class="rule rule--ink" style="margin-top:5mm"></div>

    <div style="margin-top:2mm">
      ${t.corridors.map((c) => `
        <div style="display:grid;grid-template-columns:52mm 22mm 1fr;gap:4mm;align-items:baseline;padding:3.1mm 0;border-bottom:.3pt solid var(--line)">
          <span style="display:flex;align-items:center;gap:2mm">
            <span class="t-small" style="color:var(--ink);white-space:nowrap">${esc(c.from)}</span>
            <span style="flex:1;min-width:5mm;color:var(--line-2)">${routeline()}</span>
            <span class="t-small" style="color:var(--ink);white-space:nowrap">${esc(c.to)}</span>
          </span>
          <span class="t-meta" style="color:var(--ink)">${esc(c.time)}</span>
          <span><span class="t-micro">${esc(c.mode)}</span> <span class="t-small">${esc(c.note)}</span></span>
        </div>`).join("")}
    </div>

    <div class="auto note" style="max-width:150mm;padding-bottom:2mm">
      <p class="t-small">${esc(t.note)}</p>
    </div>
  </div>`, { left: "LES CORRIDORS", id: "rails" });

/* ── LE RÉSEAU VEYORA ────────────────────────────────────────────── */

export const networkPage = (n) => page(`
  <div class="pad col">
    <span class="t-label">Combinaisons</span>
    <h2 class="t-h1" style="margin-top:3mm;max-width:118mm">${esc(n.title)}</h2>
    <p class="t-small" style="margin-top:4mm;max-width:118mm">${esc(n.intro)}</p>
    <div class="rule rule--ink" style="margin-top:6mm"></div>

    <div style="margin-top:1mm">
      ${n.combos.map((c) => `
        <div style="padding:5.4mm 0;border-bottom:.3pt solid var(--line)">
          <div class="row between baseline" style="margin-bottom:3mm">
            <span class="t-h3">${esc(c.name)}</span>
            <span class="t-micro">${esc(c.days)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:2.5mm;flex-wrap:wrap;margin-bottom:2.4mm">
            ${c.legs.map((l, i) => `
              ${i ? `<span style="width:9mm;height:0;border-top:.4pt solid var(--line-2)"></span>` : ""}
              <span style="display:flex;align-items:center;gap:1.6mm">
                <span style="display:block;width:1.6mm;height:1.6mm;border-radius:50%;background:${i === c.legs.length - 1 ? "var(--clay)" : "transparent"};border:.4pt solid var(--clay)"></span>
                <span class="t-small" style="color:var(--ink)">${esc(l)}</span>
              </span>`).join("")}
          </div>
          <p class="t-small">${esc(c.why)}</p>
        </div>`).join("")}
    </div>
    <div class="auto t-micro" style="padding-bottom:2mm;max-width:130mm;line-height:1.6">${esc(n.note)}</div>
  </div>`, { left: "LE RÉSEAU", id: "reseau" });

/* ── VOYAGER AUTREMENT ───────────────────────────────────────────── */

export const responsiblePage = (r) => page(`
  <div class="pad col">
    <span class="t-label">Approche</span>
    <h2 class="t-h1" style="margin-top:3mm;max-width:96mm">${esc(cap(r.title))}</h2>
    <div class="rule rule--ink" style="margin-top:6mm"></div>
    <div class="t-body" style="margin-top:6mm;max-width:116mm">
      ${r.body.map((p) => `<p>${esc(p)}</p>`).join("")}
    </div>
    <div class="auto" style="padding-bottom:2mm">
      <div style="background:var(--paper-2);padding:6.5mm 7mm;max-width:152mm">
        <span class="t-label t-label--clay">${esc(r.impact.title)}</span>
        <p class="t-small" style="margin-top:3mm">${esc(r.impact.body)}</p>
      </div>
    </div>
  </div>`, { left: "VOYAGER AUTREMENT", id: "autrement" });

/* ── PRÊT À PARTIR ? ─────────────────────────────────────────────── */

export const checklistPage = (c) => page(`
  <div class="pad col">
    <span class="t-label">Pratique</span>
    <h2 class="t-display" style="margin-top:4mm">${esc(cap(c.title))}</h2>
    <div class="rule rule--ink" style="margin-top:7mm"></div>
    <div style="margin-top:2mm;max-width:132mm">
      ${c.items.map((it) => `
        <div style="display:grid;grid-template-columns:6mm 1fr;gap:3mm;padding:4.4mm 0;border-bottom:.3pt solid var(--line);align-items:start">
          <span style="display:block;width:3.4mm;height:3.4mm;border:.4pt solid var(--ink-2);margin-top:1mm"></span>
          <span class="t-h3" style="font-size:12pt">${esc(it)}</span>
        </div>`).join("")}
    </div>
    <div class="auto note" style="max-width:132mm;padding-bottom:2mm">
      <p class="t-small">${esc(c.note)}</p>
    </div>
  </div>`, { left: "PRÊT À PARTIR", id: "pratique" });

/* ── SOURCES ─────────────────────────────────────────────────────── */

export const sourcesPage = (s) => page(`
  <div class="pad col">
    <div class="row between baseline">
      <span class="t-label">${esc(s.title)}</span>
      <span class="t-micro">${esc(s.verified)}</span>
    </div>
    <div class="rule rule--ink" style="margin-top:2.4mm"></div>

    <div style="margin-top:6mm">
      <span class="t-label">Conventions</span>
      <div style="margin-top:2.5mm">
        ${s.conventions.map((c) => `<p class="t-small" style="margin-bottom:2.4mm;max-width:152mm">— ${esc(c)}</p>`).join("")}
      </div>
    </div>

    <div style="margin-top:7mm">
      <span class="t-label">Principales sources</span>
      <div class="rule" style="margin-top:2.4mm"></div>
      ${s.list.map((l) => `
        <div style="display:grid;grid-template-columns:62mm 1fr;gap:4mm;padding:2.5mm 0;border-bottom:.3pt solid var(--line)">
          <span class="t-small" style="color:var(--ink)">${esc(l.label)}</span>
          <span class="t-small">${esc(l.detail)}</span>
        </div>`).join("")}
    </div>

    <div class="auto note" style="max-width:150mm;padding-bottom:2mm">
      <p class="t-small">${esc(s.warning)}</p>
    </div>
  </div>`, { left: "SOURCES", id: "sources" });

/* ── CRÉDITS PHOTOGRAPHIQUES ─────────────────────────────────────── */

export const creditsPage = (credits, used) => {
  const rows = used.filter((k) => credits[k]).map((k) => ({ k, ...credits[k] }));
  const source = rows[0]?.source ?? "Wikimedia Commons";
  return page(`
    <div class="pad col">
      <span class="t-label">Crédits photographiques</span>
      <div class="rule rule--ink" style="margin-top:2.4mm"></div>
      <p class="t-small" style="margin-top:5mm;max-width:152mm">
        ${source === "Unsplash"
          ? "Toutes les photographies proviennent d'Unsplash et sont publiées sous licence Unsplash, qui autorise l'usage commercial. L'attribution n'est pas obligatoire : nous la donnons quand même."
          : "Toutes les photographies proviennent de Wikimedia Commons et sont publiées sous licence Creative Commons Attribution ou dans le domaine public. Aucune image sous licence « partage à l'identique » n'a été retenue."}
      </p>
      <div style="margin-top:6mm;columns:2;column-gap:9mm">
        ${rows.map((r) => `
          <div style="break-inside:avoid;padding:1.9mm 0;border-bottom:.3pt solid var(--line)">
            <div class="t-micro" style="letter-spacing:.1em">${esc(r.k)}</div>
            <div class="t-small" style="line-height:1.45;margin-top:.6mm">
              ${esc((r.title || "").replace(/\.(jpg|jpeg)$/i, "").slice(0, 50))}${r.creator ? ` · ${esc(String(r.creator).slice(0, 32))}` : ""}
              <span class="muted"> · ${esc(r.license)}</span>
            </div>
          </div>`).join("")}
      </div>
      <div class="auto t-micro" style="padding-bottom:2mm">Les pages d'origine complètes sont listées dans le fichier de crédits accompagnant ce volume</div>
    </div>`, { left: "CRÉDITS" });
};

/* ── DERNIÈRE PAGE ───────────────────────────────────────────────── */

export const lastPage = (closing, next, meta) => page(`
  <div class="pad col">
    <div class="row between baseline">
      <span class="t-label" style="color:var(--sage)">${esc(next.title)}</span>
      <span style="display:flex;gap:7mm">
        ${next.shelf.map((s) => `<span class="t-micro" style="color:var(--sage)">Vol. ${esc(s.volume)} — ${esc(s.label)}</span>`).join("")}
      </span>
    </div>
    <p class="t-small" style="color:var(--sage);margin-top:3mm;max-width:118mm">${esc(next.body)}</p>

    <div class="auto"></div>
    <h2 class="t-display" style="color:var(--paper)">${closing.lines.map(esc).join("<br>")}</h2>
    <div class="auto"></div>

    <div>
      <div class="rule" style="width:40mm;border-top-color:rgba(244,240,232,.45);margin-bottom:6mm"></div>
      <p class="t-lead" style="color:var(--sage);max-width:112mm;margin-bottom:8mm">${esc(closing.note)}</p>
      <div class="row between baseline">
        <span class="serif" style="font-size:18pt;letter-spacing:.16em;color:var(--paper)">VEYORA</span>
        <span class="t-micro" style="color:var(--sage)">GUIDES / VOL. ${esc(meta.volume)}</span>
      </div>
      <div style="height:3mm"></div>
      <p class="t-small" style="color:var(--sage)">Continuez à explorer.</p>
    </div>
  </div>`, { cls: "page--deep", folio: false });
