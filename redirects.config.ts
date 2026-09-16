import type { Redirect } from "next/dist/lib/load-custom-routes";

// ---------------------------------------------------------------------------
// Redirect rules for this fork.
//
// Add entries here when migrating from a previous site (WordPress, Wix, etc.)
// or when restructuring URLs. Use statusCode: 301 for all production
// permanent redirects - permanent: false (302) only for temporary maintenance pages.
//
// Categories help keep the file scannable and avoid duplicate entries.
// ---------------------------------------------------------------------------

/** Canonical host redirects (apex to www) with permanent 301 status */
const hostRedirects: Redirect[] = [
  {
    source: "/:path*",
    has: [{ type: "host", value: "mastercabinets.net" }],
    destination: "https://www.mastercabinets.net/:path*",
    statusCode: 301,
  },
];

const blogRedirects: Redirect[] = [
  // Example: { source: "/post/:slug*", destination: "/blog/:slug*", statusCode: 301 },
];

const serviceRedirects: Redirect[] = [
  // /services/* was removed from scope (the design kit has no service page).
  // Anything already crawled should land on the homepage rather than a 404.
  { source: "/services", destination: "/", statusCode: 301 },
  { source: "/services/:slug*", destination: "/", statusCode: 301 },
];

const locationRedirects: Redirect[] = [
  // /locations/* was removed from scope; service areas now live in the footer.
  { source: "/locations", destination: "/", statusCode: 301 },
  { source: "/locations/:slug*", destination: "/", statusCode: 301 },
];

const galleryRedirects: Redirect[] = [
  // Example: { source: "/old-gallery", destination: "/gallery", statusCode: 301 },
];

const miscRedirects: Redirect[] = [
  // Pages with no equivalent - redirect to homepage
  // Example: { source: "/about-us", destination: "/", statusCode: 301 },
  // Example: { source: "/contact-us", destination: "/", statusCode: 301 },
];

export const allRedirects: Redirect[] = [
  ...hostRedirects,
  ...blogRedirects,
  ...serviceRedirects,
  ...locationRedirects,
  ...galleryRedirects,
  ...miscRedirects,
];
