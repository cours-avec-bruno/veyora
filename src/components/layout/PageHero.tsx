import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Primitives";
import { SplitTitle } from "@/components/ui/Motion";
import { cn } from "@/lib/format";

export type Crumb = { href?: string; label: string };

export function Breadcrumb({ items, light }: { items: Crumb[]; light?: boolean }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className={cn("t-meta flex flex-wrap items-center gap-1.5", light ? "text-paper/70" : "text-muted")}>
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3 opacity-60" strokeWidth={1.5} aria-hidden />}
            {c.href ? (
              <Link href={c.href} className={cn("link-u", light ? "hover:text-paper" : "hover:text-ink")}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={light ? "text-paper" : "text-ink"}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Editorial page header for inner pages (paper background). */
export function PageHero({
  eyebrow,
  index,
  title,
  lead,
  crumbs,
  aside,
  className,
}: {
  eyebrow: string;
  index?: string;
  title: string;
  lead?: ReactNode;
  crumbs?: Crumb[];
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-v pt-[calc(var(--nav-h)+3rem)] pb-12 md:pt-[calc(var(--nav-h)+5rem)] md:pb-20", className)}>
      {crumbs && <Breadcrumb items={crumbs} />}
      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          <SplitTitle as="h1" immediate text={title} className="t-display mt-6 text-balance" />
        </div>
        {(lead || aside) && (
          <div className="space-y-6 lg:col-span-4">
            {lead && <p className="t-lead text-graphite text-pretty">{lead}</p>}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
