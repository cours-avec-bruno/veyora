"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getGuide } from "@/data/guides";
import type { Guide } from "@/data/types";

type CartState = {
  items: Guide[];
  count: number;
  total: number;
  ready: boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "veyora.cart.v1";

/** Digital goods: one copy per guide, persisted locally. No backend. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
      if (raw) setSlugs(JSON.parse(raw).filter((s: unknown) => typeof s === "string" && getGuide(s)));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch {}
  }, [slugs, ready]);

  const add = useCallback((slug: string) => setSlugs((s) => (s.includes(slug) ? s : [...s, slug])), []);
  const remove = useCallback((slug: string) => setSlugs((s) => s.filter((x) => x !== slug)), []);
  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo<CartState>(() => {
    const items = slugs.map(getGuide).filter((g): g is Guide => !!g);
    return {
      items,
      count: items.length,
      total: Math.round(items.reduce((a, g) => a + g.price, 0) * 100) / 100,
      ready,
      add,
      remove,
      clear,
      has: (slug) => slugs.includes(slug),
    };
  }, [slugs, ready, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
