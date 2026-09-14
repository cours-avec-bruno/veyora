import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { destinations, getDestination } from "@/data/destinations";
import { getGuide } from "@/data/guides";
import { price } from "@/lib/format";
import { photo } from "@/data/photos";
import { site } from "@/data/site";
import { Breadcrumb } from "@/components/layout/PageHero";
import { GuideCover } from "@/components/guide/GuideCover";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { ButtonLink } from "@/components/ui/Button";
import { BudgetMeter, Eyebrow, PriceTag } from "@/components/ui/Primitives";
import { RouteLine } from "@/components/ui/Brand";
import { Reveal, SplitTitle } from "@/components/ui/Motion";
import { JsonLd } from "@/components/ui/JsonLd";
import { ModeRow } from "@/components/icons";
import { MobileDock } from "@/components/layout/Navbar";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  const title = `${d.name} sans voiture — ${d.days} jours, ≈ ${d.budget} €`;
  return {
    title,
    description: `${d.tagline} ${d.intro.split(". ")[0]}.`,
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: { title, images: [{ url: `${site.url}${photo(d.image).src}` }] },
  };
}

export default async function DestinationPage({ params }: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();
  const guide = getGuide(d.guideSlug);
  const img = photo(d.image);
  const others = destinations.filter((x) => x.slug !== d.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: d.name,
          description: d.intro,
          image: `${site.url}${img.src}`,
          url: `${site.url}/destinations/${d.slug}`,
        }}
      />

      {/* Hero */}
      <section className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden bg-ink text-paper">
        <Image src={img.src} alt={img.alt} fill priority sizes="100vw" className="photo -z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/20 to-black/45" />
        <div className="container-v pt-[calc(var(--nav-h)+2rem)] pb-12 md:pb-16">
          <Breadcrumb light items={[{ href: "/destinations", label: "Destinations" }, { label: d.name }]} />
          <p className="t-label mt-10 text-paper/70">{d.region} · {d.coords}</p>
          <h1 className="mt-4 font-serif text-[clamp(4rem,14vw,13rem)] leading-[0.82] tracking-[-0.04em] uppercase">{d.name}</h1>
          <p className="t-h2 mt-5 max-w-[26ch] italic text-paper/90">{d.tagline}</p>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] bg-paper/15 backdrop-blur-md sm:grid-cols-5">
            {[
              ["Budget moyen", <BudgetMeter key="b" value={d.budget} light />],
              ["Durée", `${d.days} jours`],
              ["Transport", <span key="t" className="inline-flex items-center gap-2"><ModeRow modes={d.modes} /></span>],
              ["Saison", d.season],
              ["Difficulté", d.difficulty],
            ].map(([k, v]) => (
              <div key={k as string} className="bg-black/35 p-4 last:col-span-2 sm:last:col-span-1">
                <dt className="t-label text-[0.62rem] text-paper/60">{k}</dt>
                <dd className="t-meta mt-2 text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Intro */}
      <section className="section-y">
        <div className="container-v grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="01">Pourquoi partir</Eyebrow>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="font-serif text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.12] tracking-[-0.015em] text-balance">{d.intro}</p>
            </Reveal>
            <ol className="mt-16 grid gap-10 border-t border-ink pt-10 md:grid-cols-3">
              {d.why.map((w, i) => (
                <Reveal as="li" key={w.title} delay={i * 0.1}>
                  <span className="t-meta text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="t-h3 mt-3">{w.title}</h3>
                  <p className="mt-3 text-graphite">{w.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Getting there */}
      <section className="bg-paper-2 section-y" aria-labelledby="acces-title">
        <div className="container-v">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="02">Y aller</Eyebrow>
              <SplitTitle id="acces-title" as="h2" text="Comment y aller sans voiture." className="t-h1 mt-6" />
            </div>
            <p className="t-meta max-w-[34ch] text-muted">Prix « dès » relevés en réservant 6 à 8 semaines à l&apos;avance.</p>
          </div>
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {d.access.map((a, i) => (
              <Reveal as="li" key={a.from} delay={i * 0.08} className="flex flex-col justify-between rounded-[3px] bg-paper p-6 shadow-paper md:p-8">
                <div>
                  <p className="t-label text-muted">Depuis</p>
                  <p className="mt-2 font-serif text-4xl">{a.from}</p>
                  <RouteLine stops={[a.from, d.name]} compact className="mt-6" />
                  <p className="mt-6 text-ink-2">{a.how}</p>
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-line pt-4">
                  <span className="t-meta">{a.time}</span>
                  <span className="t-num text-3xl">{a.cost}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Guide CTA */}
      {guide && (
        <section className="bg-forest text-paper" aria-labelledby="guide-cta-title">
          <div className="container-v section-y grid items-center gap-14 lg:grid-cols-12">
            <Reveal className="mx-auto w-full max-w-[22rem] lg:col-span-4">
              <GuideCover guide={guide} sizes="22rem" />
            </Reveal>
            <div className="lg:col-span-7 lg:col-start-6">
              <Eyebrow index="03" tone="light">Le guide</Eyebrow>
              <h2 id="guide-cta-title" className="t-display mt-6 text-balance">
                {d.name}, <em>déjà pensé.</em>
              </h2>
              <p className="t-lead mt-6 max-w-[48ch] text-paper/80">{guide.summary}</p>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <PriceTag value={guide.price} size="lg" />
                <ButtonLink href={`/guides/${guide.slug}`} variant="light" size="lg">
                  Voir le guide
                </ButtonLink>
              </div>
              <p className="t-meta mt-6 text-paper/60">{guide.title} · Vol. {guide.volume} · {guide.pages} pages · {guide.format}</p>
            </div>
          </div>
        </section>
      )}

      {/* Others */}
      <section className="section-y" aria-labelledby="others-title">
        <div className="container-v">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="others-title" className="t-h1">Ailleurs, même esprit.</h2>
            <ButtonLink href="/destinations" variant="ghost">Toutes les destinations</ButtonLink>
          </div>
          <div className="rail -mx-[var(--gutter)] mt-12 gap-4 px-[var(--gutter)] md:mx-0 md:grid md:grid-cols-3 md:px-0">
            {others.map((o) => (
              <DestinationCard key={o.slug} destination={o} size="sm" className="aspect-[4/5] min-h-0 w-[78vw] shrink-0 md:w-auto" sizes="(min-width: 768px) 33vw, 80vw" />
            ))}
          </div>
        </div>
      </section>

      {guide && <MobileDock href={`/guides/${guide.slug}`} label={`${guide.title} · ${price(guide.price)}`} />}
    </>
  );
}
