# VEYORA GUIDES / VOL. 02 — FRANCE

Chaîne de fabrication du deuxième volume : *10 escapades pour voyager autrement*.
69 pages A4, produites en HTML/CSS puis rendues par Chromium.

```bash
node src/build.mjs              # données → HTML → PDF → compression
node src/build.mjs --html-only  # HTML seul, pour itérer vite sur la maquette
```

Sortie : `out/veyora-vol-02-france.pdf` (non versionné — voir plus bas).

## Organisation

```
DESIGN-PHILOSOPHY.md      « Ligne Claire » — la loi visuelle du volume
data/
  meta.mjs                couverture, ouverture, manifeste, annexes, sources
  dest-a…d.mjs            les dix destinations, découpées en quatre fichiers
  destinations.mjs        les réassemble dans l'ordre du volume
  editorial.mjs           profils, distinctions, trajets, field notes
  photo-picks.mjs         la sélection iconographique, arrêtée à l'œil
src/
  styles.css              système de mise en page print (A4, grille, échelle typo)
  render.mjs              couverture, ouverture, sommaire, manifeste, carte, index
  render-dest.mjs         les cinq pages d'une destination
  render-back.mjs         comparatif, profils, top, trajets, annexes
  france-map.mjs          contour de la France et projection des coordonnées
  build.mjs               assemblage, rendu Chromium, compression
  fetch-candidates.mjs    candidats photo par catégorie Wikimedia Commons
  contact.mjs             planches-contact, pour choisir à l'œil
  apply-picks.mjs         télécharge la sélection et écrit les crédits
  optimize-photos.mjs     réduit les originaux au format utile à l'impression
  compress-pdf.py         réencode en JPEG les bitmaps embarqués par Chromium
assets/
  fonts/                  Instrument Serif · Instrument Sans · Geist Mono (OFL)
  photos/                 originaux téléchargés (non versionnés)
  print/                  versions réduites utilisées par la maquette
  credits.json            auteur, licence et page d'origine de chaque image
```

## Structure du volume

Couverture · ouverture · sommaire · manifeste (double) · carte · index —
puis dix destinations de cinq pages chacune : ouverture pleine page,
« Pourquoi ici ? », « Trois choses à faire » et le tip, le pratique
(budget, trajet, saison), les adresses et le bon compromis.
Puis le comparatif, les profils, le Top Veyora, les dix trajets,
l'approche transports, les checklists, la suite de la collection,
les sources, les crédits et la page de fin.

## Conventions éditoriales

- `≈` signale un ordre de grandeur, jamais une valeur contractuelle.
- Les budgets valent pour 3 jours / 2 nuits, par personne, hors haute saison.
- Seules les **institutions vérifiables** sont nommées (halles, marchés, gares,
  sentiers, sites). Aucun établissement privé n'est inventé : les tables sont
  recommandées par type et par quartier.
- Les notations en étoiles sont éditoriales et présentées comme telles.
- Aucun chiffre d'impact carbone à la décimale — uniquement des ordres de grandeur.

## Photographies

La banque retenue pour la collection est **Unsplash** — celle du VOL. 01 :
licence commerciale, attribution non obligatoire (nous créditons quand même).

```bash
UNSPLASH_ACCESS_KEY=xxx node src/source-unsplash.mjs   # les 31 images
node src/optimize-photos.mjs && node src/build.mjs
```

La clé se crée gratuitement sur <https://unsplash.com/developers>. Le mode
démo est limité à 50 requêtes par heure, ce qui suffit largement.

Les images déjà présentes dans `assets/photos/` sont conservées : effacez
celles que vous voulez remplacer, ou déposez-y vos propres fichiers sous le
nom de clé attendu (`annecy-hero.jpg`, `annecy-2.jpg`, …) — le reste suit.

La première édition a été montée avec Wikimedia Commons, en CC0 et CC BY
uniquement (`src/fetch-candidates.mjs`, `src/contact.mjs`,
`src/apply-picks.mjs`). Ces scripts restent utilisables, mais sous licence
non-ShareAlike Commons ne contient pas assez de photographie de voyage de
niveau magazine : c'est le seul point où le volume n'atteignait pas le niveau
du VOL. 01.

## Ce qui n'est pas versionné

Le dépôt est public et le volume est vendu 25 €. Restent donc hors du dépôt :

- `out/` — le PDF produit ;
- `assets/photos/`, `assets/print/`, `assets/candidates/` — les médias ;
- `data/meta.mjs`, `data/dest-*.mjs`, `data/editorial.mjs` — **le texte du
  guide**. Voir `data/README.md` pour la forme attendue de ces fichiers.

La chaîne est donc publiable telle quelle, mais elle ne construit rien sans
les fichiers de contenu, qui sont conservés avec le PDF.
