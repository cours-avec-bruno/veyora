"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { guides } from "@/data/guides";
import { destinations } from "@/data/destinations";
import type { Guide } from "@/data/types";
import { GuideCard } from "@/components/cards/GuideCard";
import { budget, cn } from "@/lib/format";

type Option = { value: string; label: string; test: (g: Guide) => boolean };

const groups: { key: string; label: string; options: Option[] }[] = [
  {
    key: "budget",
    label: "Budget",
    options: [
      { value: "moins-200", label: "< 200 €", test: (g) => g.budget < 200 },
      { value: "200-300", label: "200–300 €", test: (g) => g.budget >= 200 && g.budget <= 300 },
      { value: "300-500", label: "300–500 €", test: (g) => g.budget > 300 && g.budget <= 500 },
    ],
  },
  {
    key: "duree",
    label: "Durée",
    options: [
      { value: "court", label: "3–4 jours", test: (g) => g.days <= 4 },
      { value: "moyen", label: "5 jours", test: (g) => g.days === 5 },
      { value: "long", label: "6 jours et +", test: (g) => g.days >= 6 },
    ],
  },
  {
    key: "type",
    label: "Type de voyage",
    options: (["Nature", "City trip", "Côte", "Randonnée"] as const).map((t) => ({
      value: t.toLowerCase().replace(" ", "-").replace("ô", "o"),
      label: t,
      test: (g: Guide) => g.types.includes(t),
    })),
  },
  {
    key: "transport",
    label: "Transport",
    options: [
      { value: "train", label: "Train", test: (g) => g.modes.includes("train") },
      { value: "sans-voiture", label: "Sans voiture", test: (g) => g.noCar },
      { value: "nuit", label: "Train de nuit", test: (g) => g.modes.includes("nuit") },
      { value: "velo", label: "Vélo", test: (g) => g.modes.includes("velo") },
    ],
  },
];

const sorts = {
  recommande: { label: "Recommandés", fn: (a: Guide, b: Guide) => a.volume.localeCompare(b.volume) },
  budget: { label: "Budget croissant", fn: (a: Guide, b: Guide) => a.budget - b.budget },
  duree: { label: "Durée", fn: (a: Guide, b: Guide) => a.days - b.days },
};
type SortKey = keyof typeof sorts;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.88rem] whitespace-nowrap transition-colors duration-300",
        active ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink-2 hover:border-ink/50",
      )}
    >
      {children}
      {active && <X className="size-3" strokeWidth={2} aria-hidden />}
    </button>
  );
}

