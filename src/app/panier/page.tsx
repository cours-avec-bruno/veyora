import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Checkout } from "./Checkout";

export const metadata: Metadata = {
  title: "Panier",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        index="—"
        eyebrow="Commande"
        title="Votre panier"
        crumbs={[{ href: "/guides", label: "Guides" }, { label: "Panier" }]}
        className="md:pb-12"
      />
      <section className="container-v pb-24 md:pb-32">
        <Checkout />
      </section>
    </>
  );
}
