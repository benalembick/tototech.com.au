import type { MetadataRoute } from "next";
import siteData from "@/content/site.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/industries",
    "/projects",
    "/about",
    "/insights",
    "/contact",
    "/privacy-policy",
  ];

  return routes.map((route) => ({
    url: `${siteData.domain}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
