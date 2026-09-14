import Link from "next/link";
import type { Guide } from "@/data/types";
import { collectionLabel, guides, upcomingVolumes } from "@/data/guides";
import { GuideCover } from "@/components/guide/GuideCover";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, PriceTag } from "@/components/ui/Primitives";
import { Reveal, SplitTitle } from "@/components/ui/Motion";
import { cn } from "@/lib/format";

/**
 * The collection, presented like the opening spread of a small series:
 * one lead volume, the regional volumes paired beneath it, then the shelf.
 * New volumes come from `data/guides.ts` — nothing here needs rewriting.
 */
const HOME_VOLUMES = 3; // lead + two regional volumes; the shelf lists them all

export function GuidesCollection() {
  const ordered = [...guides].sort((a, b) => a.volume.localeCompare(b.volume));
  const [lead, ...rest] = ordered;
  const secondary = rest.slice(0, HOME_VOLUMES - 1);

  return (
    <section className="section-y relative" aria-labelledby="guides-title">
      <div className="container-v">
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="03">Les guides Veyora</Eyebrow>
            <SplitTitle id="guides-title" as="h2" text={"Deux façons\nde partir."} className="t-display mt-6" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="t-lead text-graphite text-pretty">
              Des guides conçus pour transformer une envie de voyage en itinéraire réellement réalisable.
            </p>
            <p className="t-label mt-5 text-muted">
              Collection 2026 · Vol. {ordered[0].volume} — {ordered[ordered.length - 1].volume}
            </p>
          </Reveal>
        </header>

        <LeadVolume guide={lead} />
        {secondary.length > 0 && <RegionalPair volumes={secondary} />}

        <Shelf volumes={ordered} />
      </div>
    </section>
  );
}

/* ── Pieces ──────────────────────────────────────────────────────── */

function Book({ guide, sizes, className }: { guide: Guide; sizes: string; className?: string }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      tabIndex={-1}
      aria-hidden
      className={cn("group relative block [perspective:1600px]", className)}
    >
      {/* The page block of the PDF, fanning out a few pixels on hover */}
      <span
        aria-hidden
        className="absolute inset-y-[3%] right-[-4.5%] left-[10%] rounded-[3px] bg-[#e9e2d3] shadow-paper transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover/vol:translate-x-2"
      />
      <span
        aria-hidden
        className="absolute inset-y-[1.5%] right-[-2.2%] left-[5%] rounded-[3px] bg-[#f8f4ec] shadow-paper transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover/vol:translate-x-1"
      />
      <div className="relative transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover/vol:[transform:translateY(-8px)_rotateY(-5deg)_scale(1.015)]">
        <GuideCover guide={guide} sizes={sizes} className="transition-shadow duration-700 group-hover/vol:shadow-lift" />
      </div>
    </Link>
  );
}

function VolumeHead({ guide }: { guide: Guide }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="t-label text-ink">{collectionLabel(guide.volume)}</p>
        <p className="t-label text-muted">{guide.kind}</p>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <span
          aria-hidden
          className="h-px w-8 shrink-0 bg-ink transition-[width] duration-700 ease-[var(--ease-out-soft)] group-hover/vol:w-14"
        />
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="t-label text-clay">{guide.intent.word}</span>
          <span className="font-serif text-lg leading-tight text-ink-2 italic">{guide.intent.line}</span>
        </p>
      </div>
    </>
  );
}

