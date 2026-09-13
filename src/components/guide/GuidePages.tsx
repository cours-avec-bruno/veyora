import Image from "next/image";
import type { ReactNode } from "react";
import type { Guide } from "@/data/types";
import { photo } from "@/data/photos";
import { ModeIcon, modeLabels } from "@/components/icons";
import { GuideCover } from "./GuideCover";
import { budget, cn } from "@/lib/format";

/* All pages share the cover ratio (5:7 ≈ A4) and use container units. */

function Sheet({
  guide,
  page,
  section,
  children,
  className,
}: {
  guide: Guide;
  page: number;
  section: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "@container relative aspect-[5/7] w-full overflow-hidden rounded-[3px] bg-[#fbf8f2] text-ink shadow-book select-none",
        className,
      )}
    >
      <div className="absolute inset-x-[7cqw] top-[5cqw] flex items-center justify-between border-b border-ink/15 pb-[2cqw] font-mono text-[2.1cqw] tracking-[0.16em] text-ink/55 uppercase">
        <span>Veyora · {guide.title}</span>
        <span>{section}</span>
      </div>
      <div className="absolute inset-x-[7cqw] top-[13cqw] bottom-[11cqw]">{children}</div>
      <div className="absolute inset-x-[7cqw] bottom-[4.5cqw] flex items-center justify-between font-mono text-[2.1cqw] tracking-[0.14em] text-ink/45 uppercase">
        <span>{guide.updated}</span>
        <span>{String(page).padStart(2, "0")}</span>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/[0.04] via-transparent to-transparent" />
    </div>
  );
}

export function PageCover({ guide, className }: { guide: Guide; className?: string }) {
  return <GuideCover guide={guide} className={className} sizes="(min-width: 1024px) 24vw, 60vw" />;
}

export function PageDay({ guide, dayIndex = 0, className }: { guide: Guide; dayIndex?: number; className?: string }) {
  const d = guide.itinerary[dayIndex] ?? guide.itinerary[0];
  const img = photo(guide.gallery[1] ?? guide.cover);
  return (
    <Sheet guide={guide} page={6 + dayIndex * 4} section="Itinéraire" className={className}>
      <p className="font-mono text-[2.4cqw] tracking-[0.16em] text-clay uppercase">Jour {String(d.day).padStart(2, "0")}</p>
      <h4 className="mt-[1.5cqw] font-serif text-[8.4cqw] leading-[0.95] tracking-[-0.02em]">{d.title}</h4>
      <p className="mt-[1.5cqw] font-mono text-[2.3cqw] text-ink/60">{d.route}</p>

      <div className="relative mt-[4cqw] h-[26cqw] overflow-hidden rounded-[1cqw]">
        <Image src={img.src} alt="" fill sizes="30vw" className="photo object-cover" />
      </div>

      <ol className="mt-[4cqw] space-y-[2.2cqw]">
        {d.moves.map((m, i) => (
          <li key={i} className="grid grid-cols-[5cqw_1fr_auto] items-center gap-[2cqw] border-b border-ink/10 pb-[2cqw]">
            <span className="flex size-[5cqw] items-center justify-center rounded-full border border-ink/25">
              <ModeIcon mode={m.mode} className="size-[2.8cqw]" />
            </span>
            <span className="text-[2.7cqw] leading-tight">
              {m.label}
              <span className="block font-mono text-[2cqw] text-ink/50">{modeLabels[m.mode]} · {m.duration}</span>
            </span>
            <span className="font-mono text-[2.5cqw]">{m.cost}</span>
          </li>
        ))}
      </ol>

      <ul className="mt-[3.5cqw] space-y-[1.6cqw]">
        {d.highlights.map((h, i) => (
          <li key={i} className="flex gap-[2cqw] text-[2.6cqw] leading-snug">
            <span className="font-serif text-[3.2cqw] leading-none text-clay italic">{i + 1}</span>
            {h}
          </li>
        ))}
      </ul>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between border-t border-ink pt-[2cqw]">
        <span className="font-mono text-[2.1cqw] tracking-[0.14em] uppercase">Dépense du jour</span>
        <span className="font-serif text-[6cqw] leading-none">{budget(d.spend)}</span>
      </div>
    </Sheet>
  );
}

