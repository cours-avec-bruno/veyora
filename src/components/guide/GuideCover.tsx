import Image from "next/image";
import type { Guide, CoverTone } from "@/data/types";
import { photo } from "@/data/photos";
import { cn } from "@/lib/format";

const tones: Record<CoverTone, { bg: string; fg: string; soft: string; accent: string; line: string }> = {
  forest: { bg: "bg-forest", fg: "text-paper", soft: "text-paper/65", accent: "text-sage", line: "bg-paper/30" },
  ink: { bg: "bg-ink", fg: "text-paper", soft: "text-paper/60", accent: "text-clay", line: "bg-paper/25" },
  clay: { bg: "bg-clay", fg: "text-paper", soft: "text-paper/75", accent: "text-ink", line: "bg-paper/35" },
  paper: { bg: "bg-paper-2", fg: "text-ink", soft: "text-ink/60", accent: "text-clay", line: "bg-ink/20" },
  moss: { bg: "bg-[#56634f]", fg: "text-paper", soft: "text-paper/70", accent: "text-sun", line: "bg-paper/30" },
};

/**
 * A printed guide, drawn in CSS. Every measure is in container units so the
 * same cover reads at 140px (thumbnail) and at 640px (product hero).
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
  const long = guide.title.length > 9;

  return (
    <div
      className={cn(
        "@container relative aspect-[5/7] w-full overflow-hidden rounded-[3px] shadow-book select-none",
        t.bg,
        t.fg,
        className,
      )}
    >
      {/* Photo window */}
      <div className="absolute inset-x-[7cqw] top-[15cqw] h-[58cqw] overflow-hidden">
        <Image
          src={img.src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="photo object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <span className="absolute bottom-[2.5cqw] left-[3cqw] font-mono text-[2.3cqw] tracking-[0.12em] text-paper/90 uppercase">
          {guide.coords}
        </span>
      </div>

      {/* Masthead */}
      <div className="absolute inset-x-[7cqw] top-[5.5cqw] flex items-center justify-between">
        <span className="font-serif text-[4.4cqw] leading-none tracking-[0.22em] uppercase">Veyora</span>
        <span className={cn("font-mono text-[2.3cqw] tracking-[0.16em] uppercase", t.soft)}>
          Guide N° {guide.number}
        </span>
      </div>

      {/* Title block */}
      <div className="absolute inset-x-[7cqw] top-[78cqw]">
        <div className="flex items-baseline justify-between gap-[3cqw]">
          <h3
            className={cn(
              "font-serif leading-[0.86] tracking-[-0.03em] uppercase",
              long ? "text-[10.5cqw]" : "text-[14cqw]",
            )}
          >
            {guide.title}
          </h3>
        </div>
        <div className="mt-[3.2cqw] flex items-end justify-between gap-[3cqw]">
          <p className="font-serif text-[6.2cqw] leading-none italic">
            {guide.days} jours
          </p>
          <p className={cn("text-right font-mono text-[2.3cqw] leading-[1.5] tracking-[0.14em] uppercase", t.soft)}>
            {guide.coverTags.join(" · ")}
          </p>
        </div>
      </div>

      {/* Footer: route + split wordmark */}
      <div className="absolute inset-x-[7cqw] bottom-[6cqw]">
        <div className="relative flex items-center justify-between">
          <span className={cn("absolute inset-x-[1cqw] top-1/2 h-px", t.line)} aria-hidden />
          {guide.route.map((s, i) => (
            <span
              key={`${s}-${i}`}
              className={cn(
                "relative block size-[2.2cqw] rounded-full border border-current",
                i === 0 || i === guide.route.length - 1 ? "bg-current" : t.bg,
              )}
              aria-hidden
            />
          ))}
        </div>
        <div className={cn("mt-[3.5cqw] flex items-center justify-between font-mono text-[2.2cqw] tracking-[0.18em] uppercase", t.soft)}>
          <span>
            {guide.route[0]} → {guide.route[guide.route.length - 1] === guide.route[0] ? guide.route[guide.route.length - 2] : guide.route[guide.route.length - 1]}
          </span>
          <span className={cn("tracking-[0.5em]", t.accent)}>VE YORA</span>
        </div>
      </div>

      {/* Spine & paper sheen */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[3.5cqw] bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-[3.5cqw] w-px bg-white/10" />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-black/[0.12]" />
    </div>
  );
}
