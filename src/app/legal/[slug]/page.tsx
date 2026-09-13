import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPhotos } from "@/data/photos";
import { site } from "@/data/site";
import { PageHero } from "@/components/layout/PageHero";

const pages: Record<string, { title: string; intro: string; sections: [string, string][] }> = {
  "mentions-legales": {
    title: "Mentions légales",
    intro: "Informations relatives à l'éditeur du site. Maquette : les informations ci-dessous sont à compléter avant mise en ligne.",
    sections: [
      ["Éditeur", `Veyora — [forme juridique, capital, RCS, adresse à compléter]. Contact : ${site.email}.`],
      ["Directeur de la publication", "[Nom à compléter]."],
      ["Hébergement", "[Hébergeur, adresse et téléphone à compléter]."],
      ["Propriété intellectuelle", "Les textes, guides, cartes et éléments graphiques sont la propriété de Veyora. Les photographies sont utilisées sous licence Unsplash (voir Crédits photo)."],
    ],
  },
  cgv: {
    title: "Conditions générales de vente",
    intro: "Conditions applicables à l'achat de guides numériques sur veyora.fr. Maquette à faire valider juridiquement.",
    sections: [
      ["Produits", "Guides de voyage au format PDF, livrés par téléchargement immédiat après paiement."],
      ["Prix", "Les prix sont indiqués en euros, toutes taxes comprises. Aucune promotion temporaire artificielle n'est pratiquée."],
      ["Droit de rétractation", "Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement avec l'accord exprès de l'acheteur. [À adapter selon la politique commerciale retenue.]"],
      ["Mises à jour", "Les acheteurs reçoivent gratuitement les nouvelles versions du guide acheté."],
      ["Usage", "Les guides sont destinés à un usage personnel. Toute redistribution est interdite."],
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    intro: "Nous collectons le minimum nécessaire, et nous ne vendons aucune donnée.",
    sections: [
      ["Données collectées", "Adresse email (commande, newsletter), nom et message (formulaire de contact). Données de paiement traitées exclusivement par le prestataire de paiement."],
      ["Finalités", "Livrer les guides, envoyer les mises à jour, répondre aux messages, et envoyer la newsletter si vous l'avez demandée."],
      ["Durée", "Les données de commande sont conservées selon les obligations comptables ; l'abonnement newsletter jusqu'à désinscription."],
      ["Vos droits", `Accès, rectification, suppression, portabilité : écrivez à ${site.email}.`],
      ["Cookies", "Aucun cookie publicitaire. Le panier est stocké localement dans votre navigateur."],
    ],
  },
};

const slugs = [...Object.keys(pages), "credits"];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const title = slug === "credits" ? "Crédits photo" : pages[slug]?.title;
  return title ? { title, robots: { index: slug !== "credits" } } : {};
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;

  if (slug === "credits") {
    return (
      <>
        <PageHero index="—" eyebrow="Informations" title="Crédits photo" crumbs={[{ href: "/", label: "Accueil" }, { label: "Crédits photo" }]} lead="Toutes les photographies du site sont publiées sous licence Unsplash. Merci à leurs auteurs." />
        <section className="container-v pb-28">
          <ul className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {allPhotos.map((p) => (
              <li key={p.key} className="border-b border-line py-4 pr-6">
                <p className="text-[0.95rem]">{p.alt}</p>
                <a href={`https://unsplash.com/@${p.username}`} target="_blank" rel="noopener noreferrer" className="link-u t-meta mt-1 inline-block text-muted">
                  {p.author} · Unsplash
                </a>
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  }

  const page = pages[slug];
  if (!page) notFound();

  return (
    <>
      <PageHero index="—" eyebrow="Informations" title={page.title} crumbs={[{ href: "/", label: "Accueil" }, { label: page.title }]} lead={page.intro} />
      <section className="container-v pb-28">
        <div className="mx-auto max-w-3xl border-t border-ink">
          {page.sections.map(([h, t]) => (
            <div key={h} className="grid gap-3 border-b border-line py-8 md:grid-cols-[14rem_1fr] md:gap-10">
              <h2 className="t-label pt-1 text-muted">{h}</h2>
              <p className="leading-relaxed text-ink-2">{t}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
