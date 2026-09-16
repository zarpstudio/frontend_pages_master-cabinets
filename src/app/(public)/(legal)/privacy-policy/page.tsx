import LegalLayout from "@/presentation/components/templates/LegalTemplate";
import { useLegalMetadata } from "@/hooks/use-legal-metadata";
import { legalPagesConfig } from "@/server/config/legal-pages";
import { PHONE, EMAIL, ADDRESS, SITE_URL, COMPANY_NAME } from "@/constants/business-info";

export const metadata = useLegalMetadata(
  legalPagesConfig["privacy-policy"].metadata,
);

export default function Page() {
  return (
    <LegalLayout
      config={legalPagesConfig["privacy-policy"]}
      currentPath="/privacy-policy"
    >
      {/* Table of contents */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <a href="#introduction" className="text-primary hover:underline">
            1. Introduction
          </a>
          <a
            href="#information-we-collect"
            className="text-primary hover:underline"
          >
            2. Information We Collect
          </a>
          <a
            href="#how-we-use-information"
            className="text-primary hover:underline"
          >
            3. How We Use Your Information
          </a>
          <a
            href="#information-sharing"
            className="text-primary hover:underline"
          >
            4. Information Sharing
          </a>
          <a href="#cookies" className="text-primary hover:underline">
            5. Cookies and Tracking
          </a>
          <a href="#data-security" className="text-primary hover:underline">
            6. Data Security
          </a>
          <a href="#your-rights" className="text-primary hover:underline">
            7. Your Rights
          </a>
          <a href="#state-privacy" className="text-primary hover:underline">
            8. Florida Privacy Rights
          </a>
          <a href="#children" className="text-primary hover:underline">
            9. Children&apos;s Privacy
          </a>
          <a href="#third-party" className="text-primary hover:underline">
            10. Third-Party Links
          </a>
          <a href="#changes" className="text-primary hover:underline">
            11. Changes to This Policy
          </a>
          <a href="#contact" className="text-primary hover:underline">
            12. Contact Us
          </a>
        </nav>
      </div>

      {/* 1. Introduction */}
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {COMPANY_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          is committed to protecting the privacy and security of our
          customers&apos; personal information. This Privacy Policy describes
          how we collect, use, disclose, and safeguard your information when you
          visit our website <strong>{SITE_URL.replace(/^https?:\/\//, "")}</strong> (the
          &quot;Site&quot;) or use our custom cabinetry and home remodeling services.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          By accessing or using our Site and services, you agree to the
          practices described in this Privacy Policy. If you do not agree with
          the terms of this policy, please do not access the Site.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {COMPANY_NAME} is a custom cabinetry and home remodeling company based in Naples, FL, serving homeowners across Southwest Florida and surrounding areas.
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section id="information-we-collect" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

        <h3 className="text-xl font-semibold mb-3">
          2.1 Information You Provide Directly
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We may collect the following personal information when you interact
          with us:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
          <li>
            <strong>Contact Information:</strong> Name, email address, phone
            number, and mailing address.
          </li>
          <li>
            <strong>Project Details:</strong> Information about your property and
            the remodeling, cabinetry, and design services you are interested in.
          </li>
          <li>
            <strong>Communication Records:</strong> Messages, emails, and other
            correspondence you send to us through our contact forms or directly.
          </li>
          <li>
            <strong>Photos and Media:</strong> Images of your property that you
            may share for project estimation purposes.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">
          2.2 Information Collected Automatically
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          When you visit our Site, we may automatically collect certain
          information about your device and usage, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Device Information:</strong> Browser type, operating system,
            screen resolution, and device identifiers.
          </li>
          <li>
            <strong>Usage Data:</strong> Pages visited, time spent on pages,
            referring URLs, and click patterns.
          </li>
          <li>
            <strong>Location Data:</strong> General geographic location based on
            your IP address (we do not collect precise GPS location).
          </li>
          <li>
            <strong>Cookies and Similar Technologies:</strong> See Section 5 for
            details on cookies and tracking.
          </li>
        </ul>
      </section>

      {/* 3. How We Use Your Information */}
      <section id="how-we-use-information" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          3. How We Use Your Information
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We use the information we collect for the following purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Service Delivery:</strong> To provide, maintain, and improve
            our custom cabinetry and remodeling services.
          </li>
          <li>
            <strong>Communication:</strong> To respond to your inquiries,
            provide project estimates, and send service-related notifications.
          </li>
          <li>
            <strong>Marketing:</strong> To send promotional materials, special
            offers, and updates about our services (with your consent, where
            required).
          </li>
          <li>
            <strong>Site Improvement:</strong> To analyze usage patterns and
            improve the functionality and user experience of our Site.
          </li>
          <li>
            <strong>Legal Compliance:</strong> To comply with applicable laws,
            regulations, and legal processes.
          </li>
          <li>
            <strong>Business Operations:</strong> To manage our business,
            including scheduling, invoicing, and quality assurance.
          </li>
        </ul>
      </section>

      {/* 4. Information Sharing */}
      <section id="information-sharing" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">4. Information Sharing</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We do not sell your personal information to third parties. We may share
          your information in the following limited circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Service Providers:</strong> We may share information with
            trusted third-party service providers who assist us in operating our
            website, conducting our business, or serving our customers (e.g.,
            hosting providers, analytics services, email marketing platforms).
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose information when
            required by law, court order, or governmental regulation, or when we
            believe disclosure is necessary to protect our rights, property, or
            safety.
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of a merger,
            acquisition, or sale of assets, your information may be transferred
            as part of that transaction.
          </li>
          <li>
            <strong>With Your Consent:</strong> We may share your information for
            any other purpose with your explicit consent.
          </li>
        </ul>
      </section>

      {/* 5. Cookies and Tracking */}
      <section id="cookies" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          5. Cookies and Tracking Technologies
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our Site uses cookies and similar tracking technologies to enhance your
          browsing experience and analyze site traffic. The types of cookies we
          use include:
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Purpose</th>
                <th className="text-left py-3 px-4 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-3 px-4">Essential</td>
                <td className="py-3 px-4">
                  Required for the Site to function properly (e.g., session
                  management, security).
                </td>
                <td className="py-3 px-4">Session</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Analytics</td>
                <td className="py-3 px-4">
                  Help us understand how visitors interact with our Site (e.g.,
                  Google Analytics).
                </td>
                <td className="py-3 px-4">Up to 2 years</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Marketing</td>
                <td className="py-3 px-4">
                  Used to deliver relevant advertisements and track ad
                  performance.
                </td>
                <td className="py-3 px-4">Up to 1 year</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Preference</td>
                <td className="py-3 px-4">
                  Remember your settings and preferences for a better
                  experience.
                </td>
                <td className="py-3 px-4">Up to 1 year</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          You can manage your cookie preferences through your browser settings
          or through our cookie consent banner. Disabling certain cookies may
          affect the functionality of the Site.
        </p>
      </section>

      {/* 6. Data Security */}
      <section id="data-security" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. These measures include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            SSL/TLS encryption for data transmitted between your browser and our
            Site.
          </li>
          <li>
            Secure storage of personal data with access controls limited to
            authorized personnel.
          </li>
          <li>Regular security assessments and updates to our systems.</li>
          <li>Employee training on data protection best practices.</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-4">
          While we strive to protect your personal information, no method of
          transmission over the internet or electronic storage is 100% secure.
          We cannot guarantee absolute security.
        </p>
      </section>

      {/* 7. Your Rights */}
      <section id="your-rights" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Depending on your location, you may have certain rights regarding your
          personal information, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Access:</strong> Request a copy of the personal information
            we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> Request correction of inaccurate or
            incomplete personal information.
          </li>
          <li>
            <strong>Deletion:</strong> Request deletion of your personal
            information, subject to certain legal exceptions.
          </li>
          <li>
            <strong>Opt-Out:</strong> Opt out of receiving marketing
            communications at any time by clicking the &quot;unsubscribe&quot;
            link in our emails or contacting us directly.
          </li>
          <li>
            <strong>Data Portability:</strong> Request your data in a
            structured, commonly used format.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-4">
          To exercise any of these rights, please contact us using the
          information in Section 12.
        </p>
      </section>

      {/* 8. Florida Privacy Rights */}
      <section id="state-privacy" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          8. Florida Privacy Rights
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          As a company based in Florida, we comply with applicable privacy laws. If you are a resident of Florida, you may have the following
          rights regarding your personal information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Right to Access:</strong> You can request details about the
            personal information we have collected about you.
          </li>
          <li>
            <strong>Right to Delete:</strong> You can request that we delete your
            personal information, subject to certain exceptions.
          </li>
          <li>
            <strong>Right to Correct:</strong> You can request correction of
            inaccurate personal information we hold about you.
          </li>
          <li>
            <strong>Right to Opt-Out:</strong> You can opt out of the sale of
            your personal data or the use of your data for targeted advertising.
            We do not sell personal information.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-4">
          To exercise any of these rights, contact us at{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-primary hover:underline"
          >
            {EMAIL}
          </a>{" "}
          or call us at{" "}
          <a href={PHONE.href} className="text-primary hover:underline">
            {PHONE.display}
          </a>
          . We will respond within 45 days of receiving your request.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          This Privacy Policy is governed by and construed in accordance with
          the laws of the State of Florida, United States, without regard to its conflict of law provisions.
        </p>
      </section>

      {/* 9. Children */}
      <section id="children" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          9. Children&apos;s Privacy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Our Site and services are not directed to individuals under the age of
          18. We do not knowingly collect personal information from children. If
          you are a parent or guardian and believe that your child has provided
          us with personal information, please contact us immediately, and we
          will take steps to delete such information.
        </p>
      </section>

      {/* 10. Third-Party Links */}
      <section id="third-party" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">10. Third-Party Links</h2>
        <p className="text-muted-foreground leading-relaxed">
          Our Site may contain links to third-party websites, including social
          media platforms (Instagram, Facebook) and Google Maps. These
          third-party sites have their own privacy policies, and we are not
          responsible for their content or practices. We encourage you to review
          the privacy policies of any third-party sites you visit.
        </p>
      </section>

      {/* 11. Changes to This Policy */}
      <section id="changes" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          11. Changes to This Policy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for other operational, legal, or regulatory
          reasons. We will notify you of any material changes by posting the
          updated policy on this page with a revised &quot;Last Updated&quot;
          date. Your continued use of the Site after any changes constitutes your
          acceptance of the updated policy.
        </p>
      </section>

      {/* 12. Contact */}
      <section id="contact" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our data practices, please contact us:
        </p>
        <div className="bg-muted/50 rounded-lg p-6 space-y-2 text-muted-foreground">
          <p>
            <strong>{COMPANY_NAME}</strong>
          </p>
          <p>{ADDRESS.fullStreet}</p>
          <p>
            Phone:{" "}
            <a
              href={PHONE.href}
              className="text-primary hover:underline"
            >
              {PHONE.display}
            </a>
          </p>
          <p>
            Email:{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-primary hover:underline"
            >
              {EMAIL}
            </a>
          </p>
          <p>Hours: Monday - Saturday, 9:00 AM - 5:00 PM EST</p>
        </div>
      </section>
    </LegalLayout>
  );
}
