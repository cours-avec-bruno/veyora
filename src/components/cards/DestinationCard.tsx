import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Destination } from "@/data/types";
import { photo } from "@/data/photos";
import { ModeRow } from "@/components/icons";
import { budget, cn } from "@/lib/format";

/**
 * Photo-led destination tile. The parent decides the shape (aspect / row span);
 * the card fills it. `size` only adjusts typography.
 */
export function DestinationCard({
  destination: d,
  index,
  size = "md",
  className,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority,
}: {
  destination: Destination;
  index?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const img = photo(d.image);
  return (
    <Link
      href={`/destinations/${d.slug}`}
      className={cn(
        "group relative isolate flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[3px] bg-forest text-paper",
        className,
      )}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="photo -z-10 object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/15 to-black/40 transition-opacity duration-700 group-hover:opacity-90" />

      <div className="flex items-start justify-between p-5 md:p-6">
        <span className="t-label text-paper/80">
          {index !== undefined && <span className="mr-3 tabular-nums">{String(index + 1).padStart(2, "0")}</span>}
          {d.region}
        </span>
        <span className="t-meta hidden text-[0.68rem] text-paper/70 sm:inline">{d.coords}</span>
      </div>

      <div className="p-5 md:p-6">
        <p className="t-meta text-paper/80">{d.city}</p>
        <h3
          className={cn(
            "mt-2 font-serif leading-[0.9] tracking-[-0.025em] uppercase",
            size === "lg" ? "text-[clamp(2.8rem,6vw,5.6rem)]" : size === "md" ? "text-[clamp(2.2rem,3.6vw,3.4rem)]" : "text-[clamp(2rem,2.8vw,2.6rem)]",
          )}
        >
          {d.name}
        </h3>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-paper/25 pt-4">
          <span className="t-meta">
            {d.days} jours · ≈ {budget(d.budget)}
          </span>
          <span className="inline-flex items-center gap-2 text-paper/80">
            <ModeRow modes={d.modes} />
            <span className="t-meta">{d.types[0] === "City trip" ? "Villes" : d.types[0]}</span>
          </span>
          <span className="ml-auto inline-flex size-9 items-center justify-center rounded-full border border-paper/35 transition-colors duration-500 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
            <ArrowUpRight className="size-4" strokeWidth={1.6} />
          </span>
        </div>
      </div>
    </Link>
  );
}
