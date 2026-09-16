"use client";

import React from "react";
import {
  RiToolsLine,
  RiTimeLine,
  RiPhoneLine,
  RiMapPinLine,
} from "@remixicon/react";
import CompanyLogo from "@/presentation/components/atoms/CompanyLogo";
import { BrandedButton } from "@/presentation/components/molecules/common/BrandedButton";
import { CONTACT } from "@/constants";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <main className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <CompanyLogo size="xl" />
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-primary/10 p-6 rounded-full">
                <RiToolsLine className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-hanken">
            We&apos;ll Be Right Back!
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 font-rubik leading-relaxed">
            Our website is currently undergoing scheduled maintenance to bring
            you an even better experience. We appreciate your patience and will
            be back online shortly. Please check back soon.
          </p>

          {/* CTA Button */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 font-rubik mb-2">
              If you prefer, call us now at:
            </p>
            <BrandedButton
              variant="primary"
              size="lg"
              className="shadow-xl btn-signup is-glowing is-shaking overflow-visible"
              leftIcon={<RiPhoneLine className="w-5 h-5" />}
              onClick={() => (window.location.href = CONTACT.phoneHref)}
            >
              {CONTACT.phoneDisplay}
            </BrandedButton>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="text-center mt-8 space-y-4">
          <p className="text-sm text-gray-500 font-rubik">
            Thank you for your understanding and continued support.
          </p>

          <div itemScope itemType="https://schema.org/LocalBusiness">
            <address
              className="not-italic"
              itemScope
              itemType="https://schema.org/PostalAddress"
              itemProp="address"
            >
              {/* Replace href with your actual Google Maps link and update the address */}
              <a
                href="https://maps.google.com/maps?q=Naples+FL+Master+Cabinets"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors duration-200 font-rubik group"
                aria-label="Directions to Master Cabinets office in Naples, FL"
              >
                <RiMapPinLine
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                />
                <span itemProp="streetAddress">Naples, FL</span>,{" "}
                <span itemProp="addressLocality">Naples</span>,{" "}
                <span itemProp="addressRegion">FL</span>{" "}
                <span itemProp="postalCode">34102</span>
              </a>
            </address>
          </div>
        </footer>
      </main>
    </div>
  );
}
