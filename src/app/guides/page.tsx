import type { Metadata } from "next";
import { Suspense } from "react";
import { guides } from "@/data/guides";
import { PageHero } from "@/components/layout/PageHero";
import { GuidesBrowser } from "./GuidesBrowser";
import { Newsletter } from "@/sections/home/Newsletter";

export const metadata: Metadata = {
  title: "Tous les guides",
  description:
    "Guides de voyage PDF Veyora : itinéraires sans voiture, budgets détaillés et adresses testées. Slovénie, Portugal, Italie du Nord, Écosse…",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const min = Math.min(...guides.map((g) => g.price));
  return (
    <>
      <PageHero
        index="—"
        eyebrow="La boutique"
        title={"Tous les guides\nVeyora"}
        crumbs={[{ href: "/", label: "Accueil" }, { label: "Guides" }]}
        lead="Des voyages prêts à vivre, pensés pour coûter moins cher et avoir plus de sens."
        aside={
          <dl className="grid grid-cols-3 gap-4 border-t border-ink pt-4">
            <div>
              <dt className="t-label text-muted">Guides</dt>
              <dd className="t-num mt-2 text-4xl">{guides.length}</dd>
            </div>
            <div>
              <dt className="t-label text-muted">Dès</dt>
              <dd className="t-num mt-2 text-4xl">{min.toFixed(2).replace(".", ",")}€</dd>
            </div>
            <div>
              <dt className="t-label text-muted">Voiture</dt>
              <dd className="t-num mt-2 text-4xl">0</dd>
            </div>
          </dl>
        }
      />
      <Suspense fallback={<div className="container-v h-96" />}>
        <GuidesBrowser />
      </Suspense>
      <div className="border-t border-line">
        <Newsletter index="—" />
      </div>
    </>
  );
}
