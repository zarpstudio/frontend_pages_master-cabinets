import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/business-info";
import { getArticles } from "@/lib/blog-api";

export const runtime = "nodejs";
export const revalidate = 86400;

const SITE_BASE = SITE_URL.replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_BASE,
      lastModified: new Date("2026-08-24"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_BASE}/gallery`,
      lastModified: new Date("2026-08-24"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_BASE}/about`,
      lastModified: new Date("2026-08-24"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_BASE}/contact`,
      lastModified: new Date("2026-08-24"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_BASE}/blog`,
      lastModified: new Date("2026-08-24"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_BASE}/reviews`,
      lastModified: new Date("2026-08-24"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_BASE}/privacy-policy`,
      lastModified: new Date("2026-04-06"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_BASE}/terms-of-use`,
      lastModified: new Date("2026-04-06"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Blog posts - fetched from API at revalidation time.
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await getArticles(1, 200);
    blogPages = articles.map((article) => ({
      url: `${SITE_BASE}/blog/${article.slug}`,
      lastModified: new Date(article.published_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // API unavailable during build - blog entries included on next revalidation
  }

  return [...staticPages, ...blogPages];
}
