# VEYORA GUIDES / VOL. 03 — ITALIE

Chaîne de fabrication du troisième volume : *10 escapades à vivre autrement*.
52 pages A4, produites en HTML/CSS puis rendues par Chromium.

```bash
node src/build.mjs              # données → HTML → PDF → compression
node src/build.mjs --html-only  # HTML seul, pour itérer vite sur la maquette
```

Sortie : `out/veyora-vol-03-italie.pdf` (non versionné — voir plus bas).

## Ce qui change par rapport au VOL. 02

La chaîne est la même ; trois choses diffèrent.

**Le rythme des fiches.** Six destinations tiennent en quatre pages, quatre en
trois. Ce n'est pas une économie : une destination dont le sujet est plus court
reçoit une composition différente, où l'ouverture porte aussi le « pourquoi ».
C'est ce qui donne sa respiration au volume.

**Les modules.** Le VOL. 03 ajoute le score Veyora, la journée type, les
corridors ferroviaires, les combinaisons de destinations et une page de mode
d'emploi. `src/italy-map.mjs` remplace la carte de France : trois tracés —
péninsule, Sicile, Sardaigne — projetés depuis les coordonnées réelles.

**Le ton.** Plus sensoriel, terre cuite un demi-ton plus présent. Voir
`DESIGN-PHILOSOPHY.md`.

## Organisation

```
DESIGN-PHILOSOPHY.md      « Terre Cuite » — la loi visuelle du volume
data/
  meta.mjs                manifeste, mode d'emploi, corridors, réseau, annexes
  dest-a…d.mjs            les dix destinations, découpées en quatre fichiers
  destinations.mjs        les réassemble dans l'ordre du volume
  editorial.mjs           profils, distinctions, notes de score
  photo-picks.mjs         la sélection iconographique, arrêtée à l'œil
src/
  styles.css              système de mise en page print (A4, grille, échelle typo)
  render.mjs              couverture, manifeste, mode d'emploi, carte, index
  render-dest.mjs         les trois ou quatre pages d'une destination
  render-back.mjs         comparatif, profils, top, corridors, réseau, annexes
  italy-map.mjs           contour du pays et projection des coordonnées
  build.mjs               assemblage, rendu Chromium, compression
  fetch-candidates.mjs    candidats photo par catégorie Wikimedia Commons
  contact.mjs · megasheet.mjs   planches-contact, pour choisir à l'œil
  apply-picks.mjs         télécharge la sélection et écrit les crédits
  source-unsplash.mjs     sourcing sur clé API Unsplash
  optimize-photos.mjs     réduit les originaux au format utile à l'impression
  compress-pdf.py         allège les bitmaps embarqués par Chromium
assets/
  fonts/                  Instrument Serif · Instrument Sans · Geist Mono (OFL)
  credits.json            auteur, licence et page d'origine de chaque image
```

## Structure du volume

Couverture · manifeste (double) · mode d'emploi · carte · index — puis dix
destinations — puis le comparatif, les profils, le Top Veyora, les corridors
ferroviaires, les combinaisons, l'approche transports, la checklist, les
sources, les crédits et la page de fin.

## Conventions éditoriales

- `≈` signale un ordre de grandeur, jamais une valeur contractuelle.
- Les budgets valent pour 3 jours / 2 nuits, par personne, hors haute saison —
  Bolzano et Naples sur 4 jours.
- Seules les **institutions vérifiables** sont nommées (marchés, halles, gares,
  sites, quartiers). Aucun établissement privé n'est inventé : les tables sont
  recommandées par type et par quartier.
- Le score Veyora et les étoiles sont éditoriaux et présentés comme tels.
- Aucun chiffre d'impact carbone à la décimale.

## Photographies

```bash
UNSPLASH_ACCESS_KEY=xxx node src/source-unsplash.mjs
node src/optimize-photos.mjs && node src/build.mjs
```

La clé se crée gratuitement sur <https://unsplash.com/developers>. À défaut, la
chaîne Commons (`fetch-candidates` → `megasheet` → `apply-picks`) fonctionne,
restreinte aux licences CC0, domaine public et CC BY — le partage à l'identique
est écarté, il contaminerait un document vendu.

Vous pouvez aussi déposer vos propres fichiers dans `assets/photos/` sous le nom
de clé attendu (`turin-hero.jpg`, `turin-2.jpg`, …) : le reste suit.

## Ce qui n'est pas versionné

Le dépôt est public et le volume est vendu 25 €. Restent donc hors du dépôt :
`out/`, `assets/photos|print|candidates/`, et `data/meta.mjs`,
`data/dest-*.mjs`, `data/editorial.mjs` — le texte du guide. Voir
`data/README.md` pour la forme attendue de ces fichiers.
