// ---------------------------------------------------------------------------
// GITKEEP: This file is the Single Source of Truth (SSOT) for all business
// identity data used across the project. ALL NAP (Name, Address, Phone),
// URL, geo, social, and branding constants MUST be sourced from here.
//
// DO NOT duplicate this data in other constant files, JSON-LD schemas,
// page components, or config files. Import from this file instead.
// ---------------------------------------------------------------------------

/**
 * Canonical site URL. Used for SEO, JSON-LD, sitemap, robots, Open Graph, etc.
 * Falls back to the production domain when the env var is not set.
 */
function normalizeSiteUrl(url: string): string {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  normalized = normalized.replace(/^http:\/\//i, "https://");
  normalized = normalized.replace(/^https:\/\/mastercabinets\.net/i, "https://www.mastercabinets.net");
  return normalized.replace(/\/+$/, "");
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mastercabinets.net"
);

/** Legal / display company name */
export const COMPANY_NAME = "Master Cabinets" as const;

/** One-liner used in meta descriptions and schema */
export const COMPANY_DESCRIPTION =
  "Premium custom cabinet installation, remodeling, and design services for kitchens, bathrooms, closets, and living spaces in South Florida." as const;

/** Tagline used in the footer and about sections */
export const COMPANY_TAGLINE =
  "Remodeling, Cabinetry, and Everything Between." as const;

// ---------------------------------------------------------------------------
// NAP (Name, Address, Phone)
// ---------------------------------------------------------------------------
// Confirmed against the client's Google Business Profile
// (CID 7209192084505606319). The previous ZIP, 34102, was a template guess.
export const ADDRESS = {
  label: "Master Cabinets LLC",
  street: "6289 Janes Ln",
  fullStreet: "6289 Janes Ln, Naples, FL 34109, US",
  city: "Naples",
  region: "FL",
  postalCode: "34109",
  country: "US",
} as const;

// Taken from the client's Google Business Profile (CID 7209192084505606319).
// The previous pair sat 9.1 km south of the actual listing.
export const GEO = {
  latitude: 26.2225616,
  longitude: -81.7784059,
} as const;

export const PHONE = {
  /** Display format for UI */
  display: "+1 (239) 255-2050",
  /** tel: href format */
  href: "tel:+12392552050",
  /** Raw digits with country code for WhatsApp, etc. */
  raw: "+12392552050",
  /** Schema.org / JSON-LD format */
  schema: "+1-239-255-2050",
} as const;

/**
 * The briefing lists a single number, so the secondary pill points at the same
 * line rather than a second one. Kept as a named export so the call sites do
 * not have to change if the client supplies a real second number later.
 */
export const PHONE_SECONDARY = PHONE;

export const EMAIL = "mastercabinetsllc@gmail.com" as const;

export const BUSINESS_HOURS = {
  display: "Mon-Sun: 8:00 AM - 8:00 PM",
  footerDisplay: "Mon - Sun: 8am - 8pm",
  schema: "Mo-Su 08:00-20:00",
  days: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ] as readonly string[],
  opens: "08:00",
  closes: "20:00",
} as const;

// ---------------------------------------------------------------------------
// Social & Maps
// ---------------------------------------------------------------------------
// Only the profiles the client actually confirmed in the briefing. The
// previous Facebook and WhatsApp entries were placeholders, and the Instagram
// handle was wrong (mastercabinetsllc vs the real master_cabinets_).
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/master_cabinets_",
  googleMaps: "https://maps.app.goo.gl/GAPj9f4XFaRrcZB46",
} as const;

export const GOOGLE_MAPS_EMBED_URL = "" as const;

// ---------------------------------------------------------------------------
// Convenience: Schema.org PostalAddress block (reusable in JSON-LD)
// ---------------------------------------------------------------------------
export const SCHEMA_ADDRESS = {
  "@type": "PostalAddress" as const,
  // streetAddress is intentionally absent while unknown: PostalAddress is valid
  // without it, and a placeholder string is worse than no value.
  ...(ADDRESS.street ? { streetAddress: ADDRESS.street } : {}),
  addressLocality: ADDRESS.city,
  addressRegion: ADDRESS.region,
  postalCode: ADDRESS.postalCode,
  addressCountry: ADDRESS.country,
} as const;

export const SCHEMA_GEO = {
  "@type": "GeoCoordinates" as const,
  latitude: GEO.latitude,
  longitude: GEO.longitude,
} as const;

// ---------------------------------------------------------------------------
// Service-area cities - used by the footer copy and the contact wizard dropdown
// ---------------------------------------------------------------------------

export const SERVICE_CITIES = [
  "Naples",
  "Bonita Springs",
  "Estero",
  "Marco Island",
  "Fort Myers",
  "Lehigh Acres",
  "Miami",
  "Parkland",
  "Southwest Ranches",
  "Sea Ranch Lakes",
] as const;
