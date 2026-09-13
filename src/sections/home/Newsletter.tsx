"use client";

import { useId, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Eyebrow } from "@/components/ui/Primitives";
import { cn } from "@/lib/format";

export function Newsletter({ index = "10" }: { index?: string }) {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  return (
    <section className="section-y" aria-labelledby={`${id}-title`}>
      <div className="container-v">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow index={index} className="justify-center">Newsletter</Eyebrow>
          <h2 id={`${id}-title`} className="t-h1 mt-8 text-balance">
            Le prochain voyage commence <em>dans votre boîte mail.</em>
          </h2>
          <p className="t-lead mx-auto mt-6 max-w-[44ch] text-graphite">
            Destinations abordables, bons plans transport et nouveaux guides.
          </p>

          <form
            className="mx-auto mt-12 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              const email = new FormData(e.currentTarget).get("email")?.toString() ?? "";
              if (!/^\S+@\S+\.\S+$/.test(email)) return setState("error");
              setState("sending");
              setTimeout(() => setState("done"), 900); // simulated
            }}
            noValidate
          >
            {state === "done" ? (
              <p className="flex items-center justify-center gap-3 border-b border-ink py-4 text-lg" role="status">
                <Check className="size-5 text-forest" strokeWidth={1.8} /> C&apos;est noté. Premier email le mois prochain.
              </p>
            ) : (
              <div
                className={cn(
                  "flex items-center gap-3 border-b py-2 transition-colors focus-within:border-ink",
                  state === "error" ? "border-clay" : "border-ink/30",
                )}
              >
                <label htmlFor={`${id}-email`} className="sr-only">
                  Votre adresse email
                </label>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Votre adresse email"
                  aria-invalid={state === "error"}
                  aria-describedby={`${id}-hint`}
                  onChange={() => state === "error" && setState("idle")}
                  className="h-12 min-w-0 flex-1 bg-transparent text-lg placeholder:text-muted focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[0.92rem] font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
                >
                  <span className="hidden sm:inline">{state === "sending" ? "Envoi…" : "Recevoir Veyora"}</span>
                  <span className="sm:hidden">{state === "sending" ? "…" : "Recevoir"}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.6} />
                </button>
              </div>
            )}
            <p id={`${id}-hint`} className={cn("t-meta mt-4", state === "error" ? "text-clay" : "text-muted")}>
              {state === "error" ? "Cette adresse ne semble pas valide." : "1 à 2 emails par mois. Pas de spam."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
