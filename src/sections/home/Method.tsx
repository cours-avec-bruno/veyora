import { methodSteps } from "@/data/method";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal, SplitTitle } from "@/components/ui/Motion";
import { ButtonLink } from "@/components/ui/Button";

export function Method({ withCta = true, index = "07" }: { withCta?: boolean; index?: string }) {
  return (
    <section className="section-y" aria-labelledby="method-title">
      <div className="container-v grid gap-16 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Eyebrow index={index}>Notre méthode</Eyebrow>
          <SplitTitle
            id="method-title"
            as="h2"
            text={"Nous ne vendons pas\ndes destinations."}
            className="t-h1 mt-6"
          />
          <SplitTitle as="p" text="Nous construisons des voyages." className="t-h1 italic text-clay" delay={0.3} />
          <Reveal delay={0.4}>
            <p className="t-lead mt-8 max-w-[40ch] text-graphite text-pretty">
              Un guide Veyora demande en moyenne six semaines. La plupart de ce temps sert à retirer des choses.
            </p>
            {withCta && (
              <ButtonLink href="/methode" variant="ghost" className="mt-8">
                Lire la méthode complète
              </ButtonLink>
            )}
          </Reveal>
        </div>

        <ol className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute top-3 bottom-3 left-[11px] w-px bg-line" />
          {methodSteps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.06} className="group relative grid grid-cols-[24px_1fr] gap-6 pb-12 last:pb-0 md:gap-10">
              <span
                aria-hidden
                className="relative z-10 mt-2 block size-[23px] rounded-full border border-ink bg-paper transition-colors duration-500 group-hover:bg-ink group-last:bg-ink"
              />
              <div className="border-b border-line pb-10 group-last:border-0 group-last:pb-0">
                <div className="flex items-baseline gap-4">
                  <span className="t-meta text-muted">{s.n}</span>
                  <h3 className="t-h2">{s.title}</h3>
                </div>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-2">{s.text}</p>
                <p className="t-meta mt-4 text-muted">{s.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
