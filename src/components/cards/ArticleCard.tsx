import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/data/types";
import { photo } from "@/data/photos";
import { cn, shortDate } from "@/lib/format";

export function ArticleMeta({ article, light }: { article: Article; light?: boolean }) {
  return (
    <p className={cn("t-meta flex flex-wrap items-center gap-x-3 gap-y-1", light ? "text-paper/75" : "text-muted")}>
      <span className={cn("t-label", light ? "text-paper" : "text-clay")}>{article.category}</span>
      <span aria-hidden>·</span>
      <span>{article.readTime} min de lecture</span>
      <span aria-hidden>·</span>
      <time dateTime={article.date}>{shortDate(article.date)}</time>
    </p>
  );
}

export function ArticleCard({
  article,
  variant = "stack",
  className,
  index,
}: {
  article: Article;
  variant?: "stack" | "row" | "text";
  className?: string;
  index?: number;
}) {
  const img = photo(article.image);

  if (variant === "text") {
    return (
      <Link href={`/journal/${article.slug}`} className={cn("group grid grid-cols-[auto_1fr] gap-5 border-t border-line py-6", className)}>
        <span className="t-num text-3xl text-muted">{String((index ?? 0) + 1).padStart(2, "0")}</span>
        <div>
          <ArticleMeta article={article} />
          <h3 className="t-h3 mt-3 text-balance">
            <span className="link-u">{article.title}</span>
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/journal/${article.slug}`}
      className={cn(
        "group grid gap-5",
        variant === "row" && "sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-center sm:gap-8",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-paper-2">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="photo object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
      </div>
      <div>
        <ArticleMeta article={article} />
        <h3 className="t-h3 mt-3 text-balance">
          <span className="link-u">{article.title}</span>
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-graphite text-pretty">{article.excerpt}</p>
      </div>
    </Link>
  );
}
