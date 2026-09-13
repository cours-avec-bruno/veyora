import type { Metadata } from "next";
import Image from "next/image";
import { photo } from "@/data/photos";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal, SplitTitle } from "@/components/ui/Motion";
import { ButtonLink } from "@/components/ui/Button";
import { Manifesto } from "@/sections/home/Manifesto";

export const metadata: Metadata = {
  title: "À propos — le manifeste",
  description:
    "Veyora est un média et une boutique de guides de voyage indépendants. Notre conviction : le voyage peut être économique, responsable et beau.",
  alternates: { canonical: "/a-propos" },
};

const refusals = [
  ["Pas de liens sponsorisés cachés", "Quand une adresse est dans un guide, c'est parce qu'on y retournerait."],
  ["Pas de fausses promotions", "Un guide coûte son prix, toute l'année. Pas de compte à rebours."],
  ["Pas d'avion par défaut", "Mais pas de dogme non plus : quand le train n'a pas de sens, on le dit."],
  ["Pas de listes interminables", "Un itinéraire, des choix assumés. Le reste est du bruit."],
];

export default function AboutPage() {
  const hero = photo("coast-stairs");
  const inset = photo("platform-gold");
  const inset2 = photo("cafe");

  return (
    <>
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-paper">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="photo -z-10 object-cover object-[50%_40%]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        <div className="container-v pt-[calc(var(--nav-h)+2rem)] pb-14 md:pb-20">
          <Eyebrow tone="light" index="—">Manifeste Veyora</Eyebrow>
          <SplitTitle
            as="h1"
            immediate
            delay={0.2}
            text={"Le voyage ne devrait pas\nêtre réservé à ceux qui\npeuvent partir cher."}
            className="mt-8 max-w-[22ch] font-serif text-[clamp(2.8rem,7vw,7rem)] leading-[0.95] tracking-[-0.03em]"
          />
          <p className="t-label mt-10 text-paper/65">Écrit sur un quai de gare · Mis à jour en septembre 2026</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-v grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="01">D&apos;où l&apos;on part</Eyebrow>
            <Reveal delay={0.1} className="relative mt-10 hidden aspect-[3/4] overflow-hidden rounded-[3px] lg:block">
              <Image src={inset.src} alt={inset.alt} fill sizes="30vw" className="photo object-cover" />
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <p className="font-serif text-[clamp(2rem,4vw,3.6rem)] leading-[1.08] tracking-[-0.02em] text-balance">
                Le monde est vaste. Votre budget ne l&apos;est pas toujours.{" "}
                <em className="text-clay">Alors on cherche de meilleures façons de partir.</em>
              </p>
            </Reveal>
            <div className="mt-14 grid gap-8 text-[1.1rem] leading-[1.75] text-ink-2 md:grid-cols-2">
              <p>
                Les réseaux sont remplis de voyages magnifiques et impossibles à reproduire : hôtels à 400 € la nuit, vols
                pris à la dernière minute, activités qui coûtent plus cher que le trajet. On les regarde, on les
                enregistre, et on ne part pas.
              </p>
              <p>
                Veyora est né de l&apos;envie inverse. Prendre une destination, et la transformer en voyage réellement
                faisable : un itinéraire, un budget, des trains et des bus, des adresses où l&apos;on retournerait. Puis
                l&apos;écrire assez clairement pour que quelqu&apos;un d&apos;autre puisse partir demain.
              </p>
              <p>
                Nos vidéos servent à donner l&apos;idée. Nos guides servent à la rendre possible. Entre les deux, il y a
                des semaines de comparaisons, de calculs, et au moins un trajet fait pour de vrai.
              </p>
              <p>
                Nous sommes une petite rédaction indépendante. Nous ne vendons ni billets, ni hôtels, ni séjours. Nous
                vendons du temps gagné et des erreurs évitées — sous la forme d&apos;un PDF qui coûte moins qu&apos;un
                repas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Manifesto index="02" cta={false} />

      <section className="section-y">
        <div className="container-v grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index="03">Ce que nous refusons</Eyebrow>
            <h2 className="t-h1 mt-6 text-balance">La confiance ne se gagne pas avec un compte à rebours.</h2>
            <Reveal delay={0.1} className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[3px] lg:block">
              <Image src={inset2.src} alt={inset2.alt} fill sizes="40vw" className="photo object-cover" />
            </Reveal>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {refusals.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink py-8">
                <span className="t-num text-4xl text-muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="t-h3">{t}</h3>
                  <p className="mt-2 text-graphite">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2 section-y">
        <div className="container-v flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <h2 className="t-display max-w-[14ch] text-balance">Assez lu. <em>On part ?</em></h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/guides" size="lg">Explorer les guides</ButtonLink>
            <ButtonLink href="/methode" variant="ghost" size="lg" icon="none">Notre méthode</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
