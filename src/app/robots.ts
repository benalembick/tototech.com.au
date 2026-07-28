import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content-data";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
