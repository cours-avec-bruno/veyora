import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { SectionHeader } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Motion";
import { cn } from "@/lib/format";

/* Explicit editorial placement on a 12-col / 11rem-row grid (desktop). */
const layout = [
  "lg:col-start-1 lg:col-end-8 lg:row-start-1 lg:row-end-5",
  "lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:row-end-3",
  "lg:col-start-8 lg:col-end-13 lg:row-start-3 lg:row-end-5",
  "lg:col-start-1 lg:col-end-5 lg:row-start-5 lg:row-end-8",
  "lg:col-start-5 lg:col-end-9 lg:row-start-5 lg:row-end-7",
  "lg:col-start-9 lg:col-end-13 lg:row-start-5 lg:row-end-8",
  "lg:col-start-1 lg:col-end-6 lg:row-start-8 lg:row-end-11",
  "lg:col-start-6 lg:col-end-13 lg:row-start-8 lg:row-end-11",
];
const sizes = ["lg", "md", "md", "sm", "sm", "sm", "md", "lg"] as const;

export function DestinationsGrid() {
  return (
    <section className="section-y bg-paper-2/60" aria-labelledby="dest-title">
      <div className="container-v">
        <SectionHeader
          index="02"
          eyebrow="Destinations"
          title={<span id="dest-title">Où partir maintenant&nbsp;?</span>}
          lead="Huit destinations européennes où le train, le bus et la marche suffisent. Budget total affiché, saison conseillée, et un guide pour chacune."
        >
          <ButtonLink href="/destinations" variant="ghost" size="md">
            Toutes les destinations
          </ButtonLink>
        </SectionHeader>

        {/* Mobile: swipeable rail of vertical cards */}
        <div className="rail -mx-[var(--gutter)] mt-12 gap-3 px-[var(--gutter)] md:hidden">
          {destinations.map((d, i) => (
            <DestinationCard
              key={d.slug}
              destination={d}
              index={i}
              size="md"
              className="aspect-[4/5.4] min-h-0 w-[80vw] shrink-0"
              sizes="80vw"
            />
          ))}
        </div>

        {/* Tablet: two columns, alternating heights */}
        <div className="mt-16 hidden grid-cols-2 gap-4 md:grid lg:hidden">
          {destinations.map((d, i) => (
            <DestinationCard
              key={d.slug}
              destination={d}
              index={i}
              size="sm"
              className={cn(i % 3 === 0 ? "col-span-2 min-h-[30rem]" : "min-h-[26rem]")}
              sizes="(min-width: 768px) 50vw, 90vw"
            />
          ))}
        </div>

        {/* Desktop: asymmetric editorial grid */}
        <div className="mt-20 hidden gap-4 lg:grid lg:grid-cols-12 lg:grid-rows-[repeat(10,11rem)]">
          {destinations.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 0.08} className={cn("flex", layout[i])}>
              <DestinationCard
                destination={d}
                index={i}
                size={sizes[i]}
                className="h-full min-h-0 w-full"
                sizes={sizes[i] === "lg" ? "58vw" : "40vw"}
              />
            </Reveal>
          ))}
          <div className="flex flex-col justify-between border-t border-ink pt-5 lg:col-start-5 lg:col-end-9 lg:row-start-7 lg:row-end-8">
            <p className="t-label text-muted">Note de la rédaction</p>
            <p className="font-serif text-[1.65rem] leading-[1.1] text-balance">
              Toutes accessibles sans voiture. Six sur huit sous 350&nbsp;€.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
