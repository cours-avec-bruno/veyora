"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Guide } from "@/data/types";
import { PageAddresses, PageBudget, PageChecklist, PageCover, PageDay, PageMap } from "./GuidePages";
import { cn } from "@/lib/format";

const pages = [
  { label: "Couverture", note: "Le guide imprimable ou sur téléphone", C: PageCover },
  { label: "Jour par jour", note: "Trajets, horaires, coûts et temps forts", C: PageDay },
  { label: "Cartes", note: "Itinéraire, arrêts de bus, spots nature", C: PageMap },
  { label: "Budget", note: "Chaque euro, poste par poste", C: PageBudget },
  { label: "Adresses", note: "Dormir, manger, voir — testé", C: PageAddresses },
  { label: "Checklist", note: "Tout ce qu'il faut régler avant le départ", C: PageChecklist },
];

/** Native scroll-snap slider: swipe on touch, arrows + keyboard on desktop. */
export function PageSlider({ guide }: { guide: Guide }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = useCallback((i: number) => {
    const el = rail.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(pages.length - 1, i));
    const child = el.children[clamped] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setActive(Array.from(el.children).indexOf(e.target));
          }
        });
      },
      { root: el, threshold: [0.6] },
    );
    Array.from(el.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label="Aperçu des pages du guide"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      <div
        ref={rail}
        tabIndex={0}
        className="rail -mx-[var(--gutter)] gap-5 px-[var(--gutter)] pt-2 pb-6 md:gap-8 focus-visible:outline-none"
      >
        {pages.map(({ label, note, C }, i) => (
          <figure
            key={label}
            className="w-[74vw] max-w-[22rem] shrink-0 transition-opacity duration-500 md:w-[30vw]"
            aria-label={`Page ${i + 1} sur ${pages.length} : ${label}`}
          >
            <C guide={guide} />
            <figcaption className="mt-5 flex gap-3">
              <span className="t-num text-2xl text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-medium">{label}</span>
                <span className="block text-sm text-graphite">{note}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-6">
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {pages.map((_, i) => (
            <button
              key={i}
              tabIndex={-1}
              onClick={() => go(i)}
              className={cn(
                "h-[3px] flex-1 rounded-full transition-colors duration-500",
                i === active ? "bg-ink" : "bg-ink/15 hover:bg-ink/40",
              )}
            />
          ))}
        </div>
        <p className="t-meta w-14 text-center text-muted" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => go(active - 1)}
            disabled={active === 0}
            className="inline-flex size-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
            aria-label="Page précédente"
          >
            <ArrowLeft className="size-4" strokeWidth={1.6} />
          </button>
          <button
            onClick={() => go(active + 1)}
            disabled={active === pages.length - 1}
            className="inline-flex size-12 items-center justify-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
            aria-label="Page suivante"
          >
            <ArrowRight className="size-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}
