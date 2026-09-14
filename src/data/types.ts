import type { PhotoKey } from "./photos";

export type TransportMode = "train" | "nuit" | "bus" | "marche" | "velo" | "bateau";

export type CoverTone = "forest" | "ink" | "clay" | "paper" | "moss";

export type Logistics = "Facile" | "Modérée" | "Soutenue";

export type TripType = "Nature" | "City trip" | "Côte" | "Randonnée";

export type BudgetBreakdown = {
  transport: number;
  logement: number;
  nourriture: number;
  activites: number;
};

export type Move = {
  mode: TransportMode;
  label: string;
  duration: string;
  cost: string;
};

export type GuideDay = {
  day: number;
  title: string;
  route: string;
  moves: Move[];
  highlights: string[];
  spend: number;
};

export type Address = {
  name: string;
  kind: "Dormir" | "Manger" | "Voir" | "Café";
  place: string;
  price: string;
  note: string;
};

/**
 * A volume of the "Veyora Guides" collection — the thing that is sold.
 *
 * The itinerary-level fields further down (`days`, `budget`, `route`,
 * `itinerary`, `budgetBreakdown`, `addresses`…) describe the *sample escapade*
 * printed in the previews, named by `sample`. They are not the whole guide.
 */
export type Guide = {
  slug: string;
  /** "01", "02"… — the collection number, also the sort order */
  volume: string;
  kind: "Collection" | "Guide régional";
  /** What the volume is for, in one word + one line */
  intent: { word: string; line: string };
  /** The escapade shown in previews, e.g. "Slovénie" */
  sample: string;
  destinationSlug: string;
  title: string;
  subtitle: string;
  /** Brand promise, one sentence */
  promise: string;
  /** Cover typography. `numeral` switches to the large-number layout */
  coverTitle: string[];
  coverNumeral?: string;
  tagline: string;
  /** Short scope shown on cards: "10 destinations", "France · Alpes · Italie du Nord" */
  scope: string;
  area: string;
  count: { value: number; label: string };
  /** A few place names — never the full list */
  places: string[];
  contents: string[];
  format: string;
  duration: string;
  price: number;
  budget: number;
  days: number;
  transport: string;
  modes: TransportMode[];
  noCar: boolean;
  logistics: Logistics;
  types: TripType[];
  season: string;
  pages: number;
  maps: number;
  addressesCount: number;
  tone: CoverTone;
  cover: PhotoKey;
  gallery: PhotoKey[];
  gateway: string;
  coords: string;
  route: string[];
  summary: string;
  budgetBreakdown: BudgetBreakdown;
  itinerary: GuideDay[];
  addresses: Address[];
  updated: string;
  featured?: boolean;
};

export type Destination = {
  slug: string;
  name: string;
  city: string;
  region: string;
  tagline: string;
  intro: string;
  budget: number;
  days: number;
  transport: string;
  modes: TransportMode[];
  season: string;
  difficulty: Logistics;
  types: TripType[];
  coords: string;
  image: PhotoKey;
  secondaryImage: PhotoKey;
  guideSlug: string;
  why: { title: string; text: string }[];
  access: { from: string; how: string; time: string; cost: string }[];
};

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "figures"; items: { value: string; label: string }[] }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Transport" | "Budget" | "Destinations" | "Méthode";
  readTime: number;
  date: string;
  image: PhotoKey;
  author: string;
  body: ArticleBlock[];
  relatedGuide?: string;
};

export type SocialPost = {
  id: string;
  platform: "TikTok" | "Instagram";
  title: string;
  duration: string;
  views: string;
  image: PhotoKey;
  hook: string;
};
