import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, RefreshCw, Smartphone, ChevronDown } from "lucide-react";
import { getGuide, guides } from "@/data/guides";
import { getDestination } from "@/data/destinations";
import { photo } from "@/data/photos";
import { site } from "@/data/site";
import { GuideCover } from "@/components/guide/GuideCover";
import { PageSlider } from "@/components/guide/PageSlider";
import { BudgetBreakdown } from "@/components/guide/BudgetBreakdown";
import { BuyButton, StickyBuyBar } from "@/components/guide/BuyButton";
import { GuideCard } from "@/components/cards/GuideCard";
import { Breadcrumb } from "@/components/layout/PageHero";
import { Eyebrow, PriceTag } from "@/components/ui/Primitives";
import { RouteLine } from "@/components/ui/Brand";
import { Reveal, SplitTitle } from "@/components/ui/Motion";
import { JsonLd } from "@/components/ui/JsonLd";
import { ModeIcon, modeLabels } from "@/components/icons";
import { budget, price } from "@/lib/format";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  const title = `${g.title} — ${g.subtitle}`;
  const description = `${g.summary.split(". ")[0]}. Guide PDF de ${g.pages} pages, budget ≈ ${g.budget} €, ${price(g.price)}.`;
  return {
    title,
    description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { title, description, images: [{ url: `${site.url}${photo(g.cover).src}` }] },
  };
}

