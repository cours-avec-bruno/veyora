import Image from "next/image";
import { photo } from "@/data/photos";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal, SplitTitle } from "@/components/ui/Motion";
import { ButtonLink } from "@/components/ui/Button";

const ideas = [
  { word: "Économique", text: "Parce qu'un voyage bien pensé coûte moins qu'un voyage improvisé. Presque toujours." },
  { word: "Responsable", text: "Parce que le trajet fait partie du voyage, et qu'on peut le choisir sans se priver." },
  { word: "Beau", text: "Parce qu'aucune de ces économies ne vaut la peine si l'on rentre sans avoir rien vu." },
];

export function Manifesto({ index = "09", cta = true }: { index?: string; cta?: boolean }) {
  const img = photo("hiker-moor");
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper" aria-labelledby="manifesto-title">
      <Image src={img.src} alt="" fill sizes="100vw" className="photo -z-10 object-cover opacity-35" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/70 to-ink" />

      <div className="container-v section-y">
        <Eyebrow index={index} tone="light">Manifeste</Eyebrow>

        <SplitTitle
          id="manifesto-title"
          as="h2"
          text={"Le voyage ne devrait pas\nêtre réservé à ceux\nqui peuvent se permettre\nde partir cher."}
          className="mt-10 max-w-[20ch] font-serif text-[clamp(2.6rem,6.4vw,6.2rem)] leading-[0.98] tracking-[-0.03em]"
        />

        <div className="mt-20 grid gap-px overflow-hidden rounded-[3px] bg-paper/15 md:mt-28 md:grid-cols-3">
          {ideas.map((idea, i) => (
            <Reveal key={idea.word} delay={i * 0.12} className="bg-ink/85 p-8 backdrop-blur-sm md:p-10">
              <p className="t-meta text-paper/50">Le voyage peut être</p>
              <p className="mt-6 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-none italic">
                {idea.word}
                <span className="text-clay">.</span>
              </p>
              <p className="mt-6 max-w-[32ch] leading-relaxed text-paper/75">{idea.text}</p>
            </Reveal>
          ))}
        </div>

        {cta && (
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
            <p className="t-label text-paper/55">Signé : la rédaction Veyora, depuis un quai de gare.</p>
            <ButtonLink href="/a-propos" variant="outline-light">
              Lire le manifeste
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
