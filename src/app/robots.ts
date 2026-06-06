import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/uploads/"],
      },
      {
        // Allow Googlebot unrestricted access for maximum indexing
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://biolabsresearch-healix.com/sitemap.xml",
    host: "https://biolabsresearch-healix.com",
  };
}
