import { impactModes, impactCaveats, impactSources } from "@/data/impact";
import { SectionHeader } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Motion";
import { ButtonLink } from "@/components/ui/Button";

const MAX = Math.max(...impactModes.map((m) => m.bar));

const toneClass = {
  rail: "bg-forest",
  road: "bg-line-strong",
  air: "bg-clay",
} as const;

/**
 * La comparaison est volontairement à l'échelle linéaire : à côté de l'avion,
 * le TGV n'est qu'un filet. C'est l'information, pas un défaut de lisibilité —
 * la valeur chiffrée est donc posée à côté de chaque barre.
 */
export function Impact({ index = "07" }: { index?: string } = {}) {
  return (
    <section className="bg-paper-2 section-y" aria-labelledby="impact-title">
      <div className="container-v">
        <SectionHeader
          index={index}
          eyebrow="L'impact"
          title={
            <>
              Un aller-retour pèse plus lourd <em>que tout le reste du séjour.</em>
            </>
          }
          lead="C'est pour ça que nos guides commencent par le trajet, et pas par l'hôtel. Voici les ordres de grandeur sur lesquels nous travaillons."
        >
          <ButtonLink href="/impact" variant="ghost">
            Notre position sur l&apos;impact
          </ButtonLink>
        </SectionHeader>

        <Reveal>
          <div className="mt-16 md:mt-20">
            <div className="flex items-baseline justify-between border-b border-ink pb-3">
              <span className="t-label">Émissions par voyageur · kilomètre</span>
              <span className="t-micro text-muted">g CO₂e</span>
            </div>

            <dl className="mt-2">
              {impactModes.map((m) => (
                <div
                  key={m.label}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-5 gap-y-2 border-b border-line py-4 sm:grid-cols-[13rem_1fr_5.5rem]"
                >
                  <dt className="text-ink">{m.label}</dt>

                  <div className="order-3 col-span-2 sm:order-none sm:col-span-1">
                    <div className="h-2 w-full bg-paper-3/60" role="presentation">
                      <div
                        className={`h-full ${toneClass[m.tone]}`}
                        style={{ width: `${Math.max((m.bar / MAX) * 100, 0.8)}%` }}
                      />
                    </div>
                    <p className="t-micro mt-2 text-muted">{m.note}</p>
                  </div>

                  <dd className="t-meta justify-self-end whitespace-nowrap text-ink">{m.range}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h3 className="t-h3">{impactCaveats.title}</h3>
            <ul className="mt-6 space-y-4">
              {impactCaveats.items.map((c) => (
                <li key={c} className="flex gap-4 border-t border-line pt-4 text-graphite">
                  <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-line-strong" />
                  <span className="text-pretty">{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-9">
            <div className="border-l border-clay pl-6">
              <p className="t-label text-clay">Sources</p>
              <ul className="mt-4 space-y-3">
                {impactSources.list.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="t-meta text-graphite underline decoration-line-strong underline-offset-4 transition-colors hover:text-clay"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="t-micro mt-6 text-muted">{impactSources.note}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
