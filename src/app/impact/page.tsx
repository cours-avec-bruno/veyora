import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Impact } from "@/sections/home/Impact";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Motion";
import { ButtonLink } from "@/components/ui/Button";
import { impactPosition, impactCommitments } from "@/data/impact";

export const metadata: Metadata = {
  title: "Notre position sur l'impact",
  description:
    "Le train quand il gagne, la voiture quand elle est plus logique, l'avion quand il est nécessaire. Les ordres de grandeur sur lesquels Veyora construit ses guides, et ce qu'ils ne disent pas.",
  alternates: { canonical: "/impact" },
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        index="—"
        eyebrow="L'impact"
        title={"Le train quand il gagne.\nLe reste quand il perd."}
        crumbs={[{ href: "/", label: "Accueil" }, { label: "L'impact" }]}
        lead="Veyora ne cherche pas le voyage le moins émetteur possible. Il cherche le meilleur équilibre entre prix, temps, confort, expérience et impact — et il l'assume quand cet équilibre penche ailleurs que vers le rail."
      />

      <section className="border-t border-line section-y" aria-labelledby="position-title">
        <div className="container-v">
          <Eyebrow index="01">{impactPosition.eyebrow}</Eyebrow>
          <h2 id="position-title" className="sr-only">
            Notre position
          </h2>

          <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {impactPosition.rules.map((r, i) => (
              <Reveal key={r.n} delay={i * 0.08} className="bg-paper p-8 md:p-10">
                <span className="t-meta text-clay">{r.n}</span>
                <h3 className="t-h3 mt-6 text-balance">{r.title}</h3>
                <p className="mt-5 text-pretty text-graphite">{r.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 max-w-[64ch] border-l border-clay pl-6">
            <p className="t-lead text-ink">
              Le but n&apos;est pas de culpabiliser un lecteur qui prend l&apos;avion. Il est de lui
              montrer les cas — nombreux — où il n&apos;en a pas besoin.
            </p>
          </Reveal>
        </div>
      </section>

      <Impact index="02" />

      <section className="bg-ink text-paper section-y" aria-labelledby="commitments-title">
        <div className="container-v">
          <Eyebrow index="03" tone="light">
            Ce que ça change dans les guides
          </Eyebrow>
          <h2 id="commitments-title" className="t-display mt-6 max-w-[20ch] text-paper">
            Une exigence qui se vérifie <em>page par page.</em>
          </h2>

          <dl className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {impactCommitments.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.06}>
                <dt className="t-num block text-[clamp(2rem,4vw,3rem)] whitespace-nowrap text-paper">
                  {c.value}
                </dt>
                <dd className="mt-4">
                  <span className="block font-serif text-xl italic text-paper/90">{c.label}</span>
                  <span className="t-meta mt-3 block text-paper/55">{c.note}</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-16 flex flex-wrap gap-4">
            <ButtonLink href="/guides" variant="light">
              Voir les guides
            </ButtonLink>
            <ButtonLink href="/methode" variant="outline-light">
              Notre méthode
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
