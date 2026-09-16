import {
  SITE_URL,
  COMPANY_NAME,
  PHONE,
  EMAIL,
  SCHEMA_ADDRESS,
  SCHEMA_GEO,
  SOCIAL_LINKS,
  BUSINESS_HOURS,
} from "@/constants/business-info";

interface JsonLdProps {
  data: Record<string, unknown>;
  id?: string;
}

/**
 * Renders structured data as a native <script> on the server.
 *
 * next/script is built for loading and executing JavaScript: with its default
 * afterInteractive strategy it injects the tag client-side, so the markup was
 * absent from the SSR HTML that crawlers actually read. Next's own JSON-LD
 * guide calls a plain <script> the right tool here. `<` is escaped to keep a
 * string in the data from being able to close the tag.
 */
export const JsonLd = ({ data, id = "json-ld" }: JsonLdProps) => {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
};

// FAQ structured data - dynamically built from FAQ items
interface FAQJsonLdProps {
  faq: ReadonlyArray<{
    question: string;
    answer: string;
  }>;
}

export const FAQJsonLd = ({ faq }: FAQJsonLdProps) => {
  if (!faq || faq.length === 0) return null;

  const validFaq = faq.filter(
    (item) =>
      item.question &&
      item.answer &&
      item.question.trim() !== "" &&
      item.answer.trim() !== "",
  );

  if (validFaq.length === 0) return null;

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaq.map((item) => ({
      "@type": "Question",
      name: item.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.trim(),
      },
    })),
  };

  return <JsonLd data={faqStructuredData} id="faq-json-ld" />;
};

// Organization structured data - replace with your own company details
export const OrganizationJsonLd = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    description: "Master Cabinets LLC is a South Florida custom cabinetry and home remodeling company serving Naples, Bonita Springs, Fort Myers, and surrounding areas. We specialize in custom cabinets, kitchen and bathroom remodeling, flooring, and full home renovations.",
    url: SITE_URL,
    logo: `${SITE_URL}/images/hero/logo.png`,
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.googleMaps,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: PHONE.schema,
      availableLanguage: "English, Spanish",
    },
    address: SCHEMA_ADDRESS,
  };

  return <JsonLd data={organizationData} id="organization-json-ld" />;
};

// Service/product structured data
export const ProductJsonLd = () => {
  const productData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${COMPANY_NAME} | Custom Cabinetry & Remodeling`,
    description: "Custom cabinetry, kitchen & bathroom remodeling, and full interior renovations across Naples and South Florida.",
    url: SITE_URL,
    serviceType: "Custom Cabinetry & Home Remodeling",
    areaServed: {
      "@type": "State",
      name: "Florida",
    },
    provider: {
      "@type": "LocalBusiness",
      name: COMPANY_NAME,
      telephone: PHONE.schema,
      email: EMAIL,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      ratingCount: "28",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Master Cabinets Services",
      itemListElement: [
        "Custom Kitchen Cabinets",
        "Bathroom Vanity & Remodeling",
        "Custom Closets & Storage",
        "Residential Flooring & Carpentry",
      ],
    },
  };

  return <JsonLd data={productData} id="product-json-ld" />;
};

// Breadcrumb structured data — dynamically built from breadcrumb items
export const BreadcrumbJsonLd = ({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) => {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={breadcrumbData} id="breadcrumb-json-ld" />;
};

// Review/testimonials structured data
export const ReviewJsonLd = () => {
  const reviewData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${COMPANY_NAME} - Custom Cabinetry & Home Remodeling`,
    telephone: PHONE.schema,
    email: EMAIL,
    url: SITE_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      ratingCount: "28",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Carlos M.",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody: "Master Cabinets transformed our kitchen completely. The craftsmanship is outstanding, every cabinet fits perfectly and the finish is flawless.",
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Elena R.",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody: "The tile work and vanity installation in our master bath was immaculate. Highly recommend their team for any custom remodel.",
      },
    ],
  };

  return <JsonLd data={reviewData} id="review-json-ld" />;
};
