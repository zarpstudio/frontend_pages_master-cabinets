import { JsonLd } from "./json-ld";
import {
  SITE_URL,
  COMPANY_NAME,
  PHONE,
  EMAIL,
  SCHEMA_ADDRESS,
  SCHEMA_GEO,
  BUSINESS_HOURS,
  SOCIAL_LINKS,
} from "@/constants/business-info";

// Article structured data
export const ArticleJsonLd = () => {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${COMPANY_NAME}: Custom Cabinetry & Remodeling Guides`,
    description: "Expert remodeling guides, design tips, and material advice from Master Cabinets LLC in Naples, Florida.",
    image: [
      `${SITE_URL}/images/og-default.jpg`,
    ],
    author: {
      "@type": "Organization",
      name: COMPANY_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/mc-logo.svg`,
      },
    },
    datePublished: "2026-08-24",
    dateModified: "2026-08-24",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog`,
    },
    keywords: [
      "Master Cabinets",
      "custom cabinetry",
      "kitchen remodeling Naples FL",
      "bathroom renovations South Florida",
      "custom closets Naples",
      "cabinet installation Florida",
      "home remodeling",
    ],
    articleSection: "Home Remodeling & Design",
    inLanguage: "en-US",
  };

  return <JsonLd data={articleData} id="article-json-ld" />;
};

// Local business structured data - Master Cabinets LLC
export const LocalBusinessJsonLd = () => {
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: COMPANY_NAME,
    legalName: "Master Cabinets LLC",
    description: "Master Cabinets LLC provides custom cabinetry, kitchen and bathroom remodeling, flooring, painting, and full home renovations across Southwest Florida and the Miami area.",
    url: SITE_URL,
    telephone: PHONE.schema,
    email: EMAIL,
    address: SCHEMA_ADDRESS,
    geo: SCHEMA_GEO,
    openingHours: BUSINESS_HOURS.schema,
    foundingDate: "1999",
    priceRange: "$$$",
    paymentAccepted: "Cash, Check, Credit Card, Financing Available",
    currenciesAccepted: "USD",
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.googleMaps,
    ],
    areaServed: [
      { "@type": "City", name: "Naples" },
      { "@type": "City", name: "Bonita Springs" },
      { "@type": "City", name: "Fort Myers" },
      { "@type": "City", name: "Estero" },
      { "@type": "City", name: "Marco Island" },
      { "@type": "City", name: "Lehigh Acres" },
      { "@type": "City", name: "Miami" },
      { "@type": "City", name: "Parkland" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Master Cabinets Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Cabinetry",
            description: "Fully custom cabinet design and fabrication for kitchens, bathrooms, and living spaces throughout Southwest Florida.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Kitchen Remodeling",
            description: "Complete kitchen renovations including custom cabinets, countertops, backsplash, and appliance integration.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bathroom Remodeling",
            description: "Full bathroom renovations with custom vanities, tile work, fixtures, and custom storage solutions.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Flooring Installation",
            description: "Professional installation of hardwood, tile, laminate, and luxury vinyl flooring throughout South Florida homes.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Painting & Finishing",
            description: "Interior and exterior painting services with premium finishes for residential and commercial properties.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Closet & Storage Systems",
            description: "Custom closet design and built-in storage solutions for bedrooms, garages, and living areas.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Home Renovations",
            description: "Full home renovation and remodeling services for residential properties in Naples and surrounding areas.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Countertop Installation",
            description: "Custom countertop fabrication and installation including granite, quartz, marble, and solid surface materials.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial Cabinetry",
            description: "Custom commercial cabinetry and millwork for offices, retail spaces, and commercial properties across South Florida.",
          },
        },
      ],
    },
  };

  return <JsonLd data={localBusinessData} id="local-business-json-ld" />;
};

// Website structured data
export const WebSiteJsonLd = () => {
  const webSiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY_NAME,
    // alternateName should be a DIFFERENT name people might search for (e.g. "Orlando Roofing")
    alternateName: "Master Cabinets LLC",
    url: SITE_URL,
    description: "Custom cabinets, kitchen and bathroom remodeling, flooring, and full home renovations in Southwest Florida.",
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@type": "Organization",
      name: COMPANY_NAME,
    },
    // NOTE: potentialAction/SearchAction removed - only add back if a real /search route exists.
    publisher: {
      "@type": "Organization",
      name: COMPANY_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/hero/logo.png`,
      },
    },
  };

  return <JsonLd data={webSiteData} id="website-json-ld" />;
};