/** Abstract cartography: contour lines, a lake, the route. No real map tiles. */
export function PageMap({ guide, className }: { guide: Guide; className?: string }) {
  const pts: [number, number][] = [
    [16, 78],
    [40, 52],
    [66, 60],
    [84, 26],
    [60, 18],
  ];
  const stops = guide.route.slice(0, pts.length);
  const path = stops.map((_, i) => `${i ? "L" : "M"}${pts[i][0]} ${pts[i][1]}`).join(" ");
  return (
    <Sheet guide={guide} page={12} section="Carte" className={className}>
      <p className="font-mono text-[2.4cqw] tracking-[0.16em] text-clay uppercase">Carte 01 / {String(guide.maps).padStart(2, "0")}</p>
      <h4 className="mt-[1.5cqw] font-serif text-[7.4cqw] leading-[0.95] tracking-[-0.02em]">L&apos;itinéraire complet</h4>

      <div className="relative mt-[4cqw] aspect-square w-full overflow-hidden rounded-[1cqw] bg-[#efe9dc]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
          {/* contours */}
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={`M-5 ${20 + i * 9} C 20 ${10 + i * 8}, 35 ${34 + i * 7}, 55 ${22 + i * 9} S 90 ${8 + i * 10}, 105 ${18 + i * 8}`}
              fill="none"
              stroke="#b9ad96"
              strokeWidth={0.35}
              opacity={0.8}
            />
          ))}
          {/* lake */}
          <path d="M52 66 C 58 60, 72 58, 78 64 C 82 70, 74 76, 64 75 C 56 74, 48 72, 52 66 Z" fill="#b9c0ab" opacity={0.7} />
          <path d="M-2 90 C 20 84, 30 96, 55 92 S 90 84, 102 90" fill="none" stroke="#9fb0a5" strokeWidth={1.6} opacity={0.6} />
          {/* route */}
          <path d={path} fill="none" stroke="#161614" strokeWidth={0.7} strokeDasharray="1.6 1.4" />
          {stops.map((s, i) => (
            <g key={`${s}-${i}`}>
              <circle cx={pts[i][0]} cy={pts[i][1]} r={i === 0 ? 2.2 : 1.6} fill={i === 0 ? "#b4532e" : "#161614"} />
              <text x={pts[i][0] + 3} y={pts[i][1] - 2.5} fontSize={3.4} fontFamily="var(--font-geist-mono)" fill="#161614">
                {s}
              </text>
            </g>
          ))}
          <g transform="translate(88 86)">
            <path d="M0 -6 L2 0 L0 -1.4 L-2 0 Z" fill="#161614" />
            <text x={0} y={5} fontSize={3} textAnchor="middle" fontFamily="var(--font-geist-mono)">N</text>
          </g>
          <g transform="translate(6 94)">
            <path d="M0 0 H16" stroke="#161614" strokeWidth={0.5} />
            <path d="M0 -1 V1 M8 -1 V1 M16 -1 V1" stroke="#161614" strokeWidth={0.5} />
            <text x={18} y={1} fontSize={2.6} fontFamily="var(--font-geist-mono)">10 km</text>
          </g>
        </svg>
      </div>

      <div className="mt-[3.5cqw] grid grid-cols-3 gap-[2cqw] font-mono text-[2cqw] leading-snug text-ink/70">
        <span><span className="mr-[1cqw] inline-block size-[1.8cqw] rounded-full bg-clay align-middle" />Départ</span>
        <span><span className="mr-[1cqw] inline-block w-[4cqw] border-t border-dashed border-ink align-middle" />Bus / train</span>
        <span><span className="mr-[1cqw] inline-block size-[1.8cqw] rounded-full bg-sage align-middle" />Baignade</span>
      </div>
    </Sheet>
  );
}