const faq = [
  {
    q: "Comment je reçois le guide ?",
    a: "Immédiatement après le paiement : un lien de téléchargement s'affiche et arrive par email. Le PDF est à vous, sans compte ni application.",
  },
  {
    q: "Il se lit bien sur téléphone ?",
    a: "Oui. La mise en page est pensée pour un écran vertical, et chaque carte existe en version imprimable. Tout fonctionne hors ligne.",
  },
  {
    q: "Et si les prix ou les horaires changent ?",
    a: "Les guides sont revus chaque saison. Vous recevez gratuitement chaque nouvelle version par email.",
  },
  {
    q: "Je peux partir à d'autres dates ?",
    a: "Le guide indique les écarts de budget selon la saison et les jours à éviter (fêtes, affluence, horaires réduits).",
  },
];

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const dest = getDestination(g.destinationSlug);
  const related = guides.filter((x) => x.slug !== g.slug).slice(0, 3);

  const received = [
    { value: String(g.pages), label: "pages", note: "Mise en page lisible sur téléphone" },
    { value: "1", label: "itinéraire complet", note: `${g.days} jours, heure par heure` },
    { value: String(g.maps), label: "cartes", note: "Itinéraire, sentiers, arrêts" },
    { value: "€", label: "budget détaillé", note: "Chaque poste, chaque jour" },
    { value: "✓", label: "checklist départ", note: "De J-60 à J-1" },
    { value: String(g.addressesCount), label: "adresses sélectionnées", note: "Dormir, manger, voir" },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `Guide ${g.title} — ${g.subtitle}`,
          description: g.summary,
          image: `${site.url}${photo(g.cover).src}`,
          brand: { "@type": "Brand", name: site.name },
          sku: `VEY-${g.number}`,
          offers: {
            "@type": "Offer",
            price: g.price.toFixed(2),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: `${site.url}/guides/${g.slug}`,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Guides", item: `${site.url}/guides` },
            { "@type": "ListItem", position: 2, name: g.title, item: `${site.url}/guides/${g.slug}` },
          ],
        }}
      />

      {/* ── Product hero ─────────────────────────────────────── */}
      <section className="container-v pt-[calc(var(--nav-h)+2rem)] pb-20 md:pt-[calc(var(--nav-h)+3rem)] md:pb-28">
        <Breadcrumb items={[{ href: "/guides", label: "Guides" }, { label: g.title }]} />

        <div className="mt-8 grid gap-12 md:mt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              <Reveal y={30} className="group relative mx-auto max-w-[19rem] [perspective:1600px] sm:max-w-[26rem] lg:max-w-[34rem]">
                <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-4 rotate-[3deg] rounded-[3px] bg-paper-3 md:translate-x-5" />
                <div className="relative transition-transform duration-1000 ease-[var(--ease-out-soft)] group-hover:[transform:rotateY(-8deg)_translateY(-6px)]">
                  <GuideCover guide={g} priority sizes="(min-width: 1024px) 34rem, 90vw" />
                </div>
              </Reveal>
              <p className="t-meta mx-auto mt-8 flex max-w-[19rem] items-center justify-between gap-4 text-muted sm:max-w-[26rem] lg:max-w-[34rem]">
                <span>Guide N° {g.number} · PDF · {g.pages} pages</span>
                <a href="#apercu" className="link-u-static text-ink">Feuilleter</a>
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Eyebrow index={`N° ${g.number}`}>{dest?.region ?? "Guide"}</Eyebrow>
            <h1 className="mt-6 font-serif text-[clamp(3.4rem,8vw,7.2rem)] leading-[0.86] tracking-[-0.035em] uppercase">{g.title}</h1>
            <p className="t-h2 mt-4 italic text-ink-2">{g.subtitle}</p>

            <ul className="t-label mt-8 flex flex-wrap gap-2 text-ink">
              {[`${g.days} jours`, g.noCar ? "Sans voiture" : g.transport, ...g.types].map((t) => (
                <li key={t} className="rounded-full border border-ink/20 px-3 py-1.5">{t}</li>
              ))}
            </ul>

            <p className="t-lead mt-8 max-w-[52ch] text-graphite text-pretty">{g.summary}</p>

            <RouteLine stops={g.route} className="mt-10" />

            <dl className="mt-10 grid grid-cols-2 border-t border-ink sm:grid-cols-3">
              {[
                ["Budget total", `≈ ${budget(g.budget)}`],
                ["Durée", `${g.days} jours`],
                ["Transport", g.transport],
                ["Logistique", g.logistics],
                ["Saison", g.season],
                ["Contenu", `${g.pages} p. · ${g.maps} cartes`],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-line py-4 pr-4">
                  <dt className="t-label text-muted">{k}</dt>
                  <dd className="mt-2 text-[1.02rem]">{v}</dd>
                </div>
              ))}
            </dl>

            <div id="achat" className="mt-10 rounded-[4px] bg-paper-2 p-6 md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="t-label text-muted">Prix du guide</p>
                  <PriceTag value={g.price} size="lg" className="mt-2" />
                </div>
                <p className="t-meta max-w-[22ch] text-right text-muted">
                  ≈ {((g.price / g.budget) * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} % du budget du voyage
                </p>
              </div>
              <BuyButton guide={g} className="mt-6 w-full" />
              <ul className="mt-6 grid gap-3 text-[0.92rem] text-graphite sm:grid-cols-3">
                <li className="flex items-center gap-2"><Download className="size-4 text-forest" strokeWidth={1.5} /> PDF instantanément disponible</li>
                <li className="flex items-center gap-2"><RefreshCw className="size-4 text-forest" strokeWidth={1.5} /> Mises à jour offertes</li>
                <li className="flex items-center gap-2"><Smartphone className="size-4 text-forest" strokeWidth={1.5} /> Lisible hors ligne</li>
              </ul>
            </div>
            <p className="t-meta mt-4 text-muted">{g.updated} · {g.gateway}</p>
          </div>
        </div>
      </section>

      {/* ── What you receive ─────────────────────────────────── */}
      <section className="border-y border-ink/10 bg-paper-2/60" aria-labelledby="recevoir-title">
        <div className="container-v section-y">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="01">Preuve de valeur</Eyebrow>
              <SplitTitle id="recevoir-title" as="h2" text="Vous allez recevoir" className="t-h1 mt-6" />
            </div>
            <p className="max-w-[36ch] text-graphite">
              Tout ce qu&apos;il faut pour partir, dans un seul fichier. Rien à recouper sur dix onglets.
            </p>
          </div>
          <ul className="mt-14 grid grid-cols-2 border-t border-ink md:grid-cols-3">
            {received.map((r, i) => (
              <Reveal
                as="li"
                key={r.label}
                delay={i * 0.06}
                className="border-b border-line py-8 pr-4 md:py-10 max-md:[&:nth-child(2n)]:pl-4 md:[&:not(:nth-child(3n+1))]:border-l md:[&:not(:nth-child(3n+1))]:pl-8"
              >
                <span className="t-num block text-[clamp(3.5rem,7vw,6rem)]">{r.value}</span>
                <span className="mt-3 block font-serif text-2xl italic">{r.label}</span>
                <span className="t-meta mt-2 block text-muted">{r.note}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Preview ──────────────────────────────────────────── */}
      <section id="apercu" className="section-y overflow-hidden" aria-labelledby="apercu-title">
        <div className="container-v">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="02">Aperçu</Eyebrow>
              <SplitTitle id="apercu-title" as="h2" text="Feuilletez avant d'acheter." className="t-h1 mt-6" />
            </div>
            <p className="t-meta text-muted">6 pages extraites sur {g.pages}</p>
          </div>
          <PageSlider guide={g} />
        </div>
      </section>

      {/* ── Budget ───────────────────────────────────────────── */}
      <section className="bg-paper-2 section-y" aria-labelledby="budget-title">
        <div className="container-v">
          <Eyebrow index="03">Budget</Eyebrow>
          <SplitTitle id="budget-title" as="h2" text={"Vous savez combien\nça va coûter."} className="t-h1 mt-6 mb-14" />
          <BudgetBreakdown guide={g} />
        </div>
      </section>

      {/* ── Itinerary teaser ─────────────────────────────────── */}
      <section className="section-y" aria-labelledby="itin-title">
        <div className="container-v grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="04">Itinéraire</Eyebrow>
            <h2 id="itin-title" className="t-h1 mt-6">Un extrait, jour par jour.</h2>
            <p className="mt-6 text-graphite">
              Le guide détaille chaque journée : trajets et horaires, dépenses, temps forts et alternative en cas de pluie.
            </p>
            {dest && (
              <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-[3px] lg:block">
                <Image src={photo(dest.secondaryImage).src} alt={photo(dest.secondaryImage).alt} fill sizes="30vw" className="photo object-cover" />
              </div>
            )}
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {g.itinerary.map((d) => (
              <li key={d.day} className="border-t border-ink py-8">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="t-label text-clay">Jour {String(d.day).padStart(2, "0")}</p>
                  <p className="t-meta text-muted">≈ {d.spend} € la journée</p>
                </div>
                <h3 className="t-h2 mt-3">{d.title}</h3>
                <p className="t-meta mt-1 text-muted">{d.route}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {d.moves.map((m) => (
                    <li key={m.label} className="flex items-center gap-3 rounded-[3px] bg-paper-2 px-4 py-3">
                      <ModeIcon mode={m.mode} className="size-4 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.95rem]">{m.label}</span>
                        <span className="t-meta text-muted">{modeLabels[m.mode]} · {m.duration}</span>
                      </span>
                      <span className="t-meta whitespace-nowrap">{m.cost}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 space-y-2">
                  {d.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-ink-2">
                      <span className="mt-2.5 block h-px w-4 shrink-0 bg-clay" aria-hidden /> {h}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="border-t border-ink pt-8">
              <p className="text-graphite">
                + le reste de l&apos;itinéraire, {g.addressesCount} adresses et {g.maps} cartes dans le guide complet.
              </p>
              <a href="#achat" className="link-u-static mt-3 inline-block font-medium">
                Obtenir le guide · {price(g.price)}
              </a>
            </li>
          </ol>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="border-t border-line section-y" aria-labelledby="faq-title">
        <div className="container-v grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="05">Questions</Eyebrow>
            <h2 id="faq-title" className="t-h1 mt-6">Avant d&apos;acheter.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {faq.map((f) => (
              <details key={f.q} className="group border-b border-line py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.15rem]">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 transition-transform duration-500 group-open:rotate-180" strokeWidth={1.4} />
                </summary>
                <p className="mt-4 max-w-[60ch] text-graphite">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related ──────────────────────────────────────────── */}
      <section className="bg-paper-2/60 section-y" aria-labelledby="related-title">
        <div className="container-v">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="related-title" className="t-h1">D&apos;autres voyages déjà pensés.</h2>
            <Link href="/guides" className="link-u-static">Toute la collection</Link>
          </div>
          <div className="rail -mx-[var(--gutter)] mt-14 gap-6 px-[var(--gutter)] md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:px-0">
            {related.map((r) => (
              <div key={r.slug} className="w-[68vw] max-w-[20rem] shrink-0 md:w-auto md:max-w-none">
                <GuideCard guide={r} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <StickyBuyBar guide={g} anchorId="achat" />
    </>
  );
}
