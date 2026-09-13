"use client";

import { animate, motion, useInView, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fade + short rise when entering the viewport. Once. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
} & Omit<HTMLMotionProps<"div">, "children">) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Staggered word-by-word title reveal (masked lines). */
export function SplitTitle({
  text,
  className,
  delay = 0,
  as = "h2",
  immediate = false,
  id,
}: {
  id?: string;
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
  immediate?: boolean;
}) {
  const lines = text.split("\n");
  const Tag = as;
  let w = 0;
  return (
    <Tag id={id} className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.08em]" aria-hidden>
          {line.split(" ").map((word, wi) => {
            const i = w++;
            return (
              <motion.span
                key={wi}
                className="inline-block will-change-transform"
                initial={{ y: "105%" }}
                {...(immediate
                  ? { animate: { y: "0%" } }
                  : { whileInView: { y: "0%" }, viewport: { once: true, margin: "0px 0px -8% 0px" } })}
                transition={{ duration: 1, ease, delay: delay + i * 0.06 }}
              >
                {word}
                {wi < line.split(" ").length - 1 && " "}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/** Counts up once when visible. Formats with fr-FR grouping. */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {(reduce ? to : value).toLocaleString("fr-FR")}
        {suffix}
      </span>
    </span>
  );
}

/** Draws an SVG path when visible. */
export function DrawPath({
  d,
  className,
  delay = 0,
  duration = 1.8,
  strokeWidth = 1.2,
  dashed,
}: {
  d: string;
  className?: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
  dashed?: boolean;
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={dashed ? "2 6" : undefined}
      className={className}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration, ease: [0.65, 0, 0.35, 1], delay }}
    />
  );
}
