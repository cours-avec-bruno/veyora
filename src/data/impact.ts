/**
 * Position de Veyora sur l'impact des transports, et les ordres de grandeur
 * qui la fondent.
 *
 * Règle éditoriale : aucun chiffre à la décimale, aucun ratio « X fois moins »
 * présenté comme une mesure. Les facteurs d'émission dépendent du mix
 * électrique, du taux de remplissage et de la méthode de calcul ; selon les
 * sources, le TGV est donné entre 2 et 3,5 g et l'avion court-courrier entre
 * 125 et 260 g. On publie donc des fourchettes, et on dit d'où elles viennent.
 */

export type ImpactMode = {
  label: string;
  /** Fourchette publiée, en g CO₂e par voyageur·kilomètre */
  range: string;
  /** Valeur représentative, utilisée pour la longueur des barres uniquement */
  bar: number;
  note: string;
  tone: "rail" | "road" | "air";
};

/** Ordres de grandeur en contexte français. Voir `impactSources`. */
export const impactModes: ImpactMode[] = [
  { label: "TGV", range: "≈ 2 – 3 g", bar: 3, note: "Électricité bas carbone, taux de remplissage élevé", tone: "rail" },
  { label: "Intercités", range: "≈ 8 g", bar: 8, note: "Lignes classiques, dont les trains de nuit", tone: "rail" },
  { label: "TER", range: "≈ 30 g", bar: 30, note: "Rames plus légères, remplissage plus faible", tone: "rail" },
  { label: "Autocar longue distance", range: "≈ 30 – 60 g", bar: 45, note: "Très dépendant du remplissage", tone: "road" },
  { label: "Voiture thermique, seul", range: "≈ 190 – 220 g", bar: 205, note: "Divisé d'autant qu'on est de passagers", tone: "road" },
  { label: "Avion court ou moyen-courrier", range: "≈ 230 – 260 g", bar: 245, note: "Hors effets non-CO₂, qui alourdissent le bilan", tone: "air" },
];

export const impactPosition = {
  eyebrow: "Notre position",
  title: "Le train quand il gagne.\nLe reste quand il perd.",
  lead:
    "Veyora ne cherche pas le voyage le moins émetteur possible. Il cherche le meilleur équilibre entre prix, temps, confort, expérience et impact — et il l'assume quand cet équilibre penche ailleurs que vers le rail.",
  rules: [
    {
      n: "01",
      title: "Quand le train fonctionne bien, la question ne se pose pas",
      text: "Sur les liaisons de nos guides, il est plus rapide de centre à centre, moins cher réservé tôt, et sans transfert d'aéroport. L'argument climatique arrive en dernier — il n'en a pas besoin.",
    },
    {
      n: "02",
      title: "Quand la voiture est plus logique, on le dit",
      text: "Un massif mal desservi, un groupe, des horaires impossibles. Prétendre l'inverse ferait perdre du temps au lecteur, et ne sauverait pas un gramme.",
    },
    {
      n: "03",
      title: "Quand l'avion est nécessaire, on ne le cache pas",
      text: "Certaines destinations ne se rejoignent pas raisonnablement autrement. Nous les signalons plutôt que de les enjoliver — ou nous ne les mettons pas dans un guide.",
    },
  ],
};

/** Ce que l'exigence change concrètement dans les guides. */
export const impactCommitments = [
  {
    value: "Sans avion",
    label: "critère d'entrée de chaque destination",
    note: "Une destination qui ne se rejoint pas raisonnablement sans avion ne rentre pas dans un volume.",
  },
  {
    value: "★★★★★",
    label: "une note « sans voiture » par destination",
    note: "Elle mesure ce qu'on peut faire à pied, à vélo et en transport local une fois sur place.",
  },
  {
    value: "≈",
    label: "des ordres de grandeur, jamais de fausse précision",
    note: "Pas de « ce trajet pollue 4,37 fois moins ». Les hypothèses comptent autant que le résultat.",
  },
  {
    value: "1",
    label: "un bon compromis énoncé par destination",
    note: "Train + vélo plutôt que location de voiture. Mai plutôt qu'août. Et pourquoi.",
  },
];

export const impactCaveats = {
  title: "Ce que ces chiffres ne disent pas",
  items: [
    "Ils dépendent du mix électrique du pays traversé : le même TGV n'a pas le même bilan en France et en Pologne.",
    "Ils dépendent du taux de remplissage. Un autocar à moitié vide et une voiture à cinq passagers changent de camp.",
    "Le calcul de l'avion varie selon qu'on inclut ou non les effets non-CO₂ — traînées de condensation, oxydes d'azote — qui peuvent doubler l'impact réel.",
    "Sur un voyage court, le trajet aller-retour pèse presque toujours plus lourd que tout le séjour réuni. C'est là que se joue l'essentiel, pas sur le tri des déchets à l'hôtel.",
  ],
};

export const impactSources = {
  note: "Ordres de grandeur en contexte français, à jour de septembre 2026. Les facteurs d'émission évoluent : vérifiez-les au moment de votre voyage.",
  list: [
    { label: "ADEME — Base Empreinte et calculateur d'impact des trajets", href: "https://agirpourlatransition.ademe.fr/particuliers/evaluer-son-impact/calculer-empreinte-carbone/calculer-emissions-carbone-trajets" },
    { label: "SNCF Voyageurs — méthode de calcul de l'empreinte carbone", href: "https://www.sncf-voyageurs.com/fr/decouvrez-notre-entreprise/rse-et-transitions/le-calcul-de-lempreinte-carbone-des-transports/" },
  ],
};
