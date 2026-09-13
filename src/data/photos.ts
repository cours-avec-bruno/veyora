import credits from "./photo-credits.json";

/**
 * Every photograph on the site is referenced by key, never by path.
 * Alt text is written for people, not for search engines.
 * All images: Unsplash License — credited on /legal/credits.
 */
const alts = {
  hero: "Voiture de train en bois vide, fenêtres ouvertes sur une vallée alpine",
  "train-lake": "Voyageuse assise près de la fenêtre d'un train longeant un lac de montagne",
  "train-cozy": "Deux voyageurs attablés dans un wagon-restaurant face aux montagnes enneigées",
  "train-leaning": "Voyageuse penchée à la fenêtre d'un train à crémaillère dans l'Oberland bernois",
  suisse: "Voie ferrée serpentant dans les alpages au-dessus d'un lac suisse",
  "slovenie-bohinj": "Pont de pierre et église Saint-Jean-Baptiste au bord du lac de Bohinj",
  "slovenie-lake": "Rive boisée du lac de Bohinj dans une lumière douce",
  ljubljana: "Arcades du marché de Plečnik au bord de la Ljubljanica au crépuscule",
  lisbonne: "Tramway jaune remontant une rue en pente de Lisbonne en fin de journée",
  porto: "Le Douro et les façades de Porto dans la brume dorée du matin",
  "dolomites-hiker": "Randonneur sur un sentier caillouteux face aux sommets des Dolomites",
  dolomites: "Alpage et route du col de Giau sous le Ra Gusela",
  varenna: "Maisons colorées de Varenna au bord du lac de Côme",
  "como-stairs": "Escalier de pierre dans une ruelle d'un village du lac de Côme",
  autriche: "Village tyrolien niché au creux d'une vallée verte",
  "autriche-mood": "Vallée autrichienne dans la brume, forêt et petits villages",
  espagne: "Rocher de Gaztelugatxe dans la brume de la côte basque",
  "coast-path": "Sentier côtier bordé de piquets descendant vers l'océan",
  croatie: "Baie de Rabac en Istrie, bateaux au mouillage dans l'eau calme",
  "rovinj-street": "Ruelle de pierre et volets verts dans la vieille ville de Rovinj",
  "suisse-mood": "Nuages bas dans la vallée de Lauterbrunnen, chalets dans l'herbe",
  ecosse: "Rivière et chemin au fond du Glen Etive dans les Highlands",
  "ecosse-wall": "Muret de pierres sèches et collines rousses des Highlands",
  "train-table": "Compartiment de train vide, table face à la campagne",
  "train-window": "Fenêtre de train ouverte sur des collines verdoyantes",
  epernay: "Panneau de la gare d'Épernay sur un quai ensoleillé",
  "platform-gold": "Quai de gare dans la lumière rasante du soir, voyageurs près du train",
  "milan-tram": "Tramway historique 1878 dans une rue de Milan",
  "milan-arch": "Passant à vélo sous une arche d'immeuble à Milan",
  "lyon-funi": "Funiculaire rouge au-dessus d'une ruelle du Vieux Lyon",
  "lyon-bridge": "Pont de pierre et immeubles haussmanniens sur les quais de Lyon",
  "hiker-moor": "Randonneur marchant seul sur un chemin de lande vers les montagnes",
  "hiker-forest": "Marcheur en veste orange descendant un sentier forestier",
  cafe: "Chaises de terrasse en rotin devant un café européen",
  "map-light": "Carte topographique dépliée sous une lumière de fin d'après-midi",
  "map-hand": "Main annotant un carnet devant une carte",
  sleeper: "Voyageuse endormie près de la fenêtre d'un train de nuit",
  "coast-stairs": "Escalier de pierre en lacets sur la falaise de Gaztelugatxe",
  cabo: "Sentier et barrière de bois au-dessus de l'Atlantique, Cabo da Roca",
} as const;

export type PhotoKey = keyof typeof alts;

export type Photo = {
  key: PhotoKey;
  src: string;
  alt: string;
  width: number;
  height: number;
  author: string;
  username: string;
};

type Credit = { author: string; username: string; file: { width: number; height: number } };
const creditMap = credits as Record<string, Credit>;

export function photo(key: PhotoKey): Photo {
  const c = creditMap[key];
  return {
    key,
    src: `/images/${key}.jpg`,
    alt: alts[key],
    width: c.file.width,
    height: c.file.height,
    author: c.author,
    username: c.username,
  };
}

export const allPhotos = (Object.keys(alts) as PhotoKey[]).map(photo);
