import Image from "next/image";
import { photo } from "@/data/photos";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal, SplitTitle } from "@/components/ui/Motion";

const principles = [
  {
    n: "01",
    title: "Moins cher",
    text: "Trouver les meilleurs compromis entre budget, temps et confort.",
    detail: "Chaque guide affiche son coût total, poste par poste.",
    glyph: (
      <svg viewBox="0 0 64 24" className="h-6 w-auto" aria-hidden>
        {[4, 10, 16, 22, 28].map((x, i) => (
          <rect key={x} x={x} y={24 - (i + 1) * 4} width="3" height={(i + 1) * 4} className={i < 2 ? "fill-ink" : "fill-ink/20"} />
        ))}
        <text x="38" y="18" className="fill-ink font-mono" fontSize="10">≈ €</text>
      </svg>
    ),
  },
  {
    n: "02",
    title: "Moins d'impact",
    text: "Privilégier le train, le bus, le covoiturage et les alternatives pertinentes lorsque cela a du sens.",
    detail: "Et le dire franchement quand l'avion reste le choix raisonnable.",
    glyph: (
      <svg viewBox="0 0 64 24" className="h-6 w-auto" aria-hidden>
        <path d="M2 12h60" className="stroke-ink" strokeWidth="1" strokeDasharray="3 3" />
        {[6, 26, 46].map((x) => (
          <circle key={x} cx={x} cy="12" r="3.5" className="fill-paper stroke-ink" strokeWidth="1.2" />
        ))}
        <circle cx="60" cy="12" r="3.5" className="fill-ink" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Mieux pensé",
    text: "Des itinéraires concrets, optimisés et directement applicables.",
    detail: "Horaires, arrêts, plan B météo : rien à recouper ailleurs.",
    glyph: (
      <svg viewBox="0 0 64 24" className="h-6 w-auto" aria-hidden>
        <path d="M4 20 C 16 20, 16 4, 30 4 S 46 20, 60 20" fill="none" className="stroke-ink" strokeWidth="1.2" />
        <circle cx="4" cy="20" r="2.5" className="fill-clay" />
        <circle cx="60" cy="20" r="2.5" className="fill-ink" />
      </svg>
    ),
  },
];

export function Principles() {
  const img = photo("train-lake");
  return (
    <section id="voyage-autrement" className="section-y relative" aria-labelledby="principles-title">
      <div className="container-v">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow index="01">Le voyage autrement</Eyebrow>
            <Reveal delay={0.1} className="mt-10 hidden lg:block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[3px]">
                <Image src={img.src} alt={img.alt} fill sizes="22vw" className="photo object-cover" />
              </div>
              <p className="t-meta mt-3 text-muted">07 h 42 — place 64, côté fenêtre.</p>
            </Reveal>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <SplitTitle
              as="h2"
              text={"Voyager ne devrait pas\ncoûter une fortune."}
              className="t-display text-balance"
            />
            <Reveal delay={0.2}>
              <p className="t-lead mt-10 max-w-[52ch] text-graphite text-pretty">
                <span id="principles-title" className="text-ink">
                  Veyora sélectionne des destinations, des itinéraires et des solutions de transport
                </span>{" "}
                qui permettent de voyager intelligemment, sans transformer chaque départ en dépense démesurée.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="mt-20 grid border-t border-ink md:mt-28 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.n}
              delay={i * 0.12}
              className="group relative border-b border-line py-10 md:border-b-0 md:py-12 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10"
            >
              <div className="flex items-start justify-between">
                <span className="t-num text-[5.5rem] text-ink/15 transition-colors duration-700 group-hover:text-clay md:text-[7rem]">
                  {p.n}
                </span>
                <span className="mt-4 opacity-80">{p.glyph}</span>
              </div>
              <h3 className="t-h2 mt-6">{p.title}</h3>
              <p className="mt-4 max-w-[34ch] text-[1.05rem] leading-relaxed text-ink-2 text-pretty">{p.text}</p>
              <p className="t-meta mt-6 max-w-[34ch] text-muted">— {p.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
