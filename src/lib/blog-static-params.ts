import type { PaginatedArticles } from "@/types/blog.type";

/**
 * The public CMS list endpoint silently clamps `limit` to 50
 * (`Math.min(limit, 50)` in backend public-blog.controller.ts). Asking for
 * more returns 50 rows and a `totalPages` computed for 50, so a caller that
 * reads only page 1 sees at most 50 articles.
 */
export const CMS_MAX_PAGE_SIZE = 50;

/**
 * Hard stop for a CMS that reports a bogus `totalPages`: 40 x 50 = 2,000
 * articles, far above any tenant today, and still only 40 build-time calls.
 */
export const MAX_LIST_PAGES = 40;

export type ArticlePageFetcher = (
  page: number,
  limit: number,
) => Promise<PaginatedArticles>;

/**
 * Collect the slug of every published article by walking the paginated CMS
 * list until `meta.totalPages`.
 *
 * Built for `generateStaticParams`, which runs at build time against a
 * rate-limited CMS (see build-cms-pacer.ts). So it:
 * - uses the largest page the CMS serves (50), i.e. ceil(N / 50) list calls;
 * - awaits each page before requesting the next (never a parallel burst);
 * - de-duplicates, because a publish during the walk shifts offsets and can
 *   repeat a slug across two pages.
 *
 * Failure policy: a page-1 failure throws (the caller decides the fallback).
 * A later page failing keeps what was already collected. The missing articles
 * then render on demand (ISR), which is what happened to every article past
 * the 50th before this helper existed, so it never makes the result worse.
 */
export async function getAllArticleSlugs(
  fetchPage: ArticlePageFetcher,
): Promise<string[]> {
  const slugs = new Set<string>();

  for (let page = 1; page <= MAX_LIST_PAGES; page++) {
    let result: PaginatedArticles;
    try {
      result = await fetchPage(page, CMS_MAX_PAGE_SIZE);
    } catch (error) {
      if (page === 1) throw error;
      console.warn(
        `[Blog static params] CMS list page ${page} failed; prerendering the ${slugs.size} slugs collected so far, the rest render on demand.`,
        error,
      );
      break;
    }

    for (const article of result.data) {
      if (article.slug) slugs.add(article.slug);
    }

    const totalPages = result.meta.totalPages ?? result.meta.total_pages;
    if (result.data.length === 0 || page >= totalPages) break;
  }

  return [...slugs];
}
