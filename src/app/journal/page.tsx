import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/data/articles";
import { photo } from "@/data/photos";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleCard, ArticleMeta } from "@/components/cards/ArticleCard";
import { Reveal } from "@/components/ui/Motion";
import { Newsletter } from "@/sections/home/Newsletter";

export const metadata: Metadata = {
  title: "Journal",
  description: "Le magazine Veyora : budgets réels, transports, destinations accessibles en train et méthodes pour voyager moins cher.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const [lead, second, third, ...rest] = articles;
  const leadImg = photo(lead.image);
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <>
      <PageHero
        index="—"
        eyebrow="Journal · N° 14 · Septembre 2026"
        title={"Le journal\ndes voyages sobres."}
        crumbs={[{ href: "/", label: "Accueil" }, { label: "Journal" }]}
        lead="Des budgets réels, des trajets comparés, des destinations choisies. Ce qu'on apprend en construisant nos guides."
        aside={
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c} className="t-label rounded-full border border-ink/20 px-3 py-1.5">{c}</li>
            ))}
          </ul>
        }
      />

      {/* Cover story */}
      <section className="container-v">
        <Link href={`/journal/${lead.slug}`} className="group grid gap-8 border-t border-ink pt-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[3px] lg:col-span-8 lg:aspect-[16/10]">
            <Image src={leadImg.src} alt={leadImg.alt} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="photo object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" />
            <span className="t-label absolute top-4 left-4 rounded-full bg-paper px-3 py-1.5 text-ink">À la une</span>
          </Reveal>
          <div className="flex flex-col justify-between gap-8 lg:col-span-4">
            <div>
              <ArticleMeta article={lead} />
              <h2 className="t-h1 mt-5 text-balance">
                <span className="link-u">{lead.title}</span>
              </h2>
              <p className="t-lead mt-5 text-graphite text-pretty">{lead.excerpt}</p>
            </div>
            <p className="t-meta text-muted">Par {lead.author}</p>
          </div>
        </Link>
      </section>

      {/* Secondary */}
      <section className="container-v mt-20 md:mt-28">
        <div className="grid gap-14 border-t border-ink pt-10 md:grid-cols-2 lg:gap-12">
          <Reveal>
            <ArticleCard article={second} />
          </Reveal>
          <Reveal delay={0.1}>
            <ArticleCard article={third} />
          </Reveal>
        </div>
      </section>

      {/* Rest */}
      <section className="container-v section-y">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-7">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.05}>
                <ArticleCard article={a} variant="row" />
              </Reveal>
            ))}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <p className="t-label text-muted">Les plus lus</p>
              <div className="mt-4">
                {[...articles].reverse().slice(0, 4).map((a, i) => (
                  <ArticleCard key={a.slug} article={a} variant="text" index={i} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="border-t border-line">
        <Newsletter index="—" />
      </div>
    </>
  );
}