export function GuidesBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    const m: Record<string, string[]> = {};
    for (const g of [...groups.map((x) => x.key), "destination"]) {
      m[g] = params.get(g)?.split(",").filter(Boolean) ?? [];
    }
    return m;
  }, [params]);
  const sort = (params.get("tri") as SortKey) in sorts ? (params.get("tri") as SortKey) : "recommande";

  const update = (key: string, values: string[]) => {
    const next = new URLSearchParams(params.toString());
    if (values.length) next.set(key, values.join(","));
    else next.delete(key);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };
  const toggle = (key: string, value: string) => {
    const cur = selected[key];
    update(key, cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]);
  };
  const reset = () => router.replace(pathname, { scroll: false });

  const results = useMemo(() => {
    return guides
      .filter((g) => {
        if (selected.destination.length && !selected.destination.includes(g.destinationSlug)) return false;
        // OR within a group, AND across groups
        return groups.every((grp) => {
          const vals = selected[grp.key];
          if (!vals.length) return true;
          return grp.options.some((o) => vals.includes(o.value) && o.test(g));
        });
      })
      .sort(sorts[sort].fn);
  }, [selected, sort]);

  const activeCount = Object.values(selected).reduce((a, v) => a + v.length, 0);
  const cheapest = [...guides].sort((a, b) => a.budget - b.budget)[0];

  const panel = (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1.3fr_1.2fr]">
      <fieldset>
        <legend className="t-label text-muted">Destination</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {destinations.map((d) => (
            <Chip key={d.slug} active={selected.destination.includes(d.slug)} onClick={() => toggle("destination", d.slug)}>
              {d.name}
            </Chip>
          ))}
        </div>
      </fieldset>
      {groups.map((grp) => (
        <fieldset key={grp.key}>
          <legend className="t-label text-muted">{grp.label}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {grp.options.map((o) => (
              <Chip key={o.value} active={selected[grp.key].includes(o.value)} onClick={() => toggle(grp.key, o.value)}>
                {o.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );

  return (
    <div className="container-v pb-24 md:pb-32">
      {/* Desktop: filters always visible */}
      <div className="hidden border-t border-ink py-8 lg:block">{panel}</div>

      {/* Toolbar */}
      <div className="sticky top-[var(--nav-h)] z-20 -mx-[var(--gutter)] border-y border-ink/10 bg-paper/90 px-[var(--gutter)] py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="filtres"
            className="inline-flex h-10 items-center gap-2.5 rounded-full border border-ink/20 px-4 text-[0.92rem] transition-colors hover:border-ink lg:hidden"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            Filtrer
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-clay font-mono text-[0.65rem] text-paper">{activeCount}</span>
            )}
          </button>
          <p className="t-meta hidden text-muted sm:flex sm:items-center sm:gap-4 lg:mr-auto" aria-live="polite">
            <span>
              {results.length} guide{results.length > 1 ? "s" : ""} · {activeCount ? "filtrés" : "toute la collection"}
            </span>
            {activeCount > 0 && (
              <button type="button" onClick={reset} className="link-u-static hidden text-ink lg:inline">
                Tout effacer
              </button>
            )}
          </p>
          <label className="flex items-center gap-2 text-[0.92rem]">
            <span className="t-label hidden text-muted md:inline">Trier</span>
            <select
              value={sort}
              onChange={(e) => {
                const next = new URLSearchParams(params.toString());
                if (e.target.value === "recommande") next.delete("tri");
                else next.set("tri", e.target.value);
                router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
              }}
              className="h-10 cursor-pointer rounded-full border border-ink/20 bg-transparent pr-8 pl-4 hover:border-ink"
              aria-label="Trier les guides"
            >
              {Object.entries(sorts).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="filtres"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="max-h-[60vh] overflow-y-auto pt-6 pb-3">
                {panel}
                <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <button type="button" onClick={reset} className="link-u-static text-sm" disabled={!activeCount}>
                    Tout effacer
                  </button>
                  <button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm text-paper">
                    Voir {results.length} guide{results.length > 1 ? "s" : ""}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active filters summary */}
      {activeCount > 0 && !open && (
        <div className="mt-6 flex flex-wrap items-center gap-2 lg:hidden">
          {selected.destination.map((v) => (
            <Chip key={v} active onClick={() => toggle("destination", v)}>
              {destinations.find((d) => d.slug === v)?.name}
            </Chip>
          ))}
          {groups.flatMap((grp) =>
            selected[grp.key].map((v) => (
              <Chip key={grp.key + v} active onClick={() => toggle(grp.key, v)}>
                {grp.options.find((o) => o.value === v)?.label}
              </Chip>
            )),
          )}
          <button onClick={reset} className="link-u-static ml-2 text-sm text-graphite">
            Effacer
          </button>
        </div>
      )}

      {results.length === 0 ? (
        <div className="mx-auto max-w-xl py-24 text-center">
          <p className="t-label text-muted">Aucun guide</p>
          <p className="t-h2 mt-4 text-balance">Pas encore de voyage qui coche toutes ces cases.</p>
          <p className="mt-4 text-graphite">
            Le guide le plus économique aujourd&apos;hui : <strong className="font-medium text-ink">{cheapest.title}</strong>, ≈ {budget(cheapest.budget)} pour {cheapest.days} jours.
          </p>
          <button onClick={reset} className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-6 text-paper">
            Voir toute la collection
          </button>
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 xl:gap-x-12">
          <AnimatePresence mode="popLayout">
            {results.map((g, i) => (
              <motion.li
                key={g.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 6) * 0.04 }}
                className={cn("mx-auto w-full max-w-[24rem] sm:max-w-none", i % 3 === 1 && "lg:mt-12")}
              >
                <GuideCard guide={g} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