export function PageBudget({ guide, className }: { guide: Guide; className?: string }) {
  const b = guide.budgetBreakdown;
  const rows = [
    ["Transport", b.transport],
    ["Logement", b.logement],
    ["Nourriture", b.nourriture],
    ["Activités", b.activites],
  ] as const;
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <Sheet guide={guide} page={28} section="Budget" className={className}>
      <p className="font-mono text-[2.4cqw] tracking-[0.16em] text-clay uppercase">Budget détaillé</p>
      <h4 className="mt-[1.5cqw] font-serif text-[7.4cqw] leading-[0.95] tracking-[-0.02em]">Ce que coûte vraiment ce voyage</h4>

      <p className="mt-[5cqw] font-serif text-[22cqw] leading-[0.8] tracking-[-0.05em]">{guide.budget}<span className="text-[9cqw]"> €</span></p>
      <p className="mt-[2cqw] font-mono text-[2.2cqw] text-ink/60">1 personne · {guide.days} jours · logement partagé à deux</p>

      <div className="mt-[6cqw] space-y-[3.4cqw]">
        {rows.map(([label, v]) => (
          <div key={label}>
            <div className="flex justify-between text-[2.7cqw]">
              <span>{label}</span>
              <span className="font-mono">{v} €</span>
            </div>
            <div className="mt-[1.2cqw] h-[1.6cqw] bg-ink/8">
              <div className="h-full bg-forest" style={{ width: `${(v / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="absolute inset-x-0 bottom-0 border-t border-ink/15 pt-[2cqw] text-[2.3cqw] leading-snug text-ink/60">
        Prix relevés sur place en 2026. Les écarts de saison sont indiqués page 30.
      </p>
    </Sheet>
  );
}

export function PageAddresses({ guide, className }: { guide: Guide; className?: string }) {
  const img = photo(guide.gallery[2] ?? guide.cover);
  return (
    <Sheet guide={guide} page={31} section="Adresses" className={className}>
      <p className="font-mono text-[2.4cqw] tracking-[0.16em] text-clay uppercase">{guide.addressesCount} adresses</p>
      <h4 className="mt-[1.5cqw] font-serif text-[7.4cqw] leading-[0.95] tracking-[-0.02em]">Là où l&apos;on retourne</h4>
      <div className="relative mt-[4cqw] h-[22cqw] overflow-hidden rounded-[1cqw]">
        <Image src={img.src} alt="" fill sizes="30vw" className="photo object-cover" />
      </div>
      <ul className="mt-[3cqw]">
        {guide.addresses.slice(0, 5).map((a) => (
          <li key={a.name} className="grid grid-cols-[13cqw_1fr_auto] gap-[2cqw] border-b border-ink/10 py-[2cqw]">
            <span className="font-mono text-[2cqw] tracking-[0.1em] text-clay uppercase">{a.kind}</span>
            <span className="text-[2.6cqw] leading-tight">
              {a.name}
              <span className="block text-[2.1cqw] text-ink/55">{a.place} — {a.note}</span>
            </span>
            <span className="text-right font-mono text-[2.1cqw]">{a.price}</span>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

export function PageChecklist({ guide, className }: { guide: Guide; className?: string }) {
  const items = [
    ["Réserver le train aller", "J-60"],
    ["Première nuit réservée", "J-30"],
    ["Carte bancaire sans frais à l'étranger", "J-14"],
    ["Télécharger les cartes hors ligne", "J-3"],
    ["Horaires des bus imprimés (p. 9)", "J-2"],
    ["Gourde, frontale, maillot", "J-1"],
    ["Plan B météo relu", "J-1"],
  ];
  return (
    <Sheet guide={guide} page={33} section="Checklist" className={className}>
      <p className="font-mono text-[2.4cqw] tracking-[0.16em] text-clay uppercase">Avant de partir</p>
      <h4 className="mt-[1.5cqw] font-serif text-[7.4cqw] leading-[0.95] tracking-[-0.02em]">La checklist départ</h4>
      <ul className="mt-[6cqw] space-y-[3cqw]">
        {items.map(([label, when], i) => (
          <li key={label} className="flex items-center gap-[3cqw] border-b border-ink/10 pb-[2.6cqw]">
            <span
              className={cn(
                "flex size-[4.2cqw] shrink-0 items-center justify-center rounded-[0.8cqw] border border-ink/40",
                i < 3 && "border-forest bg-forest text-paper",
              )}
            >
              {i < 3 && (
                <svg viewBox="0 0 12 12" className="size-[2.6cqw]" aria-hidden>
                  <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth={1.6} />
                </svg>
              )}
            </span>
            <span className={cn("flex-1 text-[2.8cqw]", i < 3 && "text-ink/50 line-through decoration-ink/30")}>{label}</span>
            <span className="font-mono text-[2.1cqw] text-ink/50">{when}</span>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

export const guidePageList = [
  { key: "cover", label: "Couverture", C: PageCover },
  { key: "day", label: "Itinéraire jour 1", C: PageDay },
  { key: "map", label: "Carte", C: PageMap },
  { key: "budget", label: "Budget", C: PageBudget },
  { key: "addresses", label: "Bonnes adresses", C: PageAddresses },
  { key: "checklist", label: "Checklist", C: PageChecklist },
] as const;
