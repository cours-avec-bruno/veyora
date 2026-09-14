import type { Guide } from "./types";

/**
 * The Veyora Guides collection — deliberately short, grown one volume at a time.
 *
 * To publish a new volume, append an entry with the next `volume` number and
 * remove that number from `upcomingVolumes`. The home section, the shelf, the
 * shop and the product pages all read from here.
 *
 * Itinerary-level fields describe the sample escapade printed in the previews
 * (see `sample`). Budgets: 1 person, sharing a double room, transport from the
 * rail/bus gateway included, prices observed in spring 2026. Each breakdown
 * sums to `budget` — checked in `guideBudgetIsConsistent`.
 */
export const guides: Guide[] = [
  {
    slug: "10-escapades-europe",
    volume: "01",
    kind: "Collection",
    intent: { word: "Inspiration", line: "Pour choisir où partir." },
    sample: "Slovénie",
    destinationSlug: "slovenie",
    title: "10 escapades d'Europe",
    subtitle: "10 destinations européennes sélectionnées pour voyager autrement, sans exploser son budget.",
    promise: "10 destinations. 10 idées de départ. Un seul guide pour trouver la prochaine.",
    coverNumeral: "10",
    coverTitle: ["Escapades", "d'Europe"],
    tagline: "Voyager moins cher. Voyager autrement.",
    scope: "10 destinations",
    area: "Europe",
    count: { value: 10, label: "destinations" },
    places: ["Ljubljana", "Porto", "Milan", "Innsbruck", "Rovinj"],
    contents: [
      "10 destinations",
      "Budgets indicatifs",
      "Transports recommandés",
      "Idées d'itinéraires",
      "Bonnes adresses",
      "Conseils pratiques",
    ],
    format: "PDF numérique",
    duration: "Escapades de 3 à 7 jours",
    price: 23,
    budget: 239,
    days: 4,
    transport: "Train + bus",
    modes: ["train", "bus", "marche"],
    noCar: true,
    logistics: "Facile",
    types: ["Nature", "City trip", "Côte", "Randonnée"],
    season: "Toute l'année, selon la destination",
    pages: 96,
    maps: 10,
    addressesCount: 64,
    tone: "forest",
    cover: "suisse",
    gallery: ["slovenie-bohinj", "ljubljana", "slovenie-lake", "train-window"],
    gateway: "Chaque destination accessible en train, en bus ou en train de nuit depuis la France",
    coords: "46.28° N · 13.89° E",
    route: ["Ljubljana", "Bled", "Bohinj", "Ljubljana"],
    summary:
      "Dix destinations européennes choisies pour ce qu'elles offrent à budget raisonnable : comment y aller sans avion quand c'est possible, combien prévoir, quoi faire en trois à sept jours. Le guide pour ceux qui ne savent pas encore où partir.",
    budgetBreakdown: { transport: 86, logement: 92, nourriture: 38, activites: 23 },
    itinerary: [
      {
        day: 1,
        title: "Ljubljana, à pied",
        route: "Munich → Ljubljana",
        moves: [
          { mode: "train", label: "Munich → Ljubljana (EC)", duration: "6 h 10", cost: "≈ 39 €" },
          { mode: "marche", label: "Gare → vieille ville", duration: "15 min", cost: "0 €" },
        ],
        highlights: [
          "Arcades du marché de Plečnik en fin d'après-midi",
          "Montée au château par le sentier, pas par le funiculaire",
          "Dîner au marché couvert du vendredi",
        ],
        spend: 78,
      },
      {
        day: 2,
        title: "Le tour du lac de Bled",
        route: "Ljubljana → Bled",
        moves: [
          { mode: "bus", label: "Ljubljana → Bled", duration: "1 h 20", cost: "≈ 7 €" },
          { mode: "marche", label: "Tour du lac", duration: "1 h 45", cost: "0 €" },
        ],
        highlights: [
          "Le lac à 7 h, avant les cars",
          "Point de vue d'Ojstrica — 20 min de montée",
          "Gorges de Vintgar : réservation en ligne la veille",
        ],
        spend: 52,
      },
      {
        day: 3,
        title: "Bohinj, le lac tranquille",
        route: "Bled → Bohinj",
        moves: [
          { mode: "bus", label: "Bled → Bohinj Jezero", duration: "40 min", cost: "≈ 4 €" },
          { mode: "marche", label: "Ukanc → cascade Savica", duration: "1 h", cost: "0 €" },
        ],
        highlights: [
          "Baignade côté Ukanc, eau à 20 °C en août",
          "Cascade Savica : 500 marches, 30 min",
          "Si pluie : musée alpin de Stara Fužina",
        ],
        spend: 49,
      },
      {
        day: 4,
        title: "Retour par la vallée",
        route: "Bohinj → Ljubljana → Munich",
        moves: [
          { mode: "bus", label: "Bohinj → Ljubljana", duration: "2 h", cost: "≈ 9 €" },
          { mode: "train", label: "Ljubljana → Munich", duration: "6 h 10", cost: "≈ 29 €" },
        ],
        highlights: [
          "Pique-nique acheté la veille à Bohinjska Bistrica",
          "Arrêt possible à Škofja Loka (1 h)",
          "Place côté gauche : la vallée de la Save",
        ],
        spend: 60,
      },
    ],
    addresses: [
      { name: "Auberge du quartier Trnovo", kind: "Dormir", place: "Ljubljana", price: "dès 34 € / nuit", note: "Calme, 12 min à pied du centre" },
      { name: "Marché couvert du vendredi", kind: "Manger", place: "Ljubljana", price: "8 – 12 €", note: "De mars à octobre" },
      { name: "Chambre d'hôtes à Stara Fužina", kind: "Dormir", place: "Bohinj", price: "dès 28 € / nuit", note: "Petit-déjeuner local inclus" },
      { name: "Gostilna au bord de la Sava", kind: "Manger", place: "Bohinjska Bistrica", price: "11 – 15 €", note: "Truite et štruklji" },
      { name: "Point de vue d'Ojstrica", kind: "Voir", place: "Bled", price: "Gratuit", note: "Mieux que le château, sans billet" },
    ],
    updated: "Mis à jour en mars 2026",
    featured: true,
  },
  {
    slug: "france-italie-du-nord",
    volume: "02",
    kind: "Guide régional",
    intent: { word: "Exploration", line: "Pour organiser un voyage dans une zone précise." },
    sample: "Italie du Nord",
    destinationSlug: "italie-du-nord",
    title: "France & Italie du Nord",
    subtitle: "Des escapades plus proches. Des itinéraires plus précis.",
    promise:
      "Des itinéraires pensés entre France et Italie du Nord, avec les meilleurs compromis entre transport, budget et expérience.",
    coverTitle: ["France", "+ Italie", "du Nord"],
    tagline: "Des escapades plus proches.",
    scope: "France · Alpes · Italie du Nord",
    area: "France · Italie du Nord",
    count: { value: 6, label: "régions" },
    places: ["France", "Alpes", "Piémont", "Lombardie", "Ligurie", "Vénétie"],
    contents: [
      "Itinéraires détaillés",
      "Train, ou voiture si pertinent",
      "Budgets par étape",
      "Cartes par région",
      "Adresses testées",
      "Variantes selon la saison",
    ],
    format: "PDF numérique",
    duration: "Itinéraires de 3 à 7 jours",
    price: 25,
    budget: 310,
    days: 5,
    transport: "Train, voiture si pertinent",
    modes: ["train", "bateau", "marche"],
    noCar: false,
    logistics: "Facile",
    types: ["City trip", "Nature", "Randonnée"],
    season: "Avril → Octobre",
    pages: 72,
    maps: 8,
    addressesCount: 48,
    tone: "paper",
    cover: "varenna",
    gallery: ["varenna", "milan-tram", "como-stairs", "dolomites"],
    gateway: "Frecciarossa direct depuis Paris ou Lyon",
    coords: "46.01° N · 9.28° E",
    route: ["Milan", "Varenna", "Bergame", "Vérone"],
    summary:
      "Des Alpes françaises aux lacs lombards, du Piémont à la Vénétie : des itinéraires plus proches, construits autour du train, avec la voiture seulement là où elle change vraiment le voyage. Chaque étape a son budget, son trajet et son plan B.",
    budgetBreakdown: { transport: 58, logement: 150, nourriture: 72, activites: 30 },
    itinerary: [
      {
        day: 1,
        title: "Milan, un seul quartier",
        route: "Centrale → Brera → Navigli",
        moves: [{ mode: "marche", label: "Brera → Navigli", duration: "40 min", cost: "0 €" }],
        highlights: ["Toits du Duomo par l'escalier", "Aperitivo aux Navigli", "Dormir près de Centrale"],
        spend: 71,
      },
      {
        day: 2,
        title: "Varenna et le lac",
        route: "Milan → Varenna",
        moves: [
          { mode: "train", label: "Milan Centrale → Varenna", duration: "1 h 05", cost: "7,60 €" },
          { mode: "bateau", label: "Varenna → Bellagio", duration: "15 min", cost: "4,60 €" },
        ],
        highlights: ["Sentiero del Viandante vers Bellano", "Baignade à Fiumelatte", "Dernier bateau à 19 h 40"],
        spend: 64,
      },
    ],
    addresses: [
      { name: "Chambre chez l'habitant à Lecco", kind: "Dormir", place: "Lac de Côme", price: "dès 38 € / nuit", note: "Moitié prix de Varenna, 20 min de train" },
    ],
    updated: "Mis à jour en avril 2026",
  },
];

/** Numbers reserved for the next volumes. Shown as "À venir" — no title, no price. */
export const upcomingVolumes = ["03", "04", "05"];

export const collectionLabel = (volume: string) => `Veyora Guides / ${volume}`;

export const guideBudgetIsConsistent = (g: Guide) =>
  Object.values(g.budgetBreakdown).reduce((a, b) => a + b, 0) === g.budget;

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

export const featuredGuide = guides.find((g) => g.featured) ?? guides[0];

export const guideForDestination = (destinationSlug: string) =>
  guides.find((g) => g.destinationSlug === destinationSlug);
