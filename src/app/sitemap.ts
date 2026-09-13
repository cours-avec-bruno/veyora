import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { guides } from "@/data/guides";
import { destinations } from "@/data/destinations";
import { articles } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-09-13");
  const staticRoutes = ["", "/guides", "/destinations", "/journal", "/methode", "/a-propos", "/contact"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...staticRoutes,
    ...guides.map((g) => ({ url: `${site.url}/guides/${g.slug}`, lastModified: now, priority: 0.9 })),
    ...destinations.map((d) => ({ url: `${site.url}/destinations/${d.slug}`, lastModified: now, priority: 0.8 })),
    ...articles.map((a) => ({ url: `${site.url}/journal/${a.slug}`, lastModified: new Date(a.date), priority: 0.6 })),
  ];
}
