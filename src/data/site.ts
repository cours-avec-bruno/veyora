export const site = {
  name: "Veyora",
  // Absolute URL of the deployed site (includes the GitHub Pages sub-path when set).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://veyora.fr",
  tagline: "Voyager plus loin. Dépenser moins. Polluer moins.",
  description:
    "Guides de voyage numériques pour partir plus loin, dépenser moins et polluer moins : itinéraires testés, budgets transparents, transports sans voiture.",
  email: "bonjour@veyora.fr",
  locale: "fr_FR",
};

export const mainNav = [
  { href: "/destinations", label: "Destinations" },
  { href: "/guides", label: "Guides" },
  { href: "/journal", label: "Journal" },
  { href: "/methode", label: "Notre méthode" },
  { href: "/impact", label: "Impact" },
];

export const footerNav = [
  {
    title: "Explorer",
    links: [
      { href: "/destinations", label: "Destinations" },
      { href: "/guides", label: "Guides" },
      { href: "/journal", label: "Journal" },
    ],
  },
  {
    title: "Veyora",
    links: [
      { href: "/methode", label: "Notre méthode" },
      { href: "/impact", label: "L'impact" },
      { href: "/a-propos", label: "À propos" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export const legalNav = [
  { href: "/legal/mentions-legales", label: "Mentions légales" },
  { href: "/legal/cgv", label: "CGV" },
  { href: "/legal/confidentialite", label: "Politique de confidentialité" },
  { href: "/legal/credits", label: "Crédits photo" },
];
