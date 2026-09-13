import type { SocialPost } from "./types";

export const socialPosts: SocialPost[] = [
  {
    id: "milan-30",
    platform: "TikTok",
    title: "Comment aller à Milan pour moins de 30 €",
    hook: "Le billet existe. Il faut juste savoir quand le chercher.",
    duration: "0:48",
    views: "412 k",
    image: "milan-tram",
  },
  {
    id: "lyon-3",
    platform: "Instagram",
    title: "3 destinations en train depuis Lyon",
    hook: "Sans correspondance compliquée.",
    duration: "0:36",
    views: "96 k",
    image: "platform-gold",
  },
  {
    id: "alpes-moins-cher",
    platform: "TikTok",
    title: "Le voyage le moins cher pour voir les Alpes",
    hook: "Spoiler : ce n'est pas en Suisse.",
    duration: "1:02",
    views: "1,2 M",
    image: "train-leaning",
  },
  {
    id: "trop-cher",
    platform: "TikTok",
    title: "Pourquoi tout le monde paie trop cher son voyage",
    hook: "Trois erreurs, toujours les mêmes.",
    duration: "0:54",
    views: "638 k",
    image: "map-hand",
  },
  {
    id: "bohinj",
    platform: "Instagram",
    title: "Le lac que tout le monde oublie en Slovénie",
    hook: "À 40 minutes de Bled.",
    duration: "0:29",
    views: "184 k",
    image: "slovenie-lake",
  },
];

export const socialHandles = {
  tiktok: { handle: "@veyora", url: "https://www.tiktok.com/@veyora" },
  instagram: { handle: "@veyora.travel", url: "https://www.instagram.com/veyora.travel" },
};
