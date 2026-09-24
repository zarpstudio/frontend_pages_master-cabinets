import { cache } from "react";
import type { Metadata } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/blog-api";
import { BUILD_CMS_CALL_INTERVAL_MS, createPacer } from "@/lib/build-cms-pacer";
import { getAllArticleSlugs } from "@/lib/blog-static-params";
import { ArticleDetail } from "@/presentation/components/organisms/blog/article-detail";
import { BlogReadingProgress } from "@/presentation/components/organisms/blog/blog-reading-progress";
import {
  getPrimaryBlogImage,
  resolveArticleDescription,
} from "@/lib/blog-content";
import PricingCTASection from "@/presentation/components/organisms/home-page-sections/mc/PricingCTASection";
import { COMPANY_NAME } from "@/constants/business-info";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// At build time, space every CMS call from this route (see build-cms-pacer.ts).
// At runtime (ISR revalidation, on-demand renders) calls go straight through.
const isBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
const paceBuildCall = createPacer(BUILD_CMS_CALL_INTERVAL_MS);

// generateMetadata and the page share one render, so `cache` gives them one
// paced call per slug. Returns and throws exactly like getArticleBySlug, so
// its null / throw contract (blog-api.ts) reaches the page unchanged.
const loadArticle = cache((slug: string) =>
  isBuild ? paceBuildCall(() => getArticleBySlug(slug)) : getArticleBySlug(slug),
);

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    return {
      title: `Article Not Found | ${COMPANY_NAME}`,
    };
  }

  const primaryImage = getPrimaryBlogImage(article.images);
  const description = resolveArticleDescription(article);

  return {
    title: `${article.title} | ${COMPANY_NAME} Blog`,
    description,
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      publishedTime: article.published_at,
      authors: article.author ? [article.author.full_name] : undefined,
      images: primaryImage ? [{ url: primaryImage.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: primaryImage ? [primaryImage.url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    notFound();
  }

  const primaryImage = getPrimaryBlogImage(article.images);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    datePublished: article.published_at,
    dateModified: article.updated_at ?? article.published_at,
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.full_name,
        }
      : undefined,
    image: primaryImage ? primaryImage.url : undefined,
    publisher: {
      "@type": "Organization",
      name: COMPANY_NAME,
    },
  };

  return (
    <>
      <BlogReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen w-full bg-white pb-10 pt-[92px] sm:pt-[104px] lg:pt-[120px]">
        <div className="mx-auto w-full max-w-[1364px] px-4 pb-24 sm:px-8 lg:px-16">
          <ArticleDetail article={article} />
        </div>
        <PricingCTASection showPillars={false} />
      </main>
    </>
  );
}

export async function generateStaticParams() {
  try {
    // Walks every CMS list page: the API clamps `limit` to 50, so reading
    // page 1 alone prerendered only the 50 newest articles. Only ever runs
    // at build time, so every list call is paced.
    const slugs = await getAllArticleSlugs((page, limit) =>
      paceBuildCall(() => getArticles(page, limit)),
    );
    return slugs.map((slug) => ({ slug }));
  } catch {
    // API may be unavailable during build (e.g. missing auth).
    // Return empty so pages are generated on-demand via ISR.
    return [];
  }
}
