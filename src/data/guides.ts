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
    places: ["Ljubljana", "Porto", "Gand", "Bologne", "Budapest"],
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
    pages: 49,
    maps: 1,
    addressesCount: 30,
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
    slug: "france",
    volume: "02",
    kind: "Guide régional",
    intent: { word: "Proximité", line: "Pour partir loin sans prendre l'avion." },
    sample: "Annecy",
    destinationSlug: "",
    title: "France",
    subtitle: "10 escapades pour découvrir la France autrement",
    promise:
      "Dix destinations françaises choisies pour tenir debout sans voiture : trois jours, un budget, un trajet en train et le compromis que nous aurions choisi à votre place.",
    coverTitle: ["France"],
    tagline: "10 escapades pour voyager autrement.",
    scope: "10 destinations · France",
    area: "France",
    count: { value: 10, label: "destinations" },
    places: ["Annecy", "Strasbourg", "Saint-Malo", "Île de Ré", "Pays basque", "Briançon"],
    contents: [
      "10 destinations, 5 pages chacune",
      "Budget décomposé et ordre de grandeur",
      "Le trajet depuis trois grandes villes",
      "Le tip Veyora, un par destination",
      "Adresses : institutions vérifiables uniquement",
      "Comparatif, profils de voyage et dix trajets",
    ],
    format: "PDF numérique",
    duration: "Escapades de 2 à 4 jours",
    price: 25,
    budget: 240,
    days: 3,
    transport: "Train sur les dix destinations",
    modes: ["train", "nuit", "velo", "marche"],
    noCar: true,
    logistics: "Facile",
    types: ["City trip", "Nature", "Randonnée", "Côte"],
    season: "Printemps à automne",
    pages: 69,
    maps: 11,
    addressesCount: 40,
    tone: "ink",
    cover: "coast-path",
    gallery: ["epernay", "sleeper", "coast-stairs", "hiker-moor"],
    gateway: "TGV, Intercités et train de nuit depuis Paris, Lyon et les grandes villes",
    coords: "46.60° N · 2.35° E",
    route: ["Annecy", "Rive ouest", "Semnoz", "Annecy"],
    summary:
      "Des Alpes à l'Atlantique, de la chaîne des Puys à l'étang de Thau : dix destinations françaises où le train est pertinent dix fois sur dix. Chacune donne son budget, son trajet, sa saison, ses trois expériences et son bon compromis — l'arbitrage entre prix, temps, confort et impact.",
    budgetBreakdown: { transport: 50, logement: 120, nourriture: 70, activites: 30 },
    itinerary: [
      {
        day: 1,
        title: "Annecy, la vieille ville et les canaux",
        route: "Gare → vieille ville → Pâquier",
        moves: [
          { mode: "train", label: "Arrivée gare d'Annecy, à 300 m du lac", duration: "—", cost: "selon départ" },
          { mode: "marche", label: "Rue Sainte-Claire et les canaux", duration: "1 h 30", cost: "0 €" },
        ],
        highlights: [
          "Marché de la vieille ville le mardi, 7 h – 13 h",
          "Baignade gratuite aux Marquisats, à pied du centre",
          "Fin de journée sur le Pâquier, face à la Tournette",
        ],
        spend: 62,
      },
      {
        day: 2,
        title: "Le tour du lac à vélo",
        route: "Annecy → Doussard → Menthon → Annecy",
        moves: [
          { mode: "velo", label: "Voie verte de la rive ouest", duration: "2 h", cost: "Location ≈ 20 €" },
          { mode: "velo", label: "Retour par la rive est", duration: "1 h 30", cost: "—" },
        ],
        highlights: [
          "Partir vers 8 h : la voie verte sature après 11 h",
          "≈ 40 km, 200 m de dénivelé, accessible à tous",
          "Déjeuner à l'extrémité sud du lac",
        ],
        spend: 74,
      },
      {
        day: 3,
        title: "La montagne depuis la ville",
        route: "Annecy → Semnoz → Annecy",
        moves: [
          { mode: "bus", label: "Navette du Semnoz (l'été)", duration: "40 min", cost: "≈ 5 €" },
          { mode: "marche", label: "Crêtes du Semnoz, 1 699 m", duration: "2 h", cost: "0 €" },
        ],
        highlights: ["Le massif du Mont-Blanc en face", "Retour à pied possible par la forêt", "Train du soir depuis la gare"],
        spend: 58,
      },
    ],
    addresses: [
      { name: "Marché de la vieille ville", kind: "Manger", place: "Rue Sainte-Claire, Annecy", price: "€", note: "Mardi, vendredi, dimanche — le mardi est le jour alimentaire" },
      { name: "Les Halles de Bayonne", kind: "Manger", place: "Quais de la Nive, Bayonne", price: "€", note: "L'institution gastronomique de la côte basque" },
      { name: "Halle gourmande Saint-Pierre", kind: "Manger", place: "Clermont-Ferrand", price: "€", note: "Lundi au samedi, 7 h – 19 h — les cinq AOP fromagères d'Auvergne" },
      { name: "Marché de la Halle au Blé", kind: "Voir", place: "Intra-muros, Saint-Malo", price: "€", note: "Mardi et vendredi, sous une verrière de 1822" },
    ],
    updated: "Mis à jour en septembre 2026",
  },
  {
    slug: "italie-du-nord",
    volume: "03",
    kind: "Guide régional",
    intent: { word: "Exploration", line: "Pour explorer une région en profondeur." },
    sample: "Italie du Nord",
    destinationSlug: "italie-du-nord",
    title: "Italie du Nord",
    subtitle: "Lacs, villes et Alpes, reliés en train.",
    promise:
      "Du Piémont à la Vénétie, des itinéraires construits autour du train direct depuis la France, avec les meilleurs compromis entre transport, budget et expérience.",
    coverTitle: ["Italie", "du Nord"],
    tagline: "Des lacs aux Dolomites, en train.",
    scope: "Piémont · Lacs · Vénétie",
    area: "Italie du Nord",
    count: { value: 5, label: "régions" },
    places: ["Piémont", "Lombardie", "Lacs", "Ligurie", "Vénétie"],
    contents: [
      "Itinéraires détaillés",
      "Trains régionaux et directs",
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
    transport: "Train + bateau",
    modes: ["train", "bateau", "marche"],
    noCar: true,
    logistics: "Facile",
    types: ["City trip", "Nature", "Randonnée"],
    season: "Avril → Octobre",
    pages: 72,
    maps: 8,
    addressesCount: 48,
    tone: "ink",
    cover: "varenna",
    gallery: ["varenna", "milan-tram", "como-stairs", "dolomites"],
    gateway: "Frecciarossa direct depuis Paris ou Lyon",
    coords: "46.01° N · 9.28° E",
    route: ["Milan", "Varenna", "Bergame", "Vérone"],
    summary:
      "Milan, le lac de Côme côté village, Bergame la haute, Vérone et les Dolomites. Tout se relie en trains régionaux à moins de 10 €, et les lacs se traversent en bateau public. Chaque étape a son budget, son trajet et son plan B.",
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

/** Numbers reserved for the next volumes, shown on the shelf as "À venir" (no title, no price). Empty for now. */
export const upcomingVolumes: string[] = [];

export const collectionLabel = (volume: string) => `Veyora Guides / ${volume}`;

export const guideBudgetIsConsistent = (g: Guide) =>
  Object.values(g.budgetBreakdown).reduce((a, b) => a + b, 0) === g.budget;

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

export const featuredGuide = guides.find((g) => g.featured) ?? guides[0];

export const guideForDestination = (destinationSlug: string) =>
  guides.find((g) => g.destinationSlug === destinationSlug);
