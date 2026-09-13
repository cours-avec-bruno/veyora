"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/format";

const subjects = ["Une question sur un guide", "Proposer une destination", "Presse & partenariats", "Autre chose"];

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  error,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  textarea?: boolean;
}) {
  const cls = cn(
    "peer w-full border-b bg-transparent pt-7 pb-3 text-lg outline-none transition-colors placeholder:text-transparent focus:border-ink",
    error ? "border-clay" : "border-ink/25",
  );
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={name} name={name} rows={5} placeholder={label} aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined} className={cn(cls, "resize-none")} />
      ) : (
        <input id={name} name={name} type={type} autoComplete={autoComplete} placeholder={label} aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined} className={cls} />
      )}
      <label
        htmlFor={name}
        className="t-label pointer-events-none absolute top-1 left-0 text-muted transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:font-sans peer-placeholder-shown:text-base peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:font-mono peer-focus:text-[0.72rem] peer-focus:tracking-[0.14em] peer-focus:uppercase"
      >
        {label}
      </label>
      {error && (
        <p id={`${name}-err`} className="t-meta mt-2 text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [subject, setSubject] = useState(subjects[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-[3px] bg-forest p-10 text-paper" role="status">
        <span className="flex size-12 items-center justify-center rounded-full border border-paper/30">
          <Check className="size-5" strokeWidth={1.8} />
        </span>
        <p className="t-h2 mt-8">Message bien reçu.</p>
        <p className="mt-4 text-paper/75">On vous répond sous 48 h ouvrées, en général plus vite. (Maquette : aucun message n&apos;a été envoyé.)</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const next: Record<string, string> = {};
        if (!data.get("name")?.toString().trim()) next.name = "Comment doit-on vous appeler ?";
        if (!/^\S+@\S+\.\S+$/.test(data.get("email")?.toString() ?? "")) next.email = "Une adresse email valide, pour pouvoir répondre.";
        if ((data.get("message")?.toString().trim().length ?? 0) < 10) next.message = "Quelques mots de plus ?";
        setErrors(next);
        if (!Object.keys(next).length) setSent(true);
      }}
      className="space-y-10"
    >
      <fieldset>
        <legend className="t-label text-muted">Sujet</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {subjects.map((s) => (
            <label key={s} className={cn("cursor-pointer rounded-full border px-4 py-2 text-[0.92rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-clay", subject === s ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink")}>
              <input type="radio" name="subject" value={s} checked={subject === s} onChange={() => setSubject(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-10 md:grid-cols-2">
        <Field label="Votre nom" name="name" autoComplete="name" error={errors.name} />
        <Field label="Votre email" name="email" type="email" autoComplete="email" error={errors.email} />
      </div>
      <Field label="Votre message" name="message" textarea error={errors.message} />
      <div className="flex flex-wrap items-center justify-between gap-6">
        <p className="t-meta max-w-[40ch] text-muted">Vos données ne servent qu&apos;à vous répondre. Jamais revendues, jamais utilisées pour de la publicité.</p>
        <Button type="submit" size="lg" icon="arrow">
          Envoyer
        </Button>
      </div>
    </form>
  );
}
