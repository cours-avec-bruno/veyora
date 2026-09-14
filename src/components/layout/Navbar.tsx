"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { mainNav } from "@/data/site";
import { socialHandles } from "@/data/social";
import { featuredGuide } from "@/data/guides";
import { Wordmark } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { useCart } from "./CartProvider";
import { cn, price } from "@/lib/format";

/** Routes whose first screen is a full-bleed photograph. */
const overImage = (path: string) =>
  path === "/" || path === "/a-propos" || /^\/destinations\/[^/]+$/.test(path);

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const burger = burgerRef.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      burger?.focus();
    };
  }, [open]);

  const transparent = overImage(pathname) && !scrolled && !open;

  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-[70] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Aller au contenu
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-soft)]",
          transparent
            ? "border-b border-transparent text-paper"
            : "border-b border-ink/10 bg-paper/85 text-ink backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        {transparent && (
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/35 to-transparent" />
        )}
        <nav className="container-v flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Navigation principale">
          <Link href="/" className="shrink-0 text-[0.95rem]" aria-label="Veyora — accueil">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {mainNav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn("link-u text-[0.92rem]", active && "bg-[length:100%_1px]")}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className={cn("t-label hidden xl:inline", transparent ? "text-paper/75" : "text-muted")}>
              Guides indépendants · 100 % numériques
            </span>
            <Link
              href="/panier"
              className="relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-current/10"
              aria-label={`Panier${count ? `, ${count} guide${count > 1 ? "s" : ""}` : ", vide"}`}
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-clay font-mono text-[0.6rem] text-paper">
                  {count}
                </span>
              )}
            </Link>
            <span className="hidden sm:block">
              <ButtonLink href="/guides" size="sm" variant={transparent ? "light" : "solid"}>
                Explorer les guides
              </ButtonLink>
            </span>
            <button
              ref={burgerRef}
              onClick={() => setOpen((o) => !o)}
              className="relative -mr-2 inline-flex size-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <span className="relative block h-3 w-6" aria-hidden>
                <span className={cn("absolute left-0 h-px w-6 bg-current transition-all duration-500", open ? "top-1.5 rotate-45" : "top-0")} />
                <span className={cn("absolute left-0 h-px bg-current transition-all duration-500", open ? "top-1.5 w-6 -rotate-45" : "top-3 w-4")} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper pt-[var(--nav-h)] text-ink lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="container-v flex flex-1 flex-col justify-between gap-10 py-8">
              <ul className="border-t border-line">
                {[{ href: "/", label: "Accueil" }, ...mainNav, { href: "/a-propos", label: "Manifeste" }].map((item, i) => (
                  <motion.li
                    key={item.href}
                    className="border-b border-line"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={item.href} className="flex items-baseline justify-between py-4">
                      <span className="font-serif text-[2.6rem] leading-none tracking-[-0.02em]">{item.label}</span>
                      <span className="t-meta text-muted">{String(i).padStart(2, "0")}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <Link href={`/guides/${featuredGuide.slug}`} className="flex items-center justify-between rounded-[3px] bg-forest p-4 text-paper">
                  <span>
                    <span className="t-label block text-paper/70">Guide du moment</span>
                    <span className="mt-1 block font-serif text-2xl">{featuredGuide.title}</span>
                  </span>
                  <span className="t-meta">{price(featuredGuide.price)}</span>
                </Link>
                <ButtonLink href="/guides" size="lg" className="w-full">
                  Explorer les guides
                </ButtonLink>
                <div className="flex items-center justify-between text-graphite">
                  <p className="t-label">Voyager autrement ↓</p>
                  <div className="flex gap-4">
                    <a href={socialHandles.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                      <TikTokIcon className="size-5" />
                    </a>
                    <a href={socialHandles.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <InstagramIcon className="size-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
            <button onClick={() => setOpen(false)} className="sr-only focus:not-sr-only">
              <X /> Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Mobile-only floating CTA that appears once the hero has scrolled away. */
export function MobileDock({ href = "/guides", label = "Explorer les guides" }: { href?: string; label?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-[var(--ease-out-soft)] md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <Link
        href={href}
        className="flex h-14 items-center justify-between rounded-full border border-paper/15 bg-ink pr-2 pl-6 text-paper shadow-lift"
      >
        <span className="text-[0.95rem] font-medium">{label}</span>
        <span className="flex size-10 items-center justify-center rounded-full bg-clay">
          <ArrowRight className="size-4" strokeWidth={1.6} />
        </span>
      </Link>
    </div>
  );
}
