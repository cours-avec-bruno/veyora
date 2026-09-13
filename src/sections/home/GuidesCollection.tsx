import { guides } from "@/data/guides";
import { GuideCard } from "@/components/cards/GuideCard";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal, SplitTitle } from "@/components/ui/Motion";

export function GuidesCollection() {
  const shown = guides.slice(0, 4);
  return (
    <section className="section-y relative" aria-labelledby="guides-title">
      <div className="container-v">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="03">La collection</Eyebrow>
            <SplitTitle id="guides-title" as="h2" text={"Des voyages déjà\npensés pour vous."} className="t-display mt-6" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="t-lead text-graphite text-pretty">
              Pas de liste interminable de blogs. Pas de 18 onglets ouverts.{" "}
              <span className="text-ink">Un itinéraire clair, prêt à partir.</span>
            </p>
            <p className="t-meta mt-4 text-muted">Pas besoin de comparer 17 blogs et 42 vidéos.</p>
          </Reveal>
        </div>

        {/* Collection shelf */}
        <div className="rail -mx-[var(--gutter)] mt-16 gap-6 px-[var(--gutter)] pb-4 md:mx-0 md:mt-24 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 lg:grid-cols-4">
          {shown.map((g, i) => (
            <Reveal
              key={g.slug}
              delay={i * 0.1}
              className={`w-[68vw] max-w-[20rem] shrink-0 md:w-auto md:max-w-none ${i % 2 === 1 ? "lg:mt-16" : ""}`}
            >
              <GuideCard guide={g} />
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="t-meta text-muted">
            {guides.length} guides · de {Math.min(...guides.map((g) => g.days))} à {Math.max(...guides.map((g) => g.days))} jours · PDF téléchargeable immédiatement
          </p>
          <ButtonLink href="/guides" variant="solid">
            Voir toute la collection
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
