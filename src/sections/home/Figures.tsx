import { featuredGuide as g } from "@/data/guides";
import { CountUp, DrawPath } from "@/components/ui/Motion";
import { Eyebrow } from "@/components/ui/Primitives";

const figures = [
  { value: 1, suffix: "", label: "destination", note: g.sample, axis: "Où" },
  { value: g.days, suffix: "", label: "jours", note: "Du vendredi au lundi", axis: "Temps" },
  { value: g.budget, suffix: " €", label: "de budget", note: "Transport, lit, repas, sorties", axis: "Budget" },
  { value: 0, suffix: "", label: "voiture", note: "Train, bus, marche", axis: "Transport" },
];

export function Figures() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper" aria-labelledby="figures-title">
      <div className="container-v section-y">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Eyebrow index="06" tone="light">Un voyage, en chiffres</Eyebrow>
          <h2 id="figures-title" className="t-h3 max-w-[28ch] text-paper/75">
            Budget + temps + transport + expérience. <em className="text-paper">Dans cet ordre.</em>
          </h2>
        </div>

        <div className="relative mt-16 md:mt-24">
          {/* the line that links the four numbers */}
          <svg className="pointer-events-none absolute top-[calc(0.36rem-12px)] left-0 hidden h-6 w-full text-paper/30 lg:block" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden>
            <DrawPath d="M0 12 H1000" strokeWidth={1} duration={2.4} />
          </svg>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-[0.8fr_0.8fr_1.6fr_0.8fr]">
            {figures.map((f, i) => (
              <div key={f.label} className="relative">
                <dt className="t-label relative z-10 flex w-fit items-center gap-2 bg-ink pr-3 text-paper/55">
                  <span className="relative z-10 inline-block size-2.5 rounded-full border border-paper bg-ink" aria-hidden />
                  {f.axis}
                </dt>
                <dd className="mt-8">
                  <CountUp
                    to={f.value}
                    suffix={f.suffix}
                    duration={i === 2 ? 2 : 1.2}
                    className="t-num block text-[clamp(4.2rem,11vw,10rem)] whitespace-nowrap text-paper"
                  />
                  <span className="mt-4 block font-serif text-2xl italic">{f.label}</span>
                  <span className="t-meta mt-2 block text-paper/55">{f.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
