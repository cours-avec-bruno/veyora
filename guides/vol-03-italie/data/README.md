# Contenu éditorial — non versionné

Le dépôt est public et le volume est vendu. Les fichiers qui portent le texte
du guide restent donc hors du dépôt (voir `.gitignore` à la racine) :

| Fichier | Ce qu'il exporte |
| --- | --- |
| `meta.mjs` | `meta`, `manifesto`, `howToUse`, `trainPage`, `network`, `responsible`, `checklist`, `closing`, `nextVolumes`, `sourcesNote` |
| `dest-a.mjs` … `dest-d.mjs` | chacun un tableau `part` de destinations |
| `editorial.mjs` | `profiles`, `awards`, `comparisonNote`, `scoreNote` |

Sont versionnés : `destinations.mjs` (qui réassemble les quatre parties dans
l'ordre du volume) et `photo-picks.mjs` (la sélection iconographique, qui ne
contient aucun texte du guide).

## Forme d'une destination

```js
{
  n: "01", name: "TURIN", subname: undefined,
  region: "PIÉMONT / NORD-OUEST", coords: "45.070 / 7.687",
  days: "3 JOURS", style: "Gastronomie · Architecture · Culture",
  pages: 4,                        // 3 ou 4 — décide de la composition
  lede: "…",                       // une phrase, sur l'ouverture
  why: ["…", "…", "…"],            // 100 à 180 mots au total
  perfectFor: ["Nature", "Vélo"],
  budget: { total: "220 – 320 €", basis: "…", lines: [{ label, value }] },
  access: { from: [{ city, time, cost, mode }], choice, why, warning? },
  fieldNote: { n, title, text } | absent,
  ratings:{ budget, accessibilite, culture, gastronomie, nature, sansVoiture },
  score: "4,6",                    // score éditorial, une décimale
  moments:[{ n, kind, title, text }],                        // exactement 3
  day:    [{ time, label }],                                 // un rythme, pas un programme
  tip: "…",
  addresses: [{ icon, name, area, price, why }],             // 3 à 5
  taste:  { items: […], where: "…" },
  local: "…", avoid: "…",
  season: { spring, summer, autumn, winter, pick, why },
  compromise: { do, rather, why },
  crossSell: "…" | null,
  photos: { hero: "turin-hero", secondary: ["turin-2", "turin-3"] },
}
```

Le texte de référence du VOL. 03 est conservé hors dépôt, avec le PDF produit.
