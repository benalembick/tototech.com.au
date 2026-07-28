import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
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
    url: `${site.domain}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
