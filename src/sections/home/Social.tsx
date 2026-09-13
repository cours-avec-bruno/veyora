import { socialHandles, socialPosts } from "@/data/social";
import { SocialCard } from "@/components/cards/SocialCard";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal, SplitTitle } from "@/components/ui/Motion";
import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { cn } from "@/lib/format";

export function Social() {
  return (
    <section className="section-y overflow-hidden" aria-labelledby="social-title">
      <div className="container-v">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="08">Sur vos écrans</Eyebrow>
            <SplitTitle id="social-title" as="h2" text={"Vous l'avez peut-être\nvu passer."} className="t-display mt-6" />
          </div>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="t-lead text-graphite text-pretty">
              Chaque semaine, une idée de voyage en moins d&apos;une minute. Les meilleures deviennent des guides —
              <span className="text-ink"> c&apos;est vous qui choisissez lesquelles, en commentaire.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={socialHandles.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink pr-5 pl-4 text-paper transition-colors hover:bg-forest"
              >
                <TikTokIcon className="size-4" />
                <span className="text-[0.95rem] font-medium">Voir les vidéos</span>
                <span className="t-meta text-paper/60">{socialHandles.tiktok.handle}</span>
              </a>
              <a
                href={socialHandles.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-3 rounded-full border border-ink/20 pr-5 pl-4 transition-colors hover:border-ink"
              >
                <InstagramIcon className="size-4" />
                <span className="t-meta">{socialHandles.instagram.handle}</span>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="rail -mx-[var(--gutter)] mt-16 gap-3 px-[var(--gutter)] md:mx-0 md:mt-20 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0">
          {socialPosts.map((post, i) => (
            <Reveal
              key={post.id}
              delay={i * 0.08}
              className={cn("w-[62vw] max-w-[17rem] shrink-0 md:w-auto md:max-w-none", i % 2 === 1 && "md:mt-12")}
            >
              <SocialCard post={post} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-4 text-muted" aria-hidden>
          <span className="t-label whitespace-nowrap">Prochaine vidéo · jeudi 18 h</span>
          <span className="h-px flex-1 bg-line" />
          <span className="t-label whitespace-nowrap">« 5 jours en Istrie pour 340 € »</span>
        </div>
      </div>
    </section>
  );
}
