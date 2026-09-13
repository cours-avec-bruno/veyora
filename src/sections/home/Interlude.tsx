import Image from "next/image";
import { photo, type PhotoKey } from "@/data/photos";
import { Reveal } from "@/components/ui/Motion";

function Inline({ k, className }: { k: PhotoKey; className?: string }) {
  const p = photo(k);
  return (
    <span
      className={`relative mx-[0.12em] inline-block h-[0.78em] w-[1.6em] translate-y-[0.06em] overflow-hidden rounded-full align-baseline ${className ?? ""}`}
    >
      <Image src={p.src} alt="" fill sizes="160px" className="photo object-cover" />
    </span>
  );
}

export function Interlude() {
  return (
    <section className="section-y overflow-hidden" aria-label="Philosophie">
      <div className="container-v">
        <Reveal>
          <p className="mx-auto max-w-[18ch] text-center font-serif text-[clamp(2.4rem,7.2vw,7rem)] leading-[1.02] tracking-[-0.03em] text-balance">
            Le monde est <span className="whitespace-nowrap">vaste.<Inline k="ecosse" /></span>{" "}
            <span className="text-muted">Votre budget ne l&apos;est pas toujours.</span> Alors on{" "}
            <span className="whitespace-nowrap">cherche<Inline k="train-window" /></span> de meilleures façons{" "}
            <em className="whitespace-nowrap">de partir.<Inline k="coast-path" /></em>
          </p>
        </Reveal>
        <div className="mx-auto mt-14 flex max-w-xl items-center justify-center gap-4 text-muted" aria-hidden>
          <span className="h-px flex-1 bg-line" />
          <span className="t-label">Le budget est un itinéraire</span>
          <span className="h-px flex-1 bg-line" />
        </div>
      </div>
    </section>
  );
}
