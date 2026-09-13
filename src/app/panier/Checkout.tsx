"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, CreditCard, Download, Lock, Trash2, Wallet } from "lucide-react";
import { useCart } from "@/components/layout/CartProvider";
import { GuideCover } from "@/components/guide/GuideCover";
import { GuideCard } from "@/components/cards/GuideCard";
import { guides } from "@/data/guides";
import { Eyebrow, PriceTag } from "@/components/ui/Primitives";
import { cn, price } from "@/lib/format";
import type { Guide } from "@/data/types";

type Step = "cart" | "details" | "done";

export function Checkout() {
  const { items, total, remove, clear, ready, add } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [method, setMethod] = useState<"card" | "wallet">("card");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [purchased, setPurchased] = useState<Guide[]>([]);

  const suggestions = guides.filter((g) => !items.some((i) => i.slug === g.slug)).slice(0, 3);

  if (!ready) return <div className="h-96" aria-busy="true" />;

  if (step === "done") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-14 lg:grid-cols-12" role="status">
        <div className="lg:col-span-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-forest text-paper">
            <Check className="size-6" strokeWidth={1.8} />
          </span>
          <h2 className="t-display mt-8 text-balance">Bon voyage.</h2>
          <p className="t-lead mt-6 max-w-[44ch] text-graphite">
            Vos guides sont prêts. Un lien de téléchargement vient aussi d&apos;être envoyé à <strong className="font-medium text-ink">{email}</strong>.
          </p>
          <p className="t-meta mt-4 text-muted">Maquette : aucun paiement n&apos;a été effectué.</p>
        </div>
        <ul className="space-y-4 lg:col-span-5 lg:col-start-8">
          {purchased.map((g) => (
            <li key={g.slug} className="flex items-center gap-5 rounded-[3px] bg-paper-2 p-4">
              <div className="w-16 shrink-0"><GuideCover guide={g} sizes="64px" /></div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl leading-none">{g.title}</p>
                <p className="t-meta mt-1 text-muted">PDF · {g.pages} pages · 18 Mo</p>
              </div>
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm text-paper" aria-label={`Télécharger le guide ${g.title}`}>
                <Download className="size-4" strokeWidth={1.6} /> <span className="hidden sm:inline">Télécharger</span>
              </button>
            </li>
          ))}
          <li className="pt-4">
            <Link href="/guides" className="link-u-static">Continuer d&apos;explorer</Link>
          </li>
        </ul>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <div className="mx-auto max-w-2xl py-10 text-center">
          <p className="t-label text-muted">Panier vide</p>
          <h2 className="t-h1 mt-6 text-balance">Aucun voyage dans le sac pour l&apos;instant.</h2>
          <p className="mt-5 text-graphite">Commencez par une destination, ou choisissez directement un guide.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/guides" className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-paper">Explorer les guides <ArrowRight className="size-4" strokeWidth={1.6} /></Link>
            <Link href="/destinations" className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6">Voir les destinations</Link>
          </div>
        </div>
        <div className="mt-20 border-t border-line pt-14">
          <p className="t-label text-muted">Pour commencer</p>
          <div className="rail -mx-[var(--gutter)] mt-8 gap-6 px-[var(--gutter)] md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:px-0">
            {guides.slice(0, 3).map((g) => (
              <div key={g.slug} className="w-[68vw] max-w-[20rem] shrink-0 md:w-auto md:max-w-none"><GuideCard guide={g} /></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        {/* Steps */}
        <ol className="t-label flex items-center gap-3 text-muted" aria-label="Étapes de commande">
          {[["cart", "Panier"], ["details", "Coordonnées & paiement"]].map(([k, l], i) => (
            <li key={k} className={cn("flex items-center gap-3", step === k && "text-ink")} aria-current={step === k ? "step" : undefined}>
              {i > 0 && <span className="h-px w-8 bg-current opacity-40" aria-hidden />}
              <span className={cn("flex size-6 items-center justify-center rounded-full border text-[0.65rem]", step === k ? "border-ink bg-ink text-paper" : "border-ink/30")}>{i + 1}</span>
              {l}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          {step === "cart" ? (
            <motion.ul key="cart" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="mt-10 border-t border-ink">
              <AnimatePresence initial={false}>
                {items.map((g) => (
                  <motion.li key={g.slug} layout exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-b border-line">
                    <div className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-5 py-6 sm:grid-cols-[6rem_1fr_auto]">
                      <Link href={`/guides/${g.slug}`} className="block"><GuideCover guide={g} sizes="96px" /></Link>
                      <div className="min-w-0">
                        <p className="t-label text-muted">Guide N° {g.number} · PDF</p>
                        <p className="mt-1 font-serif text-3xl leading-none">{g.title}</p>
                        <p className="mt-1 text-graphite">{g.subtitle}</p>
                        <button type="button" onClick={() => remove(g.slug)} className="t-meta mt-3 inline-flex items-center gap-1.5 text-muted hover:text-clay">
                          <Trash2 className="size-3.5" strokeWidth={1.5} /> Retirer
                        </button>
                      </div>
                      <PriceTag value={g.price} size="sm" />
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.form
              key="details"
              id="checkout-form"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="mt-10 space-y-10 border-t border-ink pt-10"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Indiquez l'adresse où recevoir vos guides.");
                setPaying(true);
                setTimeout(() => {
                  setPurchased(items);
                  clear();
                  setPaying(false);
                  setStep("done");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 1200);
              }}
            >
              <div>
                <label htmlFor="co-email" className="t-label text-muted">Où envoyer vos guides ?</label>
                <input
                  id="co-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="prenom@exemple.fr"
                  aria-invalid={!!error}
                  aria-describedby="co-email-hint"
                  className={cn("mt-3 h-14 w-full border-b bg-transparent text-xl outline-none placeholder:text-muted/60 focus:border-ink", error ? "border-clay" : "border-ink/25")}
                />
                <p id="co-email-hint" className={cn("t-meta mt-2", error ? "text-clay" : "text-muted")}>{error || "Pas de compte à créer. Le lien de téléchargement arrive ici."}</p>
              </div>

              <fieldset>
                <legend className="t-label text-muted">Moyen de paiement</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {([
                    ["card", "Carte bancaire", CreditCard],
                    ["wallet", "Apple Pay · Google Pay", Wallet],
                  ] as const).map(([k, l, Icon]) => (
                    <label key={k} className={cn("flex cursor-pointer items-center gap-3 rounded-[4px] border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-clay", method === k ? "border-ink bg-paper-2" : "border-ink/15 hover:border-ink/50")}>
                      <input type="radio" name="method" value={k} checked={method === k} onChange={() => setMethod(k)} className="sr-only" />
                      <span className={cn("flex size-5 items-center justify-center rounded-full border", method === k ? "border-ink" : "border-ink/30")}>
                        {method === k && <span className="size-2.5 rounded-full bg-ink" />}
                      </span>
                      <Icon className="size-4" strokeWidth={1.5} />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
                <p className="t-meta mt-4 flex items-center gap-2 text-muted">
                  <Lock className="size-3.5" strokeWidth={1.5} /> Le paiement s&apos;effectue sur la page sécurisée du prestataire. Ici, il est simulé.
                </p>
              </fieldset>
            </motion.form>
          )}
        </AnimatePresence>

        {step === "cart" && suggestions.length > 0 && (
          <div className="mt-16">
            <p className="t-label text-muted">Pour un prochain départ</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {suggestions.map((g) => (
                <li key={g.slug} className="flex items-center gap-3 rounded-[3px] border border-line p-3">
                  <div className="w-12 shrink-0"><GuideCover guide={g} sizes="48px" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg leading-none">{g.title}</p>
                    <p className="t-meta mt-1 text-muted">{price(g.price)}</p>
                  </div>
                  <button type="button" onClick={() => add(g.slug)} className="t-meta rounded-full border border-ink/20 px-2.5 py-1 hover:border-ink" aria-label={`Ajouter ${g.title}`}>
                    + Ajouter
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Summary */}
      <aside className="lg:col-span-4 lg:col-start-9">
        <div className="rounded-[4px] bg-ink p-6 text-paper md:p-8 lg:sticky lg:top-28">
          <Eyebrow tone="light">Récapitulatif</Eyebrow>
          <ul className="mt-6 space-y-3">
            {items.map((g) => (
              <li key={g.slug} className="flex justify-between gap-4 text-paper/85">
                <span className="truncate">Guide {g.title}</span>
                <span className="t-meta">{price(g.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-paper/15 pt-4 text-paper/60">
            <span className="t-meta">TVA incluse</span>
            <span className="t-meta">Livraison : instantanée</span>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <span className="t-label text-paper/60">Total</span>
            <PriceTag value={total} size="md" />
          </div>

          {step === "cart" ? (
            <button type="button" onClick={() => setStep("details")} className="mt-8 flex h-14 w-full items-center justify-between rounded-full bg-paper pr-2 pl-6 text-ink transition-colors hover:bg-white">
              <span className="font-medium">Continuer</span>
              <span className="flex size-10 items-center justify-center rounded-full bg-clay text-paper"><ArrowRight className="size-4" strokeWidth={1.8} /></span>
            </button>
          ) : (
            <>
              <button type="submit" form="checkout-form" disabled={paying} className="mt-8 flex h-14 w-full items-center justify-between rounded-full bg-paper pr-2 pl-6 text-ink transition-colors hover:bg-white disabled:opacity-70">
                <span className="font-medium">{paying ? "Paiement en cours…" : `Payer ${price(total)}`}</span>
                <span className="flex size-10 items-center justify-center rounded-full bg-clay text-paper"><Lock className="size-4" strokeWidth={1.8} /></span>
              </button>
              <button type="button" onClick={() => setStep("cart")} className="t-meta mt-4 w-full text-center text-paper/60 hover:text-paper">← Modifier le panier</button>
            </>
          )}
          <ul className="t-meta mt-8 space-y-2 border-t border-paper/15 pt-6 text-paper/60">
            <li className="flex items-center gap-2"><Download className="size-3.5" strokeWidth={1.5} /> PDF disponible immédiatement</li>
            <li className="flex items-center gap-2"><Check className="size-3.5" strokeWidth={1.5} /> Mises à jour offertes à vie</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
