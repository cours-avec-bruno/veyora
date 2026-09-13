import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/data/articles";
import { getGuide } from "@/data/guides";
import { photo } from "@/data/photos";
import { site } from "@/data/site";
import { Breadcrumb } from "@/components/layout/PageHero";
import { ArticleCard, ArticleMeta } from "@/components/cards/ArticleCard";
import { GuideCard } from "@/components/cards/GuideCard";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Motion";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.excerpt, publishedTime: a.date, images: [{ url: `${site.url}${photo(a.image).src}` }] },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const img = photo(a.image);
  const guide = a.relatedGuide ? getGuide(a.relatedGuide) : undefined;
  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          datePublished: a.date,
          image: `${site.url}${img.src}`,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        }}
      />

      <article>
        <header className="container-v pt-[calc(var(--nav-h)+2.5rem)] md:pt-[calc(var(--nav-h)+4rem)]">
          <Breadcrumb items={[{ href: "/journal", label: "Journal" }, { label: a.category }]} />
          <div className="mx-auto mt-12 max-w-4xl text-center">
            <div className="flex justify-center">
              <ArticleMeta article={a} />
            </div>
            <h1 className="t-display mt-8 text-balance">{a.title}</h1>
            <p className="t-lead mx-auto mt-8 max-w-[52ch] text-graphite text-pretty">{a.excerpt}</p>
            <p className="t-meta mt-6 text-muted">Par {a.author}</p>
          </div>
        </header>

        <Reveal className="container-v mt-14 md:mt-20">
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] md:aspect-[21/9]">
              <Image src={img.src} alt={img.alt} fill priority sizes="100vw" className="photo object-cover" />
            </div>
            <figcaption className="t-meta mt-3 text-muted">Photo : {img.author} / Unsplash</figcaption>
          </figure>
        </Reveal>

        <div className="container-v section-y grid gap-14 lg:grid-cols-12">
          <div className="mx-auto w-full max-w-[42rem] lg:col-span-7 lg:col-start-3 lg:mx-0">
            {a.body.map((b, i) => {
              switch (b.type) {
                case "p":
                  return (
                    <p key={i} className={`mt-6 text-[1.14rem] leading-[1.75] text-ink-2 text-pretty ${i === 0 ? "first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-serif first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-ink" : ""}`}>
                      {b.text}
                    </p>
                  );
                case "h2":
                  return <h2 key={i} className="t-h2 mt-14">{b.text}</h2>;
                case "quote":
                  return (
                    <blockquote key={i} className="my-14 border-l-2 border-clay pl-6 font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.15] italic text-balance">
                      « {b.text} »
                    </blockquote>
                  );
                case "list":
                  return (
                    <ul key={i} className="mt-6 space-y-3">
                      {b.items.map((it) => (
                        <li key={it} className="flex gap-4 text-[1.08rem] leading-relaxed text-ink-2">
                          <span className="mt-3 block h-px w-5 shrink-0 bg-ink" aria-hidden />
                          {it}
                        </li>
                      ))}
                    </ul>
                  );
                case "figures":
                  return (
                    <dl key={i} className="my-12 grid grid-cols-1 gap-6 border-y border-ink py-8 sm:grid-cols-3">
                      {b.items.map((f) => (
                        <div key={f.label}>
                          <dt className="t-num text-5xl">{f.value}</dt>
                          <dd className="t-meta mt-2 text-muted">{f.label}</dd>
                        </div>
                      ))}
                    </dl>
                  );
              }
            })}
          </div>

          {guide && (
            <aside className="lg:col-span-3 lg:col-start-10">
              <div className="lg:sticky lg:top-28">
                <p className="t-label text-muted">Le guide lié</p>
                <div className="mt-5 max-w-[18rem]">
                  <GuideCard guide={guide} />
                </div>
              </div>
            </aside>
          )}
        </div>
      </article>

      <section className="border-t border-line bg-paper-2/60 section-y" aria-labelledby="more-title">
        <div className="container-v">
          <h2 id="more-title" className="t-h1">À lire ensuite.</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {more.map((m) => (
              <ArticleCard key={m.slug} article={m} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
