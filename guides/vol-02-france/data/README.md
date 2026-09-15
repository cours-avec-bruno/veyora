# Contenu éditorial — non versionné

Le dépôt est public et le volume est vendu. Les fichiers qui portent le texte
du guide restent donc hors du dépôt (voir `.gitignore` à la racine) :

| Fichier | Ce qu'il exporte |
| --- | --- |
| `meta.mjs` | `meta`, `opening`, `manifesto`, `responsible`, `checklist`, `bag`, `closing`, `nextVolumes`, `sourcesNote` |
| `dest-a.mjs` … `dest-d.mjs` | chacun un tableau `part` de destinations |
| `editorial.mjs` | `profiles`, `awards`, `journeys`, `fieldNotes`, `comparisonNote` |

Sont versionnés : `destinations.mjs` (qui réassemble les quatre parties dans
l'ordre du volume) et `photo-picks.mjs` (la sélection iconographique, qui ne
contient aucun texte du guide).

## Forme d'une destination

```js
{
  n: "01", name: "ANNECY", subname: undefined,
  region: "FRANCE / ALPES", coords: "45.899 / 6.129",
  days: "3 JOURS", kind: "Lac & montagne",
  lede: "…",                       // une phrase, sur l'ouverture
  why: ["…", "…", "…"],            // 100 à 180 mots au total
  perfectFor: ["Nature", "Vélo"],
  budget: { total: "220 – 320 €", basis: "…", lines: [{ label, value }] },
  trip:   { from: [{ city, time, mode }], choice, icon, why, warning? },
  ratings:{ trajet, budget, nature, culture, sansVoiture },  // 1 à 5
  things: [{ n, kind, title, text }],                        // exactement 3
  tip: "…",
  addresses: [{ icon, name, area, price, why }],             // 3 à 5
  taste:  { items: […], where: "…" },
  local: "…", avoid: "…",
  season: { spring, summer, autumn, winter, pick, why },
  compromise: { do, rather, why },
  crossSell: "…" | null,
  photos: { hero: "annecy-hero", secondary: ["annecy-2", "annecy-3"] },
}
```

Le texte de référence du VOL. 02 est conservé hors dépôt, avec le PDF produit.
