import LegalLayout from "@/presentation/components/templates/LegalTemplate";
import { useLegalMetadata } from "@/hooks/use-legal-metadata";
import { legalPagesConfig } from "@/server/config/legal-pages";
import { PHONE, EMAIL, ADDRESS, BUSINESS_HOURS, SITE_URL, COMPANY_NAME } from "@/constants/business-info";

export const metadata = useLegalMetadata(
  legalPagesConfig["terms-of-use"].metadata,
);

export default function Page() {
  return (
    <LegalLayout
      config={legalPagesConfig["terms-of-use"]}
      currentPath="/terms-of-use"
    >
      {/* Table of contents */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <a href="#acceptance" className="text-primary hover:underline">
            1. Acceptance of Terms
          </a>
          <a href="#services" className="text-primary hover:underline">
            2. Description of Services
          </a>
          <a href="#use-of-site" className="text-primary hover:underline">
            3. Use of the Site
          </a>
          <a href="#estimates" className="text-primary hover:underline">
            4. Estimates and Quotes
          </a>
          <a
            href="#intellectual-property"
            className="text-primary hover:underline"
          >
            5. Intellectual Property
          </a>
          <a href="#user-content" className="text-primary hover:underline">
            6. User-Submitted Content
          </a>
          <a href="#disclaimer" className="text-primary hover:underline">
            7. Disclaimer of Warranties
          </a>
          <a
            href="#limitation-liability"
            className="text-primary hover:underline"
          >
            8. Limitation of Liability
          </a>
          <a href="#indemnification" className="text-primary hover:underline">
            9. Indemnification
          </a>
          <a href="#privacy" className="text-primary hover:underline">
            10. Privacy
          </a>
          <a href="#third-party" className="text-primary hover:underline">
            11. Third-Party Links
          </a>
          <a href="#modifications" className="text-primary hover:underline">
            12. Modifications to Terms
          </a>
          <a href="#termination" className="text-primary hover:underline">
            13. Termination
          </a>
          <a href="#governing-law" className="text-primary hover:underline">
            14. Governing Law
          </a>
          <a href="#contact" className="text-primary hover:underline">
            15. Contact Us
          </a>
        </nav>
      </div>

      {/* 1. Acceptance of Terms */}
      <section id="acceptance" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Welcome to {COMPANY_NAME}. By accessing and using our website at{" "}
          <strong>{SITE_URL.replace(/^https?:\/\//, "")}</strong> (the &quot;Site&quot;), you agree
          to be bound by these Terms of Use (&quot;Terms&quot;). If you do not
          agree with any part of these Terms, you must not use the Site.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          These Terms constitute a legally binding agreement between you and
          {COMPANY_NAME}, a custom cabinetry and home remodeling company operating in South Florida. We reserve the right to update these Terms at any
          time, and your continued use of the Site constitutes acceptance of any
          modifications.
        </p>
      </section>

      {/* 2. Description of Services */}
      <section id="services" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {COMPANY_NAME} provides professional remodeling and cabinetry services in South Florida, including but not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
          <li>
            <strong>Custom Cabinetry:</strong> Design, fabrication, and installation of custom kitchen, bathroom, and closet cabinetry.
          </li>
          <li>
            <strong>Home Remodeling:</strong> Full kitchen, bathroom, and interior living space renovations.
          </li>
          <li>
            <strong>Flooring & Carpentry:</strong> Hardwood, tile, trim carpentry, and finish millwork installations.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Our Site provides general information about our services, portfolio,
          service areas, and ways to contact us. The information on the Site is
          for general informational purposes only and does not constitute a
          binding offer or contract for services.
        </p>
      </section>

      {/* 3. Use of the Site */}
      <section id="use-of-site" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">3. Use of the Site</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          You agree to use the Site only for lawful purposes and in accordance
          with these Terms. You agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            Use the Site in any way that violates any applicable federal, state,
            local, or international law or regulation.
          </li>
          <li>
            Attempt to gain unauthorized access to, interfere with, damage, or
            disrupt any parts of the Site, the server on which the Site is
            stored, or any server, computer, or database connected to the Site.
          </li>
          <li>
            Use the Site to transmit or send unsolicited commercial
            communications (spam).
          </li>
          <li>
            Use any robot, spider, or other automatic device to monitor or copy
            any content on the Site without our prior written consent.
          </li>
          <li>
            Introduce any viruses, trojans, worms, logic bombs, or other
            material that is malicious or technologically harmful.
          </li>
          <li>
            Impersonate or attempt to impersonate {COMPANY_NAME}, a{" "}
            {COMPANY_NAME} employee, another user, or any other person or entity.
          </li>
        </ul>
      </section>

      {/* 4. Estimates and Quotes */}
      <section id="estimates" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">4. Estimates and Quotes</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Any estimates or quotes provided through our Site, email, phone, or
          in-person consultations are non-binding and subject to change based on
          actual site conditions, material availability, and project scope.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          A formal written contract or proposal will be provided before any work
          begins. That contract, once signed by both parties, will govern the
          terms, pricing, timeline, warranty, and scope of the specific project.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Pricing displayed on the Site, if any, is for illustrative purposes
          only and may not reflect current pricing for your specific project.
        </p>
      </section>

      {/* 5. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          All content on this Site, including but not limited to text, graphics,
          logos, images, photographs, videos, audio clips, and software, is the
          property of {COMPANY_NAME} or its content suppliers and is protected
          by United States and international copyright, trademark, and other
          intellectual property laws.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The {COMPANY_NAME} name, logo, and all related names, logos, product
          and service names, designs, and slogans are trademarks of{" "}
          {COMPANY_NAME}. You must not use such marks without our prior written
          permission.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          You may view and download content from the Site for your personal,
          non-commercial use, provided you do not modify or delete any copyright,
          trademark, or other proprietary notices.
        </p>
      </section>

      {/* 6. User-Submitted Content */}
      <section id="user-content" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          6. User-Submitted Content
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          When you submit information through our contact forms, request a
          quote, or send us photos of your property, you grant {COMPANY_NAME} a
          non-exclusive, royalty-free right to use that information solely for
          the purpose of providing our services and responding to your inquiry.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          If you provide testimonials, reviews, or project photos that you
          authorize us to use for marketing purposes, you grant us a
          non-exclusive, perpetual, royalty-free license to use, reproduce, and
          display such content on our Site and marketing materials.
        </p>
      </section>

      {/* 7. Disclaimer of Warranties */}
      <section id="disclaimer" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          7. Disclaimer of Warranties
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4 uppercase font-semibold text-sm">
          The Site and its content are provided on an &quot;as is&quot; and
          &quot;as available&quot; basis without any warranties of any kind,
          either express or implied.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {COMPANY_NAME} makes no warranties or representations about the
          accuracy, reliability, completeness, or timeliness of the content on
          the Site. We do not warrant that the Site will be uninterrupted,
          error-free, secure, or free of viruses or other harmful components.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Warranties related to our actual custom cabinetry, remodeling, and
          installation services are governed solely by the written contract or
          proposal executed between {COMPANY_NAME} and the customer for each
          specific project.
        </p>
      </section>

      {/* 8. Limitation of Liability */}
      <section id="limitation-liability" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          8. Limitation of Liability
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          To the fullest extent permitted by applicable law, {COMPANY_NAME}
          shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including without limitation, loss
          of profits, data, use, goodwill, or other intangible losses, resulting
          from:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Your access to or use of (or inability to access or use) the Site.</li>
          <li>
            Any conduct or content of any third party on the Site.
          </li>
          <li>Any content obtained from the Site.</li>
          <li>
            Unauthorized access, use, or alteration of your transmissions or
            content.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-4">
          In no event shall our total liability exceed the amount you paid to
          {COMPANY_NAME}, if any, during the six (6) months prior to the claim.
        </p>
      </section>

      {/* 9. Indemnification */}
      <section id="indemnification" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
        <p className="text-muted-foreground leading-relaxed">
          You agree to indemnify, defend, and hold harmless {COMPANY_NAME}, its
          owners, officers, employees, agents, and affiliates from and against
          any claims, liabilities, damages, judgments, awards, losses, costs,
          expenses, or fees (including reasonable attorneys&apos; fees) arising
          out of or relating to your violation of these Terms or your use of the
          Site.
        </p>
      </section>

      {/* 10. Privacy */}
      <section id="privacy" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">10. Privacy</h2>
        <p className="text-muted-foreground leading-relaxed">
          Your use of the Site is also governed by our{" "}
          <a
            href="/privacy-policy"
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </a>
          , which describes how we collect, use, and protect your personal
          information. By using the Site, you consent to the practices described
          in our Privacy Policy.
        </p>
      </section>

      {/* 11. Third-Party Links */}
      <section id="third-party" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">11. Third-Party Links</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our Site may contain links to third-party websites or services that
          are not owned or controlled by {COMPANY_NAME}, including but not
          limited to social media profiles (Instagram, Facebook), Google Maps,
          and review platforms.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {COMPANY_NAME} has no control over, and assumes no responsibility
          for, the content, privacy policies, or practices of any third-party
          websites or services. You acknowledge and agree that {COMPANY_NAME}
          shall not be responsible or liable for any damage or loss caused by or
          in connection with the use of any such third-party content, goods, or
          services.
        </p>
      </section>

      {/* 12. Modifications to Terms */}
      <section id="modifications" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">
          12. Modifications to Terms
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We reserve the right to modify or replace these Terms at any time at
          our sole discretion. If a revision is material, we will make
          reasonable efforts to provide notice prior to any new terms taking
          effect, such as by posting a notice on the Site.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The &quot;Last Updated&quot; date at the top of this page indicates
          when these Terms were last revised. Your continued use of the Site
          after any changes to the Terms constitutes your acceptance of the
          revised Terms.
        </p>
      </section>

      {/* 13. Termination */}
      <section id="termination" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may terminate or suspend your access to the Site immediately,
          without prior notice or liability, for any reason whatsoever,
          including without limitation if you breach these Terms. Upon
          termination, your right to use the Site will immediately cease.
        </p>
      </section>

      {/* 14. Governing Law */}
      <section id="governing-law" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">14. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          These Terms shall be governed by and construed in accordance with the
          laws of the State of Florida, United States, without regard to its
          conflict of law provisions.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Any disputes arising under or in connection with these Terms shall be
          subject to the exclusive jurisdiction of the state and federal courts located in Collier County, Florida.
        </p>
      </section>

      {/* 15. Contact */}
      <section id="contact" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">15. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you have any questions about these Terms of Use, please contact us:
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
          <p>Hours: {BUSINESS_HOURS.display}</p>
        </div>
      </section>
    </LegalLayout>
  );
}
