import Image from "next/image";
import type { Guide, CoverTone } from "@/data/types";
import { photo } from "@/data/photos";
import { cn } from "@/lib/format";

const tones: Record<CoverTone, { bg: string; fg: string; soft: string; rule: string; accent: string }> = {
  forest: { bg: "bg-forest", fg: "text-paper", soft: "text-paper/65", rule: "bg-paper/25", accent: "text-sage" },
  ink: { bg: "bg-ink", fg: "text-paper", soft: "text-paper/60", rule: "bg-paper/20", accent: "text-clay" },
  clay: { bg: "bg-clay", fg: "text-paper", soft: "text-paper/75", rule: "bg-paper/30", accent: "text-ink" },
  paper: { bg: "bg-[#efe8da]", fg: "text-ink", soft: "text-ink/55", rule: "bg-ink/20", accent: "text-clay" },
  moss: { bg: "bg-[#56634f]", fg: "text-paper", soft: "text-paper/70", rule: "bg-paper/30", accent: "text-sun" },
};

/**
 * A volume of the collection, drawn in CSS. Every measure is in container
 * units so the same cover reads at 48px (cart) and at 600px (product hero).
 *
 * Two layouts, chosen by the data: a large numeral for collection volumes
 * (`coverNumeral`), a stacked title with a crossing mark for regional ones.
 */
export function GuideCover({
  guide,
  className,
  priority,
  sizes = "(min-width: 1024px) 30vw, 70vw",
}: {
  guide: Guide;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const t = tones[guide.tone];
  const img = photo(guide.cover);
  const numeral = Boolean(guide.coverNumeral);

  return (
    <div
      className={cn(
        "@container relative aspect-[5/7] w-full overflow-hidden rounded-[3px] shadow-book select-none",
        t.bg,
        t.fg,
        className,
      )}
    >
      {numeral ? <NumeralLayout guide={guide} t={t} img={img} sizes={sizes} priority={priority} /> : <RegionalLayout guide={guide} t={t} img={img} sizes={sizes} priority={priority} />}

      {/* Spine & paper sheen */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[3.5cqw] bg-gradient-to-r from-black/25 via-black/[0.08] to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-[3.5cqw] w-px bg-white/10" />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-black/[0.1]" />
    </div>
  );
}

type LayoutProps = {
  guide: Guide;
  t: (typeof tones)[CoverTone];
  img: ReturnType<typeof photo>;
  sizes: string;
  priority?: boolean;
};

function Masthead({ guide, className, soft }: { guide: Guide; className?: string; soft: string }) {
  return (
    <div className={cn("absolute inset-x-[7cqw] top-[5.5cqw] flex items-center justify-between", className)}>
      <span className="font-serif text-[4.4cqw] leading-none tracking-[0.24em] uppercase">Veyora</span>
      <span className={cn("font-mono text-[2.3cqw] tracking-[0.18em] uppercase", soft)}>Guides / {guide.volume}</span>
    </div>
  );
}

/** Collection volume: full-bleed photograph, a numeral that overlaps its edge. */
function NumeralLayout({ guide, t, img, sizes, priority }: LayoutProps) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[86cqw] overflow-hidden">
        <Image
          src={img.src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="photo object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[34cqw] bg-gradient-to-t from-forest via-forest/55 to-transparent" />
      </div>

      <Masthead guide={guide} soft="text-paper/75" className="text-paper" />

      <div className="absolute inset-x-[7cqw] bottom-[5.5cqw] flex flex-col">
        <p className="mb-[2.5cqw] font-serif text-[46cqw] leading-[0.78] tracking-[-0.06em]">{guide.coverNumeral}</p>
        <h3 className="font-serif text-[12.6cqw] leading-[0.84] tracking-[-0.025em] uppercase">
          {guide.coverTitle.map((line, i) => (
            <span key={line} className={cn("block", i > 0 && "italic")}>
              {line}
            </span>
          ))}
        </h3>
        <p className="mt-[4cqw] font-serif text-[4.6cqw] leading-[1.15] italic">{guide.tagline}</p>
        <div className={cn("mt-[4cqw] h-px", t.rule)} aria-hidden />
        <div className={cn("mt-[2.4cqw] flex items-center justify-between font-mono text-[2.2cqw] tracking-[0.16em] uppercase", t.soft)}>
          <span>
            {guide.scope} · {guide.area}
          </span>
          <span className={t.accent}>Vol. {guide.volume}</span>
        </div>
      </div>
    </>
  );
}

/** Regional volume: stacked title, framed photograph, a border-crossing mark. */
function RegionalLayout({ guide, t, img, sizes, priority }: LayoutProps) {
  return (
    <>
      <Masthead guide={guide} soft={t.soft} />
      <div className={cn("absolute inset-x-[7cqw] top-[12cqw] h-px", t.rule)} aria-hidden />

      <h3 className="absolute inset-x-[7cqw] top-[16cqw] font-serif text-[13.2cqw] leading-[0.84] tracking-[-0.03em] uppercase">
        {guide.coverTitle.map((line) => (
          <span key={line} className="block">
            {line.startsWith("+") ? (
              <>
                <span className={t.accent}>+</span>
                {line.slice(1)}
              </>
            ) : (
              line
            )}
          </span>
        ))}
      </h3>

      <div className="absolute inset-x-[7cqw] top-[57cqw] h-[38cqw] overflow-hidden">
        <Image
          src={img.src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="photo object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
        />
      </div>

      {/* From one end of the region to the other, one crossing */}
      <svg viewBox="0 0 86 12" className="absolute inset-x-[7cqw] top-[98cqw] w-[86cqw]" aria-hidden>
        <path d="M2 9 C 24 -1, 62 -1, 84 9" fill="none" stroke="currentColor" strokeWidth="0.45" strokeDasharray="1.4 1.2" opacity="0.55" />
        <line x1="43" y1="0.6" x2="43" y2="5.4" stroke="currentColor" strokeWidth="0.45" opacity="0.55" />
        <circle cx="2" cy="9" r="1.3" fill="currentColor" />
        <circle cx="84" cy="9" r="1.3" className="fill-clay" />
      </svg>
      <div className={cn("absolute inset-x-[7cqw] top-[110.5cqw] flex justify-between px-[4cqw] font-mono text-[2.1cqw] tracking-[0.16em] uppercase", t.soft)}>
        {guide.scope.split(" · ").map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      <div className="absolute inset-x-[7cqw] bottom-[5.5cqw]">
        <p className="font-serif text-[4.6cqw] leading-none italic">{guide.tagline}</p>
        <div className={cn("mt-[3.5cqw] h-px", t.rule)} aria-hidden />
        <div className={cn("mt-[2.4cqw] flex items-center justify-between font-mono text-[2.2cqw] tracking-[0.16em] uppercase", t.soft)}>
          <span>{guide.kind}</span>
          <span className={t.accent}>Vol. {guide.volume}</span>
        </div>
      </div>
    </>
  );
}
