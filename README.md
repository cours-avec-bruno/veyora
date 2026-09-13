# VEYORA

**Voyager plus loin. Dépenser moins. Polluer moins.**

Maquette front-end de Veyora, marque média + boutique de guides de voyage numériques (PDF).
Le compte social (TikTok / Instagram) sert d'acquisition ; ce site transforme l'audience en clients.

> Prototype : paiement, comptes, newsletter et formulaire de contact sont **simulés**. Aucune donnée n'est envoyée.

## Lancer le projet

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # export statique dans out/ (39 pages)
```

## Déploiement — GitHub Pages

Le site est entièrement statique (`output: "export"`).
Le workflow `.github/workflows/deploy-pages.yml` construit et publie à chaque push sur `main`.

1. Repo → **Settings → Pages → Source : « GitHub Actions »** (une seule fois).
2. Push sur `main` (ou Actions → *Deploy to GitHub Pages* → *Run workflow*).
3. Site : `https://cours-avec-bruno.github.io/veyora/`

Détails techniques :
- `NEXT_PUBLIC_BASE_PATH` (`/veyora`) et `NEXT_PUBLIC_SITE_URL` sont injectés par le workflow ; vides en local.
- Pas de serveur d'images sur Pages : `scripts/optimize-images.mjs` génère des WebP en 6 largeurs
  (`public/images/_opt/`, non versionné) et `src/lib/image-loader.ts` choisit la bonne taille.
- `scripts/flatten-rsc.mjs` (postbuild) duplique les fichiers de préchargement RSC sous le nom attendu
  par le routeur client — sans lui, la navigation fonctionne mais génère des 404 sur un hébergeur de fichiers.
- Domaine perso plus tard : ajouter `public/CNAME`, retirer `NEXT_PUBLIC_BASE_PATH` du workflow.

## Stack

- **Next.js 16** (App Router, pages statiques + `generateStaticParams`) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (tokens dans `@theme`)
- **Motion** (`motion/react`) pour les révélations au scroll, le hero, les pages du guide en éventail
- **Lucide** pour l'iconographie (+ 2 glyphes SVG TikTok / Instagram)
- Polices via `next/font` : **Instrument Serif** (titres), **Geist** (interface), **Geist Mono** (données, labels)

## Pages

| Route | Rôle |
| --- | --- |
| `/` | Accueil : hero, principes, destinations, collection, guide vedette, aperçu PDF, chiffres, méthode, social, manifeste, newsletter |
| `/guides` | Boutique avec filtres (destination, budget, durée, type, transport) synchronisés dans l'URL + tri |
| `/guides/[slug]` | Page produit : achat, preuve de valeur, aperçu des pages, budget détaillé, itinéraire, FAQ, barre d'achat mobile |
| `/destinations` | Index comparatif + fiches destinations |
| `/destinations/[slug]` | Destination : faits clés, pourquoi partir, comment y aller sans voiture, guide lié |
| `/journal`, `/journal/[slug]` | Magazine : article à la une, secondaires, lecture |
| `/a-propos` | Manifeste |
| `/methode` | Méthode et critères |
| `/contact` | Formulaire (simulé) |
| `/panier` | Panier + checkout simulé (panier persisté en `localStorage`) |
| `/legal/[slug]` | Mentions légales, CGV, confidentialité, crédits photo |

Parcours de conversion visé : **TikTok → accueil ou destination → guide → aperçu → achat**.
CTA flottant sur mobile (accueil, destinations) et barre d'achat collante sur les pages produit.

## Architecture

```
src/
  app/            routes (pages), sitemap.ts, robots.ts, icon.svg
  sections/home/  sections de la page d'accueil (réutilisées ailleurs)
  components/
    ui/           Button, Primitives (Eyebrow, SectionHeader, Badge, PriceTag, BudgetMeter), Brand (Wordmark, RouteLine), Motion, JsonLd
    layout/       Navbar (+ MobileDock), Footer, PageHero/Breadcrumb, CartProvider
    cards/        GuideCard, DestinationCard, ArticleCard, SocialCard
    guide/        GuideCover, GuidePages (mockups PDF), GuideSpread, PageSlider, BudgetBreakdown, BuyButton
    icons/        pictogrammes transport, TikTok, Instagram
  data/           guides, destinations, articles, social, method, site, photos (+ crédits)
  lib/format.ts   prix, budgets, dates (fr-FR)
  styles/         globals.css — design tokens et classes typographiques
public/images/    photographies (licence Unsplash)
```

Aucune donnée n'est codée dans les composants : tout vient de `src/data`. Chaque budget de guide est
décomposé (transport / logement / nourriture / activités) et la somme correspond au total affiché.

## Design system

- **Couleurs** : papier `#F4F0E8`, encre `#161614`, forêt `#26332B`, mousse, sauge, terre cuite `#B4532E` (accent rationné), soleil (très rare).
- **Typographie** : échelle `t-mega`, `t-display`, `t-h1…t-h3`, `t-lead`, `t-label` (mono capitales), `t-meta` (mono chiffres tabulaires), `t-num` (chiffres serif).
- **Rayons** quasi carrés (2–4 px, « objet imprimé »), boutons en pilule.
- **Ombres** chaudes : `shadow-paper`, `shadow-book`, `shadow-lift`.
- **Motifs de marque** : ligne de trajet (départ ○ — arrivée ●), coordonnées, numéros de section, jauge de budget, couvertures de guide dessinées en CSS (unités de conteneur).
- **Micro-interactions** : soulignement animé, zoom photo 1.03, couvertures qui pivotent légèrement, flèches de boutons qui glissent, compteurs, pages PDF en éventail au scroll. `prefers-reduced-motion` respecté.

## SEO & accessibilité

Metadata par page (title, description, canonical, Open Graph), JSON-LD (Organization, Product, BreadcrumbList,
Article, TouristDestination), `sitemap.xml`, `robots.txt`. Lien d'évitement, focus visibles, textes alternatifs,
structure sémantique, contrastes AA sur le texte courant.

## À faire avant la mise en ligne

- Remplacer les comptes sociaux (`src/data/social.ts`) et le domaine (`src/data/site.ts`) par les vrais.
- Brancher un prestataire de paiement (ex. Stripe Checkout) et la livraison du PDF.
- Brancher l'outil newsletter et le formulaire de contact.
- Compléter les mentions légales / CGV avec les informations de l'entreprise.
- Remplacer les contenus d'exemple (prix, horaires, adresses) par les données vérifiées de chaque guide.

Photographies : voir `/legal/credits` (licence Unsplash).
