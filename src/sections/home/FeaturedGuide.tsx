import { Check } from "lucide-react";
import { featuredGuide as g } from "@/data/guides";
import { GuideCover } from "@/components/guide/GuideCover";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, PriceTag } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Motion";
import { RouteLine } from "@/components/ui/Brand";
import { ModeRow } from "@/components/icons";
import { budget } from "@/lib/format";

const includes = [
  "Itinéraire jour par jour",
  "Transports et horaires",
  "Logements recommandés",
  "Budget détaillé",
  "Restaurants",
  "Carte interactive",
  "Spots nature",
  "Alternatives selon la météo",
];

export function FeaturedGuide() {
  return (
    <section className="relative overflow-hidden bg-forest text-paper" aria-labelledby="featured-title">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[46rem] rounded-full border border-paper/10" />
      <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 size-[36rem] rounded-full border border-paper/10" />

      <div className="container-v section-y relative grid gap-16 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-6" y={40}>
          <div className="relative mx-auto max-w-[34rem] [perspective:1600px]">
            {/* Shadow page behind */}
            <div aria-hidden className="absolute inset-0 translate-x-6 translate-y-4 rotate-[4deg] rounded-[3px] bg-paper/10" />
            <div className="transition-transform duration-1000 ease-[var(--ease-out-soft)] hover:[transform:rotateY(-8deg)_translateY(-8px)]">
              <GuideCover guide={g} sizes="(min-width: 1024px) 34rem, 85vw" />
            </div>
            <span className="t-label absolute -bottom-10 left-0 text-paper/60">
              Vol. {g.volume} · {g.pages} pages · PDF
            </span>
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <Eyebrow index="04" tone="light">Le guide du moment</Eyebrow>
          <h2 id="featured-title" className="mt-6 font-serif text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.88] tracking-[-0.03em] uppercase">
            {g.title}
          </h2>
          <p className="t-h3 mt-4 italic text-paper/85">{g.subtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-paper/20 py-4">
            <span className="t-meta">À partir de {budget(g.budget)} le voyage</span>
            <span className="t-meta flex items-center gap-2 text-paper/80">
              <ModeRow modes={g.modes} /> Sans voiture
            </span>
            <span className="t-meta text-paper/80">{g.season}</span>
          </div>

          <RouteLine stops={g.route} light className="mt-8" />

          <p className="t-label mt-10 text-paper/60">Le guide comprend</p>
          <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {includes.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[0.98rem] text-paper/90">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-sage/60 text-sage">
                  <Check className="size-3" strokeWidth={2.2} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-label text-paper/60">Prix du guide</p>
              <PriceTag value={g.price} size="lg" className="mt-2" />
            </div>
            <ButtonLink href={`/guides/${g.slug}`} variant="light" size="lg">
              Voir le guide
            </ButtonLink>
          </div>
          <p className="t-meta mt-6 text-paper/55">Soit {((g.price / g.budget) * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % du budget du voyage.</p>
        </div>
      </div>
    </section>
  );
}
