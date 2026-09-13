import { ButtonLink } from "@/components/ui/Button";
import { RouteLine } from "@/components/ui/Brand";

export default function NotFound() {
  return (
    <section className="container-v flex min-h-[80svh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="t-label text-muted">Erreur 404 · 00.00° N · 00.00° E</p>
      <h1 className="t-display mt-6 max-w-[14ch] text-balance">
        Cette page a raté <em>sa correspondance.</em>
      </h1>
      <RouteLine stops={["Vous", "?", "Veyora"]} className="mt-12 max-w-md" />
      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/guides" variant="ghost" icon="none">Voir les guides</ButtonLink>
      </div>
    </section>
  );
}
