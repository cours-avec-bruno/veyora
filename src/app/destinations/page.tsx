import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { destinations } from "@/data/destinations";
import { photo } from "@/data/photos";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { BudgetMeter, Eyebrow } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Motion";
import { ModeRow } from "@/components/icons";
import { cn } from "@/lib/format";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Huit destinations européennes accessibles sans voiture : budget moyen, durée recommandée, transport, saison et difficulté pour chacune.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        index="—"
        eyebrow="Destinations"
        title={"Choisissez votre\nprochaine échappée."}
        crumbs={[{ href: "/", label: "Accueil" }, { label: "Destinations" }]}
        lead="Huit pays, zéro voiture. Chaque destination a été choisie pour une raison simple : on peut y aller, s'y déplacer et en revenir sans exploser son budget."
      />

      {/* Comparison index */}
      <section className="container-v pb-20" aria-labelledby="index-title">
        <div className="flex items-end justify-between gap-6 border-b border-ink pb-4">
          <h2 id="index-title" className="t-label text-muted">Index comparatif</h2>
          <p className="t-meta hidden text-muted md:block">Budget pour 1 personne, trajet inclus</p>
        </div>
        <ul className="md:hidden">
          {destinations.map((d, i) => (
            <li key={d.slug} className="border-b border-line">
              <Link href={`/destinations/${d.slug}`} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4">
                <span className="flex items-baseline gap-3">
                  <span className="t-meta text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl">{d.name}</span>
                </span>
                <BudgetMeter value={d.budget} />
                <span className="t-meta col-span-2 flex items-center gap-3 pl-8 text-graphite">
                  {d.days} jours · <ModeRow modes={d.modes} /> · {d.difficulty}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="t-label text-muted">
                <th scope="col" className="py-4 font-normal">Destination</th>
                <th scope="col" className="py-4 font-normal">Budget moyen</th>
                <th scope="col" className="py-4 font-normal">Durée</th>
                <th scope="col" className="py-4 font-normal">Transport</th>
                <th scope="col" className="py-4 font-normal">Saison</th>
                <th scope="col" className="py-4 font-normal">Difficulté</th>
                <th scope="col" className="py-4"><span className="sr-only">Lien</span></th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((d, i) => (
                <tr key={d.slug} className="group border-t border-line transition-colors hover:bg-paper-2/70">
                  <th scope="row" className="py-4 pr-4 font-normal">
                    <Link href={`#${d.slug}`} className="flex items-baseline gap-3">
                      <span className="t-meta text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-serif text-2xl">{d.name}</span>
                    </Link>
                  </th>
                  <td className="py-4 pr-4"><BudgetMeter value={d.budget} /></td>
                  <td className="t-meta py-4 pr-4">{d.days} jours</td>
                  <td className="py-4 pr-4 text-graphite"><ModeRow modes={d.modes} /></td>
                  <td className="t-meta py-4 pr-4">{d.season}</td>
                  <td className="t-meta py-4 pr-4">{d.difficulty}</td>
                  <td className="py-4 text-right">
                    <Link href={`/destinations/${d.slug}`} className="inline-flex size-9 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper" aria-label={`Voir ${d.name}`}>
                      <ArrowUpRight className="size-4" strokeWidth={1.5} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Destination spreads */}
      <section aria-label="Toutes les destinations">
        {destinations.map((d, i) => {
          const img = photo(d.image);
          const second = photo(d.secondaryImage);
          const flip = i % 2 === 1;
          return (
            <article key={d.slug} id={d.slug} className={cn("scroll-mt-24 border-t border-line", i % 2 === 1 && "bg-paper-2/50")}>
              <div className="container-v grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
                <Reveal className={cn("relative lg:col-span-7", flip && "lg:order-2 lg:col-start-6")}>
                  <Link href={`/destinations/${d.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] md:aspect-[16/11]">
                      <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="photo object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" />
                    </div>
                    <div className={cn("absolute -bottom-8 hidden w-[32%] overflow-hidden rounded-[3px] border-4 border-paper shadow-paper md:block", flip ? "-left-6" : "-right-6")}>
                      <div className="relative aspect-[3/4]">
                        <Image src={second.src} alt={second.alt} fill sizes="20vw" className="photo object-cover" />
                      </div>
                    </div>
                  </Link>
                </Reveal>

                <div className={cn("flex flex-col justify-center lg:col-span-5", flip && "lg:order-1 lg:col-start-1")}>
                  <Eyebrow index={String(i + 1).padStart(2, "0")}>{d.region}</Eyebrow>
                  <h2 className="mt-5 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.88] tracking-[-0.03em] uppercase">{d.name}</h2>
                  <p className="t-h3 mt-3 italic text-ink-2">{d.tagline}</p>

                  <dl className="mt-8 grid grid-cols-2 border-t border-ink">
                    {[
                      ["Budget moyen", `${d.budget} €`, true],
                      ["Durée recommandée", `${d.days} jours`],
                      ["Transport", d.transport],
                      ["Saison", d.season],
                      ["Niveau", d.difficulty],
                      ["Coordonnées", d.coords],
                    ].map(([k, v, big]) => (
                      <div key={k as string} className="border-b border-line py-3.5 pr-3">
                        <dt className="t-label text-[0.65rem] text-muted">{k}</dt>
                        <dd className={cn("mt-1.5", big ? "t-num text-4xl" : "text-[0.98rem]")}>{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href={`/destinations/${d.slug}`} variant="solid">
                      Découvrir {d.name}
                    </ButtonLink>
                    <ButtonLink href={`/guides/${d.guideSlug}`} variant="ghost" icon="none">
                      Voir le guide
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
