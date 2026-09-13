"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotionSafe } from "@/components/ui/Motion";
import { useRef } from "react";
import type { Guide } from "@/data/types";
import { PageAddresses, PageBudget, PageChecklist, PageCover, PageDay, PageMap } from "./GuidePages";

/**
 * "À quoi ressemble un guide ?" — six pages laid on a table.
 * Desktop: they fan out as the section scrolls through (no hijacking, just
 * transforms bound to progress). Mobile: a swipeable rail with captions.
 */
export function GuideSpread({ guide }: { guide: Guide }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const p = scrollYProgress;
  const still = !!reduce;

  return (
    <>
      {/* Desktop composition */}
      <div ref={ref} className="relative mx-auto hidden aspect-[2.75/1] max-w-[80rem] lg:block" aria-hidden>
        <Fan p={p} still={still} className="left-[0%] top-[16%] w-[17%] z-10" from={{ x: 300, r: 0 }} to={{ x: 0, r: -6 }}>
          <PageCover guide={guide} />
        </Fan>
        <Fan p={p} still={still} className="left-[16%] top-[3%] w-[17%] z-20" from={{ x: 180, r: 0 }} to={{ x: 0, r: -2 }}>
          <PageChecklist guide={guide} />
        </Fan>
        {/* Open book: day + map */}
        <Fan p={p} still={still} className="left-[30%] top-[6%] w-[40%] z-30" from={{ x: 0, r: 0, y: 60 }} to={{ x: 0, r: 0, y: 0 }}>
          <div className="grid grid-cols-2 gap-0 shadow-lift">
            <PageDay guide={guide} className="rounded-r-none shadow-none" />
            <PageMap guide={guide} className="rounded-l-none shadow-none" />
          </div>
          <span className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </Fan>
        <Fan p={p} still={still} className="right-[16%] top-[2%] w-[17%] z-20" from={{ x: -180, r: 0 }} to={{ x: 0, r: 2.5 }}>
          <PageBudget guide={guide} />
        </Fan>
        <Fan p={p} still={still} className="right-[0%] top-[15%] w-[17%] z-10" from={{ x: -300, r: 0 }} to={{ x: 0, r: 6 }}>
          <PageAddresses guide={guide} />
        </Fan>
      </div>

      {/* Mobile / tablet rail */}
      <div className="rail -mx-[var(--gutter)] gap-4 px-[var(--gutter)] pb-4 lg:hidden">
        {[
          ["Couverture", <PageCover key="c" guide={guide} />],
          ["Jour par jour", <PageDay key="d" guide={guide} />],
          ["Cartes", <PageMap key="m" guide={guide} />],
          ["Budget", <PageBudget key="b" guide={guide} />],
          ["Adresses", <PageAddresses key="a" guide={guide} />],
          ["Checklist", <PageChecklist key="k" guide={guide} />],
        ].map(([label, node], i) => (
          <figure key={i} className="w-[72vw] max-w-[20rem] shrink-0">
            {node}
            <figcaption className="t-label mt-4 text-muted">
              <span className="mr-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

function Fan({
  p,
  still,
  from,
  to,
  className,
  children,
}: {
  p: MotionValue<number>;
  still: boolean;
  from: { x: number; r: number; y?: number };
  to: { x: number; r: number; y?: number };
  className: string;
  children: React.ReactNode;
}) {
  const a = still ? to : from;
  const x = useTransform(p, [0, 1], [a.x, to.x]);
  const y = useTransform(p, [0, 1], [a.y ?? 0, to.y ?? 0]);
  const rotate = useTransform(p, [0, 1], [a.r, to.r]);
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y, rotate }}>
      {children}
    </motion.div>
  );
}
