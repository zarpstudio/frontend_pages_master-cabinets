/**
 * blog-static-params — /blog/[slug] generateStaticParams slug walk
 * ================================================================
 * Runs on the Node built-in test runner (no test framework dependency):
 *
 *   pnpm test
 *
 * The public CMS list endpoint clamps `limit` to 50 and reports `totalPages`
 * for that page size. generateStaticParams used to read page 1 only, so every
 * article past the 50th was never prerendered and rendered on demand, exposed
 * to CMS 429/5xx at request time. The fake CMS below reproduces the clamp, so
 * a page-1-only walk fails these tests exactly the way production did.
 */

import { strict as assert } from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";

// Explicit `.ts` specifier: Node's ESM resolver does not guess extensions.
// `tsconfig.json` excludes the test files, so this never reaches tsc.
import {
  CMS_MAX_PAGE_SIZE,
  MAX_LIST_PAGES,
  getAllArticleSlugs,
  type ArticlePageFetcher,
} from "../blog-static-params.ts";
import type { BlogArticleSummary, PaginatedArticles } from "../../types/blog.type.ts";

/** Same clamp as backend public-blog.controller.ts: `Math.min(limit, 50)`. */
const SERVER_LIMIT_CAP = 50;

interface Call {
  page: number;
  limit: number;
}

function article(slug: string): BlogArticleSummary {
  return {
    id: `id-${slug}`,
    title: slug,
    language: "en_us",
    slug,
    content: "",
    published_at: "2026-09-01T12:00:00.000Z",
    display_order: 0,
    author: null,
  };
}

function slugList(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `post-${String(i + 1).padStart(3, "0")}`);
}

/**
 * A fake CMS list endpoint over `slugs`, with the real server's limit clamp.
 * It records every call and the peak number of calls in flight at once.
 */
function fakeCms(slugs: string[]) {
  const calls: Call[] = [];
  let inFlight = 0;
  let peakInFlight = 0;

  const fetchPage: ArticlePageFetcher = async (page, limit) => {
    calls.push({ page, limit });
    inFlight++;
    peakInFlight = Math.max(peakInFlight, inFlight);
    await new Promise((resolve) => setTimeout(resolve, 2));
    inFlight--;

    const size = Math.min(limit, SERVER_LIMIT_CAP);
    const totalPages = Math.ceil(slugs.length / size);
    const pageSlugs = slugs.slice((page - 1) * size, page * size);
    return {
      data: pageSlugs.map(article),
      meta: { page, limit: size, total: slugs.length, total_pages: totalPages, totalPages },
    } satisfies PaginatedArticles;
  };

  return {
    fetchPage,
    calls,
    get peakInFlight() {
      return peakInFlight;
    },
  };
}

const realWarn = console.warn;
beforeEach(() => {
  console.warn = () => {};
});
afterEach(() => {
  console.warn = realWarn;
});

describe("getAllArticleSlugs: walks every CMS page", () => {
  it("returns all 77 slugs when the CMS clamps pages to 50 (the production shape)", async () => {
    const published = slugList(77);
    const cms = fakeCms(published);

    const slugs = await getAllArticleSlugs(cms.fetchPage);

    assert.deepEqual(slugs, published);
    assert.deepEqual(cms.calls, [
      { page: 1, limit: 50 },
      { page: 2, limit: 50 },
    ]);
  });

  it("asks for the largest page the CMS serves, so the call count is ceil(N / 50)", async () => {
    assert.equal(CMS_MAX_PAGE_SIZE, SERVER_LIMIT_CAP);
    const cms = fakeCms(slugList(151));

    const slugs = await getAllArticleSlugs(cms.fetchPage);

    assert.equal(slugs.length, 151);
    assert.equal(cms.calls.length, 4);
    assert.ok(cms.calls.every((call) => call.limit === 50));
  });

  it("never has two list requests in flight (paced, not a parallel burst)", async () => {
    const cms = fakeCms(slugList(260));

    await getAllArticleSlugs(cms.fetchPage);

    assert.equal(cms.calls.length, 6);
    assert.equal(cms.peakInFlight, 1);
  });

  it("stops after one call when everything fits on page 1", async () => {
    const cms = fakeCms(slugList(12));

    assert.equal((await getAllArticleSlugs(cms.fetchPage)).length, 12);
    assert.equal(cms.calls.length, 1);
  });

  it("stops after one call for an empty blog", async () => {
    const cms = fakeCms([]);

    assert.deepEqual(await getAllArticleSlugs(cms.fetchPage), []);
    assert.equal(cms.calls.length, 1);
  });
});

