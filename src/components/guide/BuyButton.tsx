"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useCart } from "@/components/layout/CartProvider";
import { cn, price } from "@/lib/format";
import type { Guide } from "@/data/types";

export function BuyButton({ guide, className, compact }: { guide: Guide; className?: string; compact?: boolean }) {
  const { add, has, ready } = useCart();
  const router = useRouter();
  const inCart = ready && has(guide.slug);
  return (
    <button
      type="button"
      onClick={() => {
        add(guide.slug);
        router.push("/panier");
      }}
      className={cn(
        "group inline-flex items-center justify-between gap-4 rounded-full bg-ink text-paper transition-colors duration-300 hover:bg-forest active:scale-[0.99]",
        compact ? "h-12 pr-1.5 pl-5 text-[0.95rem]" : "h-16 pr-2 pl-7 text-[1.05rem]",
        className,
      )}
    >
      <span className="font-medium">{inCart ? "Finaliser la commande" : "Acheter le guide"}</span>
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-clay transition-transform duration-500 group-hover:translate-x-0.5",
          compact ? "size-9" : "size-12",
        )}
      >
        {inCart ? <Check className="size-4" strokeWidth={2} /> : <ArrowRight className="size-4" strokeWidth={1.8} />}
      </span>
      <span className="sr-only">{price(guide.price)}</span>
    </button>
  );
}

/** Mobile sticky purchase bar, visible once the main CTA has scrolled away. */
export function StickyBuyBar({ guide, anchorId }: { guide: Guide; anchorId: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    let anchorVisible = false;
    const sync = () => setShow(!anchorVisible && window.scrollY > 240);
    const io = new IntersectionObserver(([e]) => {
      anchorVisible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", sync);
    };
  }, [anchorId]);
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-all duration-500 ease-[var(--ease-out-soft)] md:hidden",
        show ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-serif text-xl leading-none">{guide.title}</p>
          <p className="t-meta mt-1 whitespace-nowrap text-muted">{price(guide.price)} · PDF</p>
        </div>
        <BuyButton guide={guide} compact className="shrink-0" />
      </div>
    </div>
  );
}
