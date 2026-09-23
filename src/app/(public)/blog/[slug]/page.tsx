import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/blog-api";
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

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

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
  const article = await getArticleBySlug(slug);

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
    const { data: articles } = await getArticles(1, 100);
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch {
    // API may be unavailable during build (e.g. missing auth).
    // Return empty so pages are generated on-demand via ISR.
    return [];
  }
}