describe("getAllArticleSlugs: hostile or shifting CMS answers", () => {
  it("de-duplicates a slug repeated across pages (a publish shifted the offsets mid-walk)", async () => {
    const fetchPage: ArticlePageFetcher = async (page) => {
      const data = page === 1 ? ["a", "b", "c"] : ["c", "d"];
      return {
        data: data.map(article),
        meta: { page, limit: 50, total: 5, total_pages: 2, totalPages: 2 },
      };
    };

    assert.deepEqual(await getAllArticleSlugs(fetchPage), ["a", "b", "c", "d"]);
  });

  it("drops articles without a slug instead of emitting an empty param", async () => {
    const fetchPage: ArticlePageFetcher = async (page) => ({
      data: [article("a"), article(""), article("b")],
      meta: { page, limit: 50, total: 3, total_pages: 1, totalPages: 1 },
    });

    assert.deepEqual(await getAllArticleSlugs(fetchPage), ["a", "b"]);
  });

  it("reads the snake_case total_pages when totalPages is absent", async () => {
    const cms = fakeCms(slugList(77));
    const snakeOnly: ArticlePageFetcher = async (page, limit) => {
      const result = await cms.fetchPage(page, limit);
      const { totalPages: _omit, ...meta } = result.meta;
      return { ...result, meta };
    };

    assert.equal((await getAllArticleSlugs(snakeOnly)).length, 77);
  });

  it("stops at an empty page even if totalPages claims more", async () => {
    const calls: number[] = [];
    const fetchPage: ArticlePageFetcher = async (page) => {
      calls.push(page);
      const data = page === 1 ? [article("a")] : [];
      return { data, meta: { page, limit: 50, total: 1, total_pages: 999, totalPages: 999 } };
    };

    assert.deepEqual(await getAllArticleSlugs(fetchPage), ["a"]);
    assert.deepEqual(calls, [1, 2]);
  });

  it("caps the walk at MAX_LIST_PAGES when totalPages never ends", async () => {
    let calls = 0;
    const fetchPage: ArticlePageFetcher = async (page) => {
      calls++;
      return {
        data: [article(`p${page}`)],
        meta: { page, limit: 50, total: 1e9, total_pages: 1e9, totalPages: 1e9 },
      };
    };

    const slugs = await getAllArticleSlugs(fetchPage);

    assert.equal(calls, MAX_LIST_PAGES);
    assert.equal(slugs.length, MAX_LIST_PAGES);
  });
});

describe("getAllArticleSlugs: CMS failures", () => {
  it("rethrows a page-1 failure so generateStaticParams keeps its on-demand fallback", async () => {
    const fetchPage: ArticlePageFetcher = async () => {
      throw new Error("Failed to fetch articles: Too Many Requests");
    };

    await assert.rejects(getAllArticleSlugs(fetchPage), /Too Many Requests/);
  });

  it("keeps page-1 slugs when a later page fails (never worse than the old page-1-only walk)", async () => {
    const cms = fakeCms(slugList(77));
    const fetchPage: ArticlePageFetcher = async (page, limit) => {
      if (page === 2) throw new Error("Failed to fetch articles: Bad Gateway");
      return cms.fetchPage(page, limit);
    };

    const slugs = await getAllArticleSlugs(fetchPage);

    assert.deepEqual(slugs, slugList(50));
  });
});
