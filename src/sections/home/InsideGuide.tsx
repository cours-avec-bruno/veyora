import { featuredGuide } from "@/data/guides";
import { GuideSpread } from "@/components/guide/GuideSpread";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal, SplitTitle } from "@/components/ui/Motion";

const contents = [
  ["Couverture", "Imprimable, lisible sur téléphone"],
  ["Jour par jour", "Trajets, horaires, coûts"],
  ["Cartes", "Arrêts, sentiers, points d'eau"],
  ["Budget", "Chaque euro, poste par poste"],
  ["Adresses", "Dormir, manger, voir"],
  ["Checklist", "Tout régler avant J-1"],
];

export function InsideGuide() {
  return (
    <section className="section-y overflow-hidden bg-paper-2" aria-labelledby="inside-title">
      <div className="container-v">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Eyebrow index="05">Aperçu</Eyebrow>
            <SplitTitle id="inside-title" as="h2" text={"À quoi ressemble\nun guide ?"} className="t-display mt-6" />
          </div>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <p className="t-lead text-graphite text-pretty">
              Un PDF de {featuredGuide.pages} pages conçu comme un carnet de route : on l&apos;ouvre dans le train, on
              le suit sur place, on n&apos;a rien à recouper ailleurs.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 lg:mt-20">
          <GuideSpread guide={featuredGuide} />
        </div>

        <div className="mt-10 grid gap-10 lg:mt-4 lg:grid-cols-12">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:col-span-8">
            {contents.map(([t, d], i) => (
              <li key={t} className="border-t border-ink/20 pt-4">
                <span className="t-meta text-muted">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-medium">{t}</p>
                <p className="text-sm text-graphite">{d}</p>
              </li>
            ))}
          </ol>
          <div className="flex items-end lg:col-span-3 lg:col-start-10 lg:justify-end">
            <ButtonLink href={`/guides/${featuredGuide.slug}#apercu`} variant="solid" size="lg">
              Feuilleter le guide
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
