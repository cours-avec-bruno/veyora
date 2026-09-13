import type { Metadata } from "next";
import { Mail, Clock, Newspaper } from "lucide-react";
import { site } from "@/data/site";
import { socialHandles } from "@/data/social";
import { PageHero } from "@/components/layout/PageHero";
import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur un guide, une destination à proposer ou un partenariat : écrivez à la rédaction Veyora.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="—"
        eyebrow="Contact"
        title={"Écrivez-nous.\nOn lit tout."}
        crumbs={[{ href: "/", label: "Accueil" }, { label: "Contact" }]}
        lead="Une question avant d'acheter, une erreur repérée dans un guide, une destination qu'on devrait tester : la rédaction répond elle-même."
      />
      <section className="container-v grid gap-16 border-t border-ink pt-14 pb-24 md:pb-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
          {[
            { Icon: Mail, t: "Email", d: <a href={`mailto:${site.email}`} className="link-u-static">{site.email}</a> },
            { Icon: Clock, t: "Délai de réponse", d: "Sous 48 h ouvrées" },
            { Icon: Newspaper, t: "Presse & partenariats", d: "Nous n'acceptons aucun placement dans les guides." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="flex gap-4 border-b border-line pb-8">
              <Icon className="mt-1 size-5 shrink-0 text-forest" strokeWidth={1.4} />
              <div>
                <p className="t-label text-muted">{t}</p>
                <p className="mt-2 text-[1.05rem]">{d}</p>
              </div>
            </div>
          ))}
          <div>
            <p className="t-label text-muted">Ou en commentaire</p>
            <div className="mt-4 flex flex-col gap-3">
              <a href={socialHandles.tiktok.url} target="_blank" rel="noopener noreferrer" className="link-u inline-flex w-fit items-center gap-3"><TikTokIcon className="size-4" /> {socialHandles.tiktok.handle}</a>
              <a href={socialHandles.instagram.url} target="_blank" rel="noopener noreferrer" className="link-u inline-flex w-fit items-center gap-3"><InstagramIcon className="size-4" /> {socialHandles.instagram.handle}</a>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
