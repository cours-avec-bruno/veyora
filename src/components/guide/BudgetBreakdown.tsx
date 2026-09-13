import type { Guide } from "@/data/types";
import { budget } from "@/lib/format";
import { Reveal } from "@/components/ui/Motion";

const labels = [
  { key: "transport", label: "Transport", note: "Trains, bus, bateaux", tone: "bg-ink" },
  { key: "logement", label: "Logement", note: "Chambre partagée à deux", tone: "bg-forest" },
  { key: "nourriture", label: "Nourriture", note: "Un vrai repas par jour", tone: "bg-moss" },
  { key: "activites", label: "Activités", note: "Entrées, locations", tone: "bg-clay" },
] as const;

export function BudgetBreakdown({ guide }: { guide: Guide }) {
  const b = guide.budgetBreakdown;
  const total = guide.budget;
  const maxDay = Math.max(...guide.itinerary.map((d) => d.spend));

  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="t-label text-muted">Total estimé · 1 personne</p>
        <p className="t-num mt-4 text-[clamp(6rem,16vw,13rem)]">
          {total}
          <span className="ml-2 font-sans text-[0.25em] font-medium tracking-normal">€</span>
        </p>
        <p className="mt-4 max-w-[38ch] text-graphite text-pretty">
          Pour {guide.days} jours, logement partagé à deux, trajet depuis la porte d&apos;entrée ferroviaire inclus.
          Soit <strong className="font-medium text-ink">{budget(Math.round(total / guide.days))} par jour</strong>.
        </p>

        {/* Stacked bar */}
        <div className="mt-10 flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label="Répartition du budget">
          {labels.map((l) => (
            <span key={l.key} className={l.tone} style={{ width: `${(b[l.key] / total) * 100}%` }} />
          ))}
        </div>

        <div className="mt-10 grid gap-6 border-t border-ink/15 pt-6 sm:grid-cols-2">
          <div>
            <p className="t-label text-forest">Compris</p>
            <p className="mt-2 text-sm leading-relaxed text-graphite">Trajets depuis la porte d&apos;entrée, nuits, un repas par jour, entrées et locations indiquées.</p>
          </div>
          <div>
            <p className="t-label text-clay">Non compris</p>
            <p className="mt-2 text-sm leading-relaxed text-graphite">Trajet jusqu&apos;à la porte d&apos;entrée, assurance, extras et souvenirs.</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 lg:col-start-7">
        <table className="w-full text-left">
          <caption className="sr-only">Détail du budget de {guide.title}</caption>
          <thead>
            <tr className="t-label border-b border-ink text-muted">
              <th scope="col" className="pb-3 font-normal">Poste</th>
              <th scope="col" className="hidden pb-3 font-normal sm:table-cell">Part</th>
              <th scope="col" className="pb-3 text-right font-normal">Montant</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((l, i) => {
              const pct = (b[l.key] / total) * 100;
              return (
                <tr key={l.key} className="border-b border-line">
                  <th scope="row" className="py-5 pr-4 font-normal">
                    <span className="flex items-center gap-3">
                      <span className={`size-2.5 rounded-full ${l.tone}`} aria-hidden />
                      <span>
                        <span className="block text-[1.05rem]">{l.label}</span>
                        <span className="t-meta text-muted">{l.note}</span>
                      </span>
                    </span>
                  </th>
                  <td className="hidden w-[40%] py-5 pr-6 sm:table-cell">
                    <Reveal delay={i * 0.1} y={0} className="h-1.5 w-full bg-ink/10">
                      <span className={`block h-full ${l.tone}`} style={{ width: `${pct}%` }} />
                    </Reveal>
                  </td>
                  <td className="py-5 text-right">
                    <span className="t-num text-4xl">{b[l.key]}</span>
                    <span className="ml-1 text-sm">€</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="pt-5 text-left font-medium">Total</th>
              <td className="hidden sm:table-cell" />
              <td className="pt-5 text-right">
                <span className="t-num text-5xl">{total}</span>
                <span className="ml-1 text-sm">€</span>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-12">
          <p className="t-label text-muted">Dépense par jour (extrait du guide)</p>
          <ol className="mt-5 flex h-36 items-end gap-3">
            {guide.itinerary.map((d) => (
              <li key={d.day} className="flex h-full flex-1 flex-col justify-end gap-2">
                <span className="t-meta text-center text-graphite">{d.spend} €</span>
                <span className="block w-full rounded-t-[2px] bg-forest/85" style={{ height: `${(d.spend / maxDay) * 70}%` }} />
                <span className="t-meta text-center text-muted">J{d.day}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
