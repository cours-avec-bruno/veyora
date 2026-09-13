import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Method } from "@/sections/home/Method";
import { Figures } from "@/sections/home/Figures";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Motion";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Notre méthode",
  description:
    "Explorer, optimiser, construire, tester, publier : comment Veyora transforme une destination en voyage réellement faisable.",
  alternates: { canonical: "/methode" },
};

const criteria = [
  { value: "≤ 8 h", label: "de train depuis une grande ville française", note: "ou un train de nuit direct" },
  { value: "≤ 2 h", label: "de trajet par jour sur place", note: "le voyage n'est pas une correspondance" },
  { value: "0", label: "voiture nécessaire", note: "vélo, bus, bateau et marche comptent" },
  { value: "< 500 €", label: "de budget total pour 1 personne", note: "trajet depuis la porte d'entrée inclus" },
  { value: "1", label: "plan B par journée", note: "pluie, grève, sentier fermé" },
  { value: "4×", label: "révision par an", note: "prix et horaires relevés à chaque saison" },
];

export default function MethodPage() {
  return (
    <>
      <PageHero
        index="—"
        eyebrow="Notre méthode"
        title={"Un guide, c'est six\nsemaines de choix."}
        crumbs={[{ href: "/", label: "Accueil" }, { label: "Notre méthode" }]}
        lead="On ne compile pas des avis. On construit un voyage, on le teste, et on n'en garde que ce qui fonctionne vraiment."
      />

      <div className="border-t border-line">
        <Method withCta={false} index="01" />
      </div>

      <section className="bg-paper-2 section-y" aria-labelledby="criteria-title">
        <div className="container-v">
          <Eyebrow index="02">Nos critères</Eyebrow>
          <h2 id="criteria-title" className="t-h1 mt-6 max-w-[20ch] text-balance">Six règles qu&apos;une destination doit respecter.</h2>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[3px] bg-line sm:grid-cols-2 lg:grid-cols-3">
            {criteria.map((c, i) => (
              <Reveal as="li" key={c.label} delay={(i % 3) * 0.08} className="bg-paper-2 p-8 md:p-10">
                <span className="t-num block text-[clamp(3.4rem,6vw,5rem)]">{c.value}</span>
                <span className="mt-4 block text-[1.1rem]">{c.label}</span>
                <span className="t-meta mt-2 block text-muted">— {c.note}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Figures />

      <section className="section-y">
        <div className="container-v flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <h2 className="t-display max-w-[16ch] text-balance">Le résultat tient dans un PDF.</h2>
          <ButtonLink href="/guides" size="lg">Explorer les guides</ButtonLink>
        </div>
      </section>
    </>
  );
}