function Facts({ items, className }: { items: [string, string][]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-3 gap-4 border-t border-line pt-4", className)}>
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="t-label text-[0.62rem] text-muted">{k}</dt>
          <dd className="mt-1.5 text-[0.95rem] leading-snug text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function PriceRow({ guide, lead }: { guide: Guide; lead?: boolean }) {
  return (
    <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-ink pt-6">
      <div className="flex items-end gap-4">
        <PriceTag value={guide.price} size={lead ? "lg" : "md"} />
        <span className="t-label pb-1 text-muted">{guide.format}</span>
      </div>
      <ButtonLink
        href={`/guides/${guide.slug}`}
        variant={lead ? "solid" : "ghost"}
        size="lg"
        aria-label={`Découvrir le guide ${guide.title}`}
        className="max-sm:w-full"
      >
        Découvrir le guide
      </ButtonLink>
    </div>
  );
}

/* ── Vol. 01: the wide one ───────────────────────────────────────── */

function LeadVolume({ guide: g }: { guide: Guide }) {
  const others = g.count.value - g.places.length;
  return (
    <article aria-labelledby={`vol-${g.volume}`} className="group/vol mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-x-8">
      <Reveal y={36} className="lg:col-span-6">
        <div className="relative -mx-[var(--gutter)] flex h-full items-center justify-center bg-paper-2 px-[var(--gutter)] pt-10 pb-14 md:pt-12 md:pb-16 lg:mr-0 lg:pr-12">
          <Book guide={g} sizes="(min-width: 1280px) 25rem, (min-width: 768px) 23rem, 74vw" className="w-[min(72vw,21rem)] md:w-[23rem] xl:w-[25rem]" />
          <p className="t-label absolute bottom-5 left-[var(--gutter)] text-muted md:bottom-6">
            Vol. {g.volume} · {g.pages} pages
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
        <VolumeHead guide={g} />

        <h3 id={`vol-${g.volume}`} className="mt-7 font-serif text-[clamp(2.7rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.03em] text-balance">
          {g.title}
        </h3>
        <p className="t-lead mt-5 max-w-[40ch] text-graphite text-pretty">{g.subtitle}</p>
        <p className="t-meta mt-4 text-muted">
          {g.places.join(" · ")}
          {others > 0 && <span className="text-muted/80"> — et {others} autres</span>}
        </p>

        <div className="mt-9">
          <p className="t-label text-muted">Dans ce guide</p>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 min-[420px]:grid-cols-2">
            {g.contents.map((c, i) => (
              <li key={c} className="flex items-baseline gap-3 border-t border-line py-2.5 text-[0.95rem] text-ink-2">
                <span className="t-meta text-[0.7rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <Facts
          className="mt-6"
          items={[
            [g.count.label, String(g.count.value)],
            ["Zone", g.area],
            ["Durée", g.duration.split(" de ").pop()!],
          ]}
        />
        <PriceRow guide={g} lead />
      </Reveal>
    </article>
  );
}

/* ── Vol. 02+: the regional guides, paired and offset ───────────── */

function RegionalPair({ volumes }: { volumes: Guide[] }) {
  return (
    <div className="mt-20 md:mt-28">
      <Reveal className="flex items-center gap-4">
        <p className="t-label text-muted">Explorer une région</p>
        <span aria-hidden className="h-px flex-1 bg-line" />
        <p className="t-label text-muted">{volumes.length} guides régionaux</p>
      </Reveal>
      <div className="mt-10 grid gap-16 md:mt-12 lg:grid-cols-12 lg:gap-x-8">
        {volumes.map((g, i) => (
          <RegionalVolume
            key={g.slug}
            guide={g}
            className={i % 2 === 0 ? "lg:col-span-5" : "lg:col-span-5 lg:col-start-8 lg:mt-24"}
          />
        ))}
      </div>
    </div>
  );
}

function RegionalVolume({ guide: g, className }: { guide: Guide; className?: string }) {
  return (
    <article aria-labelledby={`vol-${g.volume}`} className={cn("group/vol", className)}>
      <Reveal y={36}>
        <div className="relative -mx-[var(--gutter)] flex items-center justify-center bg-paper-3/70 px-[var(--gutter)] pt-10 pb-14 md:mx-0 md:pt-12">
          <Book guide={g} sizes="(min-width: 768px) 17rem, 62vw" className="w-[min(62vw,16rem)] md:w-[17rem]" />
          <p className="t-label absolute bottom-4 left-[var(--gutter)] text-muted md:left-5">
            Vol. {g.volume} · {g.pages} pages
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-9">
        <VolumeHead guide={g} />

        <h3 id={`vol-${g.volume}`} className="mt-6 font-serif text-[clamp(2.3rem,3.6vw,3.4rem)] leading-[0.95] tracking-[-0.03em] text-balance">
          {g.title}
        </h3>
        <p className="mt-3 font-serif text-xl leading-snug text-ink-2 italic">{g.subtitle}</p>
        <p className="mt-4 max-w-[46ch] text-[0.98rem] text-graphite text-pretty">{g.promise}</p>

        <ul className="t-label mt-5 flex flex-wrap gap-x-2 gap-y-2 text-ink" aria-label="Régions couvertes">
          {g.places.map((p, i) => (
            <li key={p} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted" aria-hidden>·</span>}
              {p}
            </li>
          ))}
        </ul>

        <Facts
          className="mt-6"
          items={[
            [g.count.label, String(g.count.value)],
            ["Transport", g.transport],
            ["Durée", g.duration.split(" de ").pop()!],
          ]}
        />
        <PriceRow guide={g} />
      </Reveal>
    </article>
  );
}

/* ── The shelf: what exists, and the room left for what comes ────── */

const spineTone: Record<Guide["tone"], string> = {
  forest: "bg-forest text-paper",
  ink: "bg-ink text-paper",
  clay: "bg-clay text-paper",
  moss: "bg-[#56634f] text-paper",
  paper: "bg-[#efe8da] text-ink shadow-[inset_0_0_0_1px_rgb(22_22_20/0.12)]",
};

function Shelf({ volumes }: { volumes: Guide[] }) {
  return (
    <div className="mt-20 grid gap-10 border-t border-line pt-10 md:mt-24 lg:grid-cols-12 lg:items-end">
      <Reveal className="lg:col-span-5">
        <p className="t-label text-muted">La collection</p>
        <p className="t-h2 mt-4 text-balance">
          La collection ne fait <em>que commencer.</em>
        </p>
        <p className="mt-3 text-graphite">De nouveaux guides arrivent progressivement.</p>
      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
        <ol className="flex items-end gap-2 border-b border-ink/60 sm:gap-3" aria-label="Volumes de la collection">
          {volumes.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                aria-label={`Vol. ${g.volume} — ${g.title}`}
                className={cn(
                  "flex h-[11.5rem] w-10 flex-col items-center justify-between rounded-t-[2px] py-3 transition-transform duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-2 md:h-[12.5rem] md:w-12",
                  spineTone[g.tone],
                )}
              >
                <span className="font-mono text-[0.62rem] tracking-[0.1em]">{g.volume}</span>
                <span className="rotate-180 font-serif text-[0.78rem] leading-none whitespace-nowrap [writing-mode:vertical-rl] md:text-[0.86rem]">
                  {g.title}
                </span>
                <span aria-hidden className="block size-1 rounded-full bg-current opacity-60" />
              </Link>
            </li>
          ))}
          {upcomingVolumes.map((v) => (
            <li key={v} aria-label={`Vol. ${v} — à venir`}>
              <div className="flex h-[11.5rem] w-10 flex-col items-center justify-between rounded-t-[2px] border border-b-0 border-dashed border-ink/25 py-3 text-muted md:h-[12.5rem] md:w-12">
                <span className="font-mono text-[0.62rem] tracking-[0.1em]" aria-hidden>{v}</span>
                <span className="rotate-180 font-mono text-[0.6rem] tracking-[0.18em] whitespace-nowrap uppercase [writing-mode:vertical-rl]" aria-hidden>
                  À venir
                </span>
                <span aria-hidden />
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="t-meta text-muted">
            {volumes.length} volumes disponibles{upcomingVolumes.length > 0 && ` · ${upcomingVolumes.length} en préparation`}
          </p>
          <Link href="/guides" className="link-u-static t-meta whitespace-nowrap text-ink">
            Tous les guides
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
