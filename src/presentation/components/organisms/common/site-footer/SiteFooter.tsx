import Link from "next/link";
import Image from "next/image";
import CurrentYear from "@/presentation/components/atoms/CurrentYear";
import { cn } from "@/lib/utils";
import {
  COMPANY_NAME,
  EMAIL,
  PHONE,
  SOCIAL_LINKS,
  BUSINESS_HOURS,
} from "@/constants/business-info";

const NAV_LINKS = [
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const SERVICE_AREAS = [
  { name: "Collier County" },
  { name: "Miami-Dade County" },
  { name: "Broward County" },
] as const;

const SERVICE_CITIES =
  "Naples, Bonita Springs, Estero, Marco Island, Fort Myers, Lehigh Acres, Miami, Parkland, Southwest Ranches, Sea Ranch Lakes";

const SOCIALS = [
  { href: SOCIAL_LINKS.instagram, src: "/images/brands/instagram-icon.svg", label: "Instagram" },
  { href: SOCIAL_LINKS.googleMaps, src: "/images/brands/google-maps-icon.svg", label: "Google Business Profile" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-use" },
] as const;

/** Column label pill - Figma `Text` chip, bg rgba(0,0,0,.04), Segoe 10/15 ls 2. */
function ColumnLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center self-start rounded-full bg-black/[0.04] px-3 py-1",
        "shadow-[0_0_0_rgba(0,0,0,0.05)]",
        "font-sans text-[10px] uppercase leading-[15px] tracking-[2px] text-[#666666]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * SiteFooter - Figma `FOOTER` component (17:1781 and every page instance).
 *
 * A #968272 taupe band (pad 96/64/48) wrapping a white radius-26 card
 * (pad 80/56). Inside: the espresso logo lockup, a four-column grid with
 * rounded label chips, and a hairline legal bar.
 */
export default function SiteFooter() {
  return (
    <footer className="w-full bg-[#968272] px-4 pb-12 pt-16 sm:px-8 lg:px-16 lg:pt-24">
      <div className="mx-auto max-w-[1312px] rounded-[26px] bg-white px-6 py-12 shadow-[0_1px_1px_rgba(255,255,255,0.60)] sm:px-10 lg:px-14 lg:py-20">
        {/* Logo lockup */}
        <Link href="/" aria-label={`${COMPANY_NAME} - home`} className="block">
          <Image
            src="/images/mc-logo.svg"
            alt={COMPANY_NAME}
            width={1165}
            height={106}
            className="h-auto w-full max-w-[1165px]"
          />
        </Link>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pt-14 sm:gap-x-8 lg:grid-cols-4">
          {/* Navigation */}
          <nav aria-label="Footer navigation" className="flex flex-col">
            <ColumnLabel>Navigation</ColumnLabel>
            <ul className="flex flex-col gap-3.5 pt-8">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-[14px] leading-5 tracking-[0.3px] text-[#403023] transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="flex flex-col">
            <ColumnLabel>Contact</ColumnLabel>

            <div className="flex flex-wrap items-center gap-4 pt-8 sm:gap-6">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="transition-transform hover:scale-105"
                >
                  <Image
                    src={social.src}
                    alt=""
                    width={42}
                    height={42}
                    className="h-[42px] w-[42px]"
                  />
                </a>
              ))}
            </div>

            <ul className="flex flex-col gap-3.5 pt-6">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="break-words font-sans text-[13px] leading-5 tracking-[0.3px] text-[#403023] transition-opacity hover:opacity-70 sm:text-[14px]"
                >
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={PHONE.href}
                  className="font-sans text-[14px] leading-5 tracking-[0.3px] text-[#403023] transition-opacity hover:opacity-70"
                >
                  {PHONE.display.replace("+1 ", "")}
                </a>
              </li>
              <li className="pt-1 font-sans text-[12px] leading-4 tracking-[0.3px] text-[#666666]">
                {BUSINESS_HOURS.footerDisplay}
              </li>
            </ul>
          </div>

          {/* Service areas */}
          <div className="flex flex-col">
            <ColumnLabel>Service Areas</ColumnLabel>
            <ul className="flex flex-col gap-3.5 pt-8">
              {SERVICE_AREAS.map((area) => (
                <li
                  key={area.name}
                  className="font-sans text-[14px] leading-5 tracking-[0.3px] text-[#403023]"
                >
                  {area.name}
                </li>
              ))}
              <li className="pt-1 font-sans text-[12px] leading-5 tracking-[0.3px] text-[#666666]">
                {SERVICE_CITIES}
              </li>
            </ul>
          </div>

          {/* Licence + blurb. Sits beside Service Areas so the four columns
              close a clean 2x2 on phones instead of leaving a dead half-row. */}
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center rounded-full bg-black/[0.04] px-4 py-2 font-sans text-[12px] leading-4 tracking-[0.3px] text-[#403023] shadow-[0_0_0_rgba(0,0,0,0.05)]">
              Licensed &amp; Insured
            </span>
            <p className="font-sans text-[14px] leading-[22px] text-[#666666] sm:text-[16px] sm:leading-[26px]">
              Full home remodeling, architectural cabinetry, and custom
              interiors. Everything filtered into one expert team.
            </p>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-sans text-[10px] uppercase leading-[15px] tracking-[2px] text-[#666666]">
            © <CurrentYear /> {COMPANY_NAME} LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-7">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[10px] uppercase leading-[15px] tracking-[2px] text-[#666666] transition-opacity hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
