import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Guide } from "@/data/types";
import { GuideCover } from "@/components/guide/GuideCover";
import { ModeRow } from "@/components/icons";
import { PriceTag } from "@/components/ui/Primitives";
import { budget, cn } from "@/lib/format";

export function GuideCard({
  guide,
  className,
  priority,
  tilt = 0,
}: {
  guide: Guide;
  className?: string;
  priority?: boolean;
  /** Resting rotation in degrees, for "books on a table" layouts */
  tilt?: number;
}) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={cn("group block focus-visible:outline-offset-8", className)}
      aria-label={`${guide.title} — ${guide.subtitle}, ${guide.price.toFixed(2).replace(".", ",")} €`}
    >
      <div className="relative [perspective:1400px]">
        <div
          className="relative transition-[transform,filter] duration-700 ease-[var(--ease-out-soft)] will-change-transform group-hover:[transform:translateY(-10px)_rotateY(-7deg)_rotateZ(-0.6deg)]"
          style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
        >
          <GuideCover guide={guide} priority={priority} className="transition-shadow duration-700 group-hover:shadow-lift" />

          {/* Hover sheet */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 rounded-[3px] bg-paper/95 p-4 text-ink opacity-0 shadow-paper backdrop-blur-sm transition-all duration-500 ease-[var(--ease-out-soft)] group-hover:translate-y-0 group-hover:opacity-100 md:block">
            <p className="t-label text-muted">Dans le PDF</p>
            <p className="mt-2 text-sm leading-snug">
              {guide.pages} pages · {guide.maps} cartes · {guide.addressesCount} adresses · budget jour par jour
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium">
              Voir le guide <ArrowRight className="size-4" strokeWidth={1.6} />
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-3">
        <div className="min-w-0">
          <p className="t-label text-muted">
            N° {guide.number} · {guide.days} jours
          </p>
          <h3 className="t-h3 mt-2">
            <span className="link-u">{guide.title}</span>
          </h3>
          <p className="mt-1 text-[0.95rem] text-graphite">{guide.subtitle}</p>
        </div>
        <PriceTag value={guide.price} size="sm" className="pt-5" />
        <dl className="col-span-2 grid grid-cols-3 gap-3 border-t border-line pt-3 text-graphite">
          <div>
            <dt className="t-label text-[0.62rem] text-muted">Budget</dt>
            <dd className="t-meta mt-1 text-ink">≈ {budget(guide.budget)}</dd>
          </div>
          <div>
            <dt className="t-label text-[0.62rem] text-muted">Transport</dt>
            <dd className="mt-1.5 text-ink"><ModeRow modes={guide.modes} /></dd>
          </div>
          <div>
            <dt className="t-label text-[0.62rem] text-muted">Logistique</dt>
            <dd className="t-meta mt-1 text-ink">{guide.logistics}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
