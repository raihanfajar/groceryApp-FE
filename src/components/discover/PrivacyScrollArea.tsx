import React from "react";
import { ScrollArea } from "../ui/scroll-area";

const PrivacyScrollArea = () => {
  return (
    <ScrollArea className="h-[calc(100vh-170px)] rounded-b-md border-2 hover:border-green-500">
      <section className="mx-auto max-w-4xl space-y-8 p-6">
        <header>
          <h1 className="mb-4 text-center text-3xl font-bold">
            Privacy Policy
          </h1>
          <p className="text-base leading-relaxed">
            This Privacy Policy (“<span className="italic">Policy</span>”)
            explains how PT Segar Dekat Indonesia (“
            <span className="italic">FreshNear</span>”, “
            <span className="italic">we</span>”, “
            <span className="italic">us</span>”, or “
            <span className="italic">our</span>”) collects, uses, discloses, and
            protects your information when you use the FreshNear mobile
            application and related services. By accessing or using FreshNear,
            you consent to the practices described in this Policy.
          </p>
        </header>

        {/* 1. Information We Collect */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            1. Information We Collect
          </h2>
          <p className="mb-2 text-base leading-relaxed">
            We may collect the following categories of personal data:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed">
            <li>
              <strong>Account Information:</strong> Name, phone number, email
              address, password, and profile details.
            </li>
            <li>
              <strong>Order &amp; Transaction Data:</strong> Purchase history,
              delivery address, payment method (via payment gateway).
            </li>
            <li>
              <strong>Location Data:</strong> GPS or approximate location for
              delivery, store matching, and service availability.
            </li>
            <li>
              <strong>Device &amp; Usage Data:</strong> IP address, device type,
              operating system, app version, and browsing activity within
              FreshNear.
            </li>
            <li>
              <strong>Customer Support:</strong> Records of communications,
              inquiries, or complaints submitted to us.
            </li>
          </ul>
        </section>

        {/* 2. How We Use Information */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed">
            <li>To process and deliver your grocery orders efficiently.</li>
            <li>
              To provide instant, same-day, and scheduled delivery services.
            </li>
            <li>To verify payments and prevent fraudulent transactions.</li>
            <li>To offer personalized recommendations and promotions.</li>
            <li>
              To communicate with you regarding account updates, support, and
              service notifications.
            </li>
            <li>
              To comply with applicable laws, government regulations, and
              subsidy programs.
            </li>
          </ul>
        </section>

        {/* 3. Sharing of Information */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            3. Sharing of Information
          </h2>
          <p className="mb-2 text-base leading-relaxed">
            We respect your privacy and only share your personal data in limited
            circumstances:
          </p>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              <strong>Service Providers:</strong> Logistics partners, payment
              gateways, and IT providers who assist in operating our services.
            </li>
            <li>
              <strong>Legal Compliance:</strong> To comply with court orders,
              regulations, or government requests.
            </li>
            <li>
              <strong>Corporate Transactions:</strong> In case of mergers,
              acquisitions, or restructuring, your information may be
              transferred under confidentiality safeguards.
            </li>
            <li>
              We do not sell or rent your personal data to third parties for
              marketing purposes.
            </li>
          </ol>
        </section>

        {/* 4. Data Retention */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">4. Data Retention</h2>
          <p className="text-base leading-relaxed">
            We retain personal data for as long as necessary to provide
            services, comply with legal obligations, resolve disputes, and
            enforce agreements. When no longer required, data is securely
            deleted or anonymized.
          </p>
        </section>

        {/* 5. Data Security */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">5. Data Security</h2>
          <p className="text-base leading-relaxed">
            FreshNear employs technical and organizational measures to protect
            your information, including encryption, secure servers, and access
            controls. However, no method of transmission over the Internet is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* 6. Your Rights */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">6. Your Rights</h2>
          <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed">
            <li>
              <strong>Access &amp; Correction:</strong> You may review and
              update your personal data via the app.
            </li>
            <li>
              <strong>Deletion:</strong> You may request deletion of your
              account and associated data, subject to legal retention
              requirements.
            </li>
            <li>
              <strong>Consent Withdrawal:</strong> You may withdraw consent for
              data processing, though this may limit service availability.
            </li>
            <li>
              <strong>Marketing Preferences:</strong> You may opt out of
              promotional communications at any time.
            </li>
          </ul>
        </section>

        {/* 7. Children’s Privacy */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">7. Children’s Privacy</h2>
          <p className="text-base leading-relaxed">
            FreshNear does not knowingly collect personal information from
            individuals under 18 without parental consent. If we discover such
            data has been collected, it will be deleted promptly.
          </p>
        </section>

        {/* 8. Cookies & Tracking */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            8. Cookies &amp; Tracking Technologies
          </h2>
          <p className="text-base leading-relaxed">
            FreshNear may use cookies and similar technologies to enhance app
            performance, remember user preferences, and analyze usage patterns.
            You can manage or disable cookies in your device settings, though
            some features may not function properly.
          </p>
        </section>

        {/* 9. International Transfers */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            9. International Data Transfers
          </h2>
          <p className="text-base leading-relaxed">
            Although FreshNear operates primarily in Indonesia, some technical
            service providers may process data abroad. In such cases, we ensure
            adequate safeguards are in place to protect your information.
          </p>
        </section>

        {/* 10. Changes to Policy */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            10. Changes to This Policy
          </h2>
          <p className="text-base leading-relaxed">
            FreshNear may update this Privacy Policy from time to time. Any
            changes will be published in-app with the updated “Effective Date.”
            Continued use of the App after updates constitutes acceptance.
          </p>
        </section>

        {/* 11. Contact */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">11. Contact Us</h2>
          <p className="mb-2 text-base leading-relaxed">
            For questions, concerns, or data-related requests, please contact
            us:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed">
            <li>
              Email: <span className="font-medium">privacy@freshnear.id</span>
            </li>
            <li>
              Phone: <span className="font-medium">0800-123-4567</span>
            </li>
            <li>In-App Chat: Available 24/7</li>
          </ul>
        </section>

        <footer className="border-t pt-4">
          <p className="text-sm text-gray-600">
            Effective Date: September 3, 2025
          </p>
        </footer>
      </section>
    </ScrollArea>
  );
};

export default PrivacyScrollArea;
