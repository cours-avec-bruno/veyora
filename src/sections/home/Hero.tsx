"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/ui/Motion";
import { ArrowDown } from "lucide-react";
import { photo } from "@/data/photos";
import { featuredGuide, guides } from "@/data/guides";
import { ButtonLink } from "@/components/ui/Button";
import { RouteMark } from "@/components/ui/Brand";
import { ModeIcon } from "@/components/icons";
import { price } from "@/lib/format";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotionSafe();
  const mobile = photo("hero");
  const desktop = photo("hero");

  const common = { alt: desktop.alt, sizes: "100vw", priority: true } as const;
  const { props: { srcSet: dSet } } = getImageProps({ ...common, src: desktop.src, width: desktop.width, height: desktop.height, quality: 75 });
  const { props: { srcSet: mSet, ...rest } } = getImageProps({ ...common, src: mobile.src, width: mobile.width, height: mobile.height, quality: 75 });

  // Pointer parallax — a few pixels, desktop only
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const tx = useTransform(sx, (v) => v * -14);
  const ty = useTransform(sy, (v) => v * -10);

  const d = featuredGuide.itinerary[2];

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      aria-labelledby="hero-title"
    >
      <motion.div
        className="absolute -inset-4 -z-10"
        style={{ x: tx, y: ty }}
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease }}
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={dSet} />
          <source srcSet={mSet} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is spread from getImageProps */}
          <img {...rest} className="photo size-full object-cover object-[50%_60%] md:object-[50%_55%]" />
        </picture>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
      <div aria-hidden className="absolute inset-y-0 left-0 -z-10 hidden w-2/3 bg-gradient-to-r from-black/45 to-transparent md:block" />

      <div className="container-v relative flex flex-1 flex-col justify-end pt-[calc(var(--nav-h)+2rem)] pb-8 md:pb-12">
        <motion.p
          className="t-label flex items-center gap-3 text-paper/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
        >
          <span className="inline-block size-1.5 rounded-full bg-clay" aria-hidden />
          Édition printemps 2026<span className="hidden sm:inline"> · {guides.length} guides</span> · 0 voiture
        </motion.p>

        <h1 id="hero-title" className="mt-6 font-serif text-[clamp(3.4rem,8.2vw,8.4rem)] leading-[0.9] tracking-[-0.035em] md:mt-8" aria-label="Voyager plus loin. Dépenser moins.">
          {["Voyager plus loin.", "Dépenser moins."].map((line, li) => (
            <span key={li} className="block overflow-hidden pb-[0.06em]" aria-hidden>
              <motion.span
                className={li === 1 ? "block italic text-paper/95" : "block"}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease, delay: 0.35 + li * 0.14 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-10 md:mt-12 lg:grid-cols-12 lg:items-end">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.9 }}
          >
            <p className="t-lead max-w-[36ch] text-paper/85 text-pretty">
              Des itinéraires pensés pour voyager autrement, avec moins de dépenses et moins d&apos;impact.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/guides" variant="light" size="lg">
                Explorer les guides
              </ButtonLink>
              <ButtonLink href="/a-propos" variant="outline-light" size="lg" icon="none">
                Découvrir Veyora
              </ButtonLink>
            </div>
            <ul className="t-label mt-8 flex flex-wrap gap-x-3 gap-y-2 text-paper/65">
              {["Guides numériques", "Itinéraires testés", "Budgets transparents"].map((t, i) => (
                <li key={t} className="flex items-center gap-3 whitespace-nowrap">
                  {i > 0 && <span className="opacity-50" aria-hidden>·</span>}
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Feasibility ticket */}
          <motion.div
            className="lg:col-span-4 lg:col-start-9"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1.15 }}
          >
            <Link
              href={`/guides/${featuredGuide.slug}`}
              className="group block rounded-[4px] border border-paper/20 bg-black/30 p-5 backdrop-blur-md transition-colors duration-500 hover:border-paper/50 hover:bg-black/40"
            >
              <div className="flex items-center justify-between">
                <span className="t-label text-paper/70">Extrait · Jour {d.day}</span>
                <span className="t-meta text-paper/60">{featuredGuide.coords}</span>
              </div>
              <p className="mt-4 font-serif text-3xl leading-none">
                {d.route.split(" → ")[0]} <span className="text-paper/50">→</span> {d.route.split(" → ")[1]}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-paper/15 pt-4">
                {d.moves.slice(0, 1).map((m) => (
                  <span key={m.label} className="t-meta flex items-center gap-2">
                    <ModeIcon mode={m.mode} /> {m.duration}
                  </span>
                ))}
                <span className="t-meta">{d.moves[0].cost}</span>
                <span className="t-meta text-right">Jour ≈ {d.spend} €</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-paper/80">
                <span className="text-sm">
                  Guide {featuredGuide.title} · <span className="link-u">{price(featuredGuide.price)}</span>
                </span>
                <RouteMark className="h-2 w-auto transition-transform duration-700 group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.a
          href="#voyage-autrement"
          className="t-label mt-10 hidden items-center gap-3 self-start text-paper/70 transition-colors hover:text-paper md:inline-flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          Voyager autrement
          <ArrowDown className="size-3.5 animate-bounce [animation-duration:2.4s]" strokeWidth={1.6} />
        </motion.a>
      </div>
    </section>
  );
}
