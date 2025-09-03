import React from "react";
import { ScrollArea } from "../ui/scroll-area";

const TermsScrollArea = () => {
  return (
    <ScrollArea className="h-[calc(100vh-170px)] rounded-b-md border-2 hover:border-green-500">
      <section className="mx-auto max-w-4xl space-y-8 p-6">
        <header>
          <h1 className="mb-4 text-center text-3xl font-bold">
            Terms &amp; Conditions
          </h1>
          <p className="text-base leading-relaxed">
            These Terms &amp; Conditions (“
            <span className="italic">Terms</span>”) govern your access to and
            use of the FreshNear application and related services provided by PT
            Segar Dekat Indonesia (“
            <span className="italic">FreshNear</span>”, “
            <span className="italic">we</span>”, “
            <span className="italic">us</span>”, or “
            <span className="italic">our</span>”). By accessing, registering, or
            using the App, you agree to be bound by these Terms and our Privacy
            Policy. If you do not agree to these Terms, you must discontinue use
            immediately.
          </p>
        </header>

        {/* 1. General Provisions */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">1. General Provisions</h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              FreshNear operates an online grocery service supported by
              self-owned stores across Indonesia.
            </li>
            <li>
              FreshNear may modify or update these Terms at any time. Changes
              take effect upon publication in the App or official channels.
            </li>
            <li>
              Supplemental terms may apply for specific features (e.g.,
              promotions, seasonal programs). In case of conflict, the
              supplemental terms prevail for those features.
            </li>
            <li>
              Headings are for convenience only and do not affect
              interpretation.
            </li>
          </ol>
        </section>

        {/* 2. Eligibility & Account */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            2. Eligibility &amp; Account Registration
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              Services are available to residents of the Republic of Indonesia.
              You must be 18+ or have consent from a parent/legal guardian.
            </li>
            <li>
              You agree to provide accurate, current, and complete information
              during registration and to keep it updated.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              login credentials and all activities occurring under your account.
            </li>
            <li>
              FreshNear may suspend or terminate accounts for suspected fraud,
              misuse, unlawful activity, or violation of these Terms.
            </li>
          </ol>
        </section>

        {/* 3. Scope of Services */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">3. Scope of Services</h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              FreshNear enables ordering of groceries and related products from
              FreshNear-owned stores (no third-party marketplaces).
            </li>
            <li>
              We provide instant, same-day, and scheduled delivery subject to
              store coverage and operational capacity.
            </li>
            <li>
              Service availability varies by location, inventory, hours of
              operation, and applicable regulations.
            </li>
            <li>
              FreshNear may add, remove, or modify features without prior
              notice, provided no material deception is intended.
            </li>
          </ol>
        </section>

        {/* 4. Pricing & Subsidy */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            4. Pricing, Taxes &amp; Government Subsidy
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              FreshNear participates in a Good Governance initiative whereby
              grocery base prices are targeted to be{" "}
              <span className="font-semibold">10% below</span> average market
              prices.
            </li>
            <li>
              Displayed prices may already reflect subsidy and applicable taxes.
              Final checkout price is authoritative.
            </li>
            <li>
              Prices can differ across regions/stores due to local costs,
              logistics, or stock conditions, while maintaining the subsidy
              target where applicable.
            </li>
            <li>
              Promotional pricing, coupons, or limited-time offers may apply in
              addition to the subsidy and are subject to terms and availability.
            </li>
          </ol>
        </section>

        {/* 5. Orders, Acceptance & Substitutions */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            5. Orders, Acceptance &amp; Substitutions
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              Your order constitutes an offer to purchase. FreshNear accepts
              when we confirm payment and begin processing.
            </li>
            <li>
              All orders are subject to availability. We may offer suggested
              substitutions if an item is out of stock; you can accept or
              decline in-app.
            </li>
            <li>
              Product images are illustrative. Actual size, weight, packaging,
              or appearance may vary slightly.
            </li>
            <li>
              We may cancel or limit quantities for reasons including suspected
              fraud, pricing errors, or operational constraints.
            </li>
          </ol>
        </section>

        {/* 6. Delivery Services */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">6. Delivery Services</h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              <span className="font-semibold">Coverage:</span> Deliveries are
              available only within FreshNear service areas in Indonesia.
            </li>
            <li>
              <span className="font-semibold">Instant Delivery:</span> Available
              when the selected store is within ≤2 km of the delivery address;
              typical ETA 60–90 minutes, subject to traffic/weather.
            </li>
            <li>
              <span className="font-semibold">Same-Day Delivery:</span>{" "}
              Available when the selected store is within ≤5 km and orders meet
              cut-off times published in-app.
            </li>
            <li>
              <span className="font-semibold">Scheduled Delivery:</span> Choose
              a time slot; we aim to deliver within the window but exact times
              are not guaranteed.
            </li>
            <li>
              <span className="font-semibold">Free Delivery:</span> Eligible
              after your first completed transaction, with a minimum purchase of
              Rp100.000 (pre-discount). Terms may vary by campaign.
            </li>
            <li>
              You must ensure accurate address details and recipient
              availability. Failed deliveries due to incorrect addresses or
              absence may incur re-delivery fees.
            </li>
          </ol>
        </section>

        {/* 7. Payment */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">7. Payment</h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              Accepted methods: e-wallets via payment gateway and bank transfer
              (virtual account). COD and credit cards are not supported at this
              time.
            </li>
            <li>
              Orders are processed after successful payment
              authorization/settlement.
            </li>
            <li>
              We do not store full payment credentials. Third-party payment
              providers’ terms apply.
            </li>
            <li>
              Chargebacks or payment disputes may result in account review and
              temporary restrictions.
            </li>
          </ol>
        </section>

        {/* 8. Returns, Replacements & Refunds */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            8. Returns, Replacements &amp; Refunds
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              If items arrive damaged, expired, incorrect, or of unacceptable
              quality, notify us within 24 hours via in-app support.
            </li>
            <li>
              Provide order number, photos, and a brief description. Upon
              verification, we may offer replacement, partial refund, or full
              refund.
            </li>
            <li>
              Refunds are issued to the original payment method within an
              estimated 7–14 business days (provider-dependent).
            </li>
            <li>
              Perishables may be ineligible for return if reported beyond
              reasonable freshness windows or mishandled post-delivery.
            </li>
          </ol>
        </section>

        {/* 9. Promotions & Fair Use */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            9. Promotions, Coupons &amp; Fair Use
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              Promotions are time-limited, subject to availability, and may
              include product/category/location restrictions.
            </li>
            <li>
              FreshNear may revoke benefits in cases of suspected abuse (e.g.,
              duplicate accounts, referral fraud, automated redemption).
            </li>
            <li>
              Unless stated, promotions cannot be combined and are
              non-transferable, non-exchangeable, and not redeemable for cash.
            </li>
          </ol>
        </section>

        {/* 10. Product Quality & Freshness */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            10. Product Quality &amp; Freshness
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              Fresh produce is sourced daily and targeted for delivery within 24
              hours of harvest where operationally feasible.
            </li>
            <li>
              Weight-based items may have minor variances; pricing adjustments
              (if any) follow the measured weight at fulfillment.
            </li>
            <li>
              Storage and handling after delivery are the customer’s
              responsibility.
            </li>
          </ol>
        </section>

        {/* 11. User Conduct */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">11. User Conduct</h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              Do not engage in unlawful, fraudulent, harassing, or disruptive
              activities on the App.
            </li>
            <li>
              Do not attempt to interfere with or gain unauthorized access to
              systems, data, or accounts.
            </li>
            <li>
              Do not upload harmful code, spam, or content that infringes
              third-party rights.
            </li>
          </ol>
        </section>

        {/* 12. Intellectual Property */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            12. Intellectual Property
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              All trademarks, logos, service marks, text, graphics, and software
              in the App are owned by FreshNear or its licensors.
            </li>
            <li>
              Reproduction, modification, or distribution without written
              permission is prohibited.
            </li>
          </ol>
        </section>

        {/* 13. Privacy */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            13. Privacy &amp; Data Protection
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              FreshNear collects and processes personal data to operate, fulfill
              orders, provide support, and improve services.
            </li>
            <li>
              We follow applicable Indonesian data protection requirements. See
              our Privacy Policy for details on data categories, purposes,
              retention, and rights.
            </li>
            <li>We do not sell personal data to unaffiliated third parties.</li>
          </ol>
        </section>

        {/* 14. Service Availability & Liability */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            14. Service Availability &amp; Limitation of Liability
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>The App may be subject to maintenance, updates, or outages.</li>
            <li>
              To the maximum extent permitted by law, FreshNear is not liable
              for indirect, incidental, special, punitive, or consequential
              damages.
            </li>
            <li>
              FreshNear’s aggregate liability related to any order is limited to
              the amount paid for that order.
            </li>
          </ol>
        </section>

        {/* 15. Force Majeure */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">15. Force Majeure</h2>
          <p className="text-base leading-relaxed">
            FreshNear is not responsible for delays or failures caused by events
            beyond our reasonable control, including natural disasters,
            epidemics, government actions, strikes, war, civil unrest, or
            disruptions in transportation or telecommunications.
          </p>
        </section>

        {/* 16. Governing Law & Disputes */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            16. Governing Law &amp; Dispute Resolution
          </h2>
          <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed">
            <li>
              These Terms are governed by the laws of the Republic of Indonesia.
            </li>
            <li>
              Disputes should first be resolved amicably through customer
              support.
            </li>
            <li>
              If unresolved, disputes may be referred to arbitration in
              Indonesia in accordance with prevailing rules (e.g., BANI).
            </li>
          </ol>
        </section>

        {/* 17. Contact */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            17. Contact Information
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed">
            <li>
              Email: <span className="font-medium">support@freshnear.id</span>
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

export default TermsScrollArea;
