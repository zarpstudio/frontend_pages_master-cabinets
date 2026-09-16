import { LegalPageConfig } from "@/types/legal-metadata";
import { SITE_URL, COMPANY_NAME } from "@/constants/business-info";

const LAST_UPDATED = "April 6, 2026";
const BASE_URL = SITE_URL;
const COMMON_KEYWORDS = [
  COMPANY_NAME,
  "custom cabinetry",
  "home remodeling Naples FL",
  "South Florida cabinet installation",
];

const createMetadata = (
  title: string,
  description: string,
  keywords: string[],
  path: string,
) => ({
  title: `${title} | ${COMPANY_NAME}`,
  description,
  keywords: [...COMMON_KEYWORDS, ...keywords],
  lastUpdated: LAST_UPDATED,
  canonical: `/${path}`,
});

export const legalPagesConfig: Record<string, LegalPageConfig> = {
  "terms-of-use": {
    title: "Terms of Use",
    description:
      "Conditions governing the use of the Master Cabinets website and remodeling services.",
    lastUpdated: LAST_UPDATED,
    icon: "FileText",
    metadata: createMetadata(
      "Terms of Use",
      "Read the Terms of Use for Master Cabinets LLC regarding our custom cabinetry and home remodeling services in South Florida.",
      [
        "terms of use",
        "terms and conditions",
        "website terms",
      ],
      "terms-of-use",
    ),
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "How Master Cabinets LLC collects, uses, and protects your personal information.",
    lastUpdated: LAST_UPDATED,
    icon: "Shield",
    metadata: createMetadata(
      "Privacy Policy",
      "Read the Privacy Policy for Master Cabinets LLC to learn how we protect your personal information and project data.",
      [
        "privacy policy",
        "data protection",
        "personal data",
        "cookies",
        "privacy",
      ],
      "privacy-policy",
    ),
  },
};
