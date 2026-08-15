import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/posts";
import { REPORTS } from "@/lib/reports";
import { SITE_URL } from "@/lib/site";

// Mirrors the old hand-maintained sitemap.xml (same pages, same priorities)
// but generates itself — new blog posts appear via lib/posts.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    ...POSTS.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.dateISO),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/algo`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/research`, changeFrequency: "weekly", priority: 0.7 },
    ...REPORTS.map((r) => ({
      url: `${SITE_URL}/research/${r.ticker.toLowerCase()}`,
      lastModified: new Date(r.asOf),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/gold-start`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.7 },
    // /unsubscribe stays out — it is noindex and nobody arrives at it by search.
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
