import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /plan is the private finance app (also gated by middleware + noindex
    // metadata) — keep crawlers away on every layer.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/plan", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
