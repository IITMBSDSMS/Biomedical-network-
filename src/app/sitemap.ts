import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://biomedical-network.vercel.app";

  const routes: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/researchers", priority: 0.9, changeFreq: "daily" },
    { path: "/publications", priority: 0.9, changeFreq: "daily" },
    { path: "/projects", priority: 0.9, changeFreq: "daily" },
    { path: "/fellowships", priority: 0.9, changeFreq: "weekly" },
    { path: "/chapters", priority: 0.8, changeFreq: "weekly" },
    { path: "/opportunities", priority: 0.8, changeFreq: "weekly" },
    { path: "/about", priority: 0.8, changeFreq: "monthly" },
    { path: "/contact", priority: 0.7, changeFreq: "monthly" },
    { path: "/gallery", priority: 0.7, changeFreq: "weekly" },
    { path: "/training", priority: 0.7, changeFreq: "weekly" },
    { path: "/login", priority: 0.6, changeFreq: "monthly" },
    { path: "/indexing/google-scholar", priority: 0.6, changeFreq: "monthly" },
    { path: "/indexing/researchgate", priority: 0.6, changeFreq: "monthly" },
    { path: "/indexing/orcid", priority: 0.6, changeFreq: "monthly" },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));
}
