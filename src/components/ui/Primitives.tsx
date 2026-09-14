import type { ReactNode } from "react";
import { cn, budget as fmtBudget, price as fmtPrice } from "@/lib/format";

/** Mono uppercase editorial label, optionally numbered: "§ 02 — Destinations" */
export function Eyebrow({
  children,
  index,
  className,
  tone = "muted",
}: {
  children: ReactNode;
  index?: string;
  className?: string;
  tone?: "muted" | "ink" | "light" | "clay";
}) {
  const color = {
    muted: "text-muted",
    ink: "text-ink",
    light: "text-paper/70",
    clay: "text-clay",
  }[tone];
  return (
    <p className={cn("t-label flex items-center gap-3", color, className)}>
      {index && (
        <>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden className="h-px w-6 bg-current opacity-50" />
        </>
      )}
      <span>{children}</span>
    </p>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  lead,
  align = "split",
  tone = "dark",
  className,
  children,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "split" | "stack";
  tone?: "dark" | "light";
  className?: string;
  children?: ReactNode;
}) {
  const light = tone === "light";
  return (
    <header
      className={cn(
        "grid gap-8",
        align === "split" && "lg:grid-cols-12 lg:items-end",
        className,
      )}
    >
      <div className={cn(align === "split" && "lg:col-span-7")}>
        <Eyebrow index={index} tone={light ? "light" : "muted"}>
          {eyebrow}
        </Eyebrow>
        <h2 className={cn("t-display mt-6 text-balance", light ? "text-paper" : "text-ink")}>{title}</h2>
      </div>
      {(lead || children) && (
        <div className={cn(align === "split" && "lg:col-span-4 lg:col-start-9", "space-y-6")}>
          {lead && (
            <p className={cn("t-lead text-pretty", light ? "text-paper/75" : "text-graphite")}>{lead}</p>
          )}
          {children}
        </div>
      )}
    </header>
  );
}

export function Badge({
  children,
  tone = "line",
  className,
}: {
  children: ReactNode;
  tone?: "line" | "ink" | "paper" | "clay" | "forest" | "glass";
  className?: string;
}) {
  const tones = {
    line: "border border-ink/15 text-graphite",
    ink: "bg-ink text-paper",
    paper: "bg-paper text-ink",
    clay: "bg-clay text-paper",
    forest: "bg-forest text-paper",
    glass: "bg-ink/35 text-paper backdrop-blur-md border border-paper/15",
  };
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-mono text-[0.68rem] tracking-[0.08em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Price of the PDF — typographic, never a sticker */
export function PriceTag({ value, className, size = "md" }: { value: number; className?: string; size?: "sm" | "md" | "lg" }) {
  const [int, dec] = fmtPrice(value).replace(/\s?€/, "").split(",");
  const s = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl md:text-7xl",
  }[size];
  return (
    <span className={cn("t-num inline-flex items-start leading-none", s, className)} aria-label={fmtPrice(value)}>
      <span aria-hidden>{int}</span>
      <span aria-hidden className="mt-[0.12em] ml-0.5 font-sans text-[0.38em] font-medium tracking-normal">
        {dec ? `,${dec} ` : ""}€
      </span>
    </span>
  );
}

/** Budget indicator: "≈ 239 €" with a 5-step gauge */
export function BudgetMeter({ value, className, light }: { value: number; className?: string; light?: boolean }) {
  const steps = value < 250 ? 1 : value < 300 ? 2 : value < 350 ? 3 : value < 450 ? 4 : 5;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="t-meta">≈ {fmtBudget(value)}</span>
      <span className="flex gap-[3px]" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 w-[3px] rounded-full",
              i < steps ? (light ? "bg-paper" : "bg-ink") : light ? "bg-paper/25" : "bg-ink/15",
            )}
          />
        ))}
      </span>
      <span className="sr-only">Niveau de budget {steps} sur 5</span>
    </span>
  );
}

export function Rule({ className }: { className?: string }) {
  return <div className={cn("rule", className)} aria-hidden />;
}
