import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/format";

type Variant = "solid" | "clay" | "ghost" | "light" | "outline-light" | "text";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 whitespace-nowrap font-sans font-medium tracking-[-0.005em] transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-forest rounded-full",
  clay: "bg-clay text-paper hover:bg-clay-2 rounded-full",
  ghost: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper rounded-full",
  light: "bg-paper text-ink hover:bg-white rounded-full",
  "outline-light": "border border-paper/40 text-paper hover:border-paper hover:bg-paper/10 rounded-full backdrop-blur-[2px]",
  text: "text-ink px-0! h-auto!",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: "arrow" | "arrow-up" | "none";
  children: ReactNode;
  className?: string;
};

function Icon({ kind }: { kind: Common["icon"] }) {
  if (kind === "none") return null;
  const I = kind === "arrow-up" ? ArrowUpRight : ArrowRight;
  return (
    <span className="relative -mr-1 inline-flex size-5 overflow-hidden" aria-hidden>
      <I className="size-[1.1rem] translate-x-0 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-5" strokeWidth={1.6} />
      <I className="absolute size-[1.1rem] -translate-x-5 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-0" strokeWidth={1.6} />
    </span>
  );
}

export function ButtonLink({
  href,
  variant = "solid",
  size = "md",
  icon = "arrow",
  children,
  className,
  ...rest
}: Common & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <span>{children}</span>
      <Icon kind={icon} />
    </Link>
  );
}

export function Button({
  variant = "solid",
  size = "md",
  icon = "none",
  children,
  className,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <span>{children}</span>
      <Icon kind={icon} />
    </button>
  );
}
