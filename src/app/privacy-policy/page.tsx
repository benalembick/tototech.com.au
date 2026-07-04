import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import siteData from "@/content/site.json";
import type { SiteConfig } from "@/lib/types";

const site = siteData as SiteConfig;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.legalName}, outlining how personal information is collected, used and protected.`,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated 1 January 2026. This policy explains how ${site.legalName} collects, uses and protects personal information.`}
      />

      <Section containerClassName="max-w-3xl">
        <div className="prose-content space-y-10 text-[15.5px] leading-relaxed text-navy-900/70">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
              1. Introduction
            </h2>
            <p className="mt-3">
              {site.legalName} (&ldquo;TOTOTECH&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) respects your
              privacy and is committed to protecting personal information in
              accordance with the Australian Privacy Principles under the
              Privacy Act 1988 (Cth).
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
              2. Information We Collect
            </h2>
            <p className="mt-3">
              We collect information you provide directly, such as your name,
              email address, phone number, company and any details submitted
              through our contact form. We may also collect technical
              information such as browser type and usage data through
              standard analytics tools.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
              3. How We Use Your Information
            </h2>
            <p className="mt-3">
              We use personal information to respond to enquiries, provide
              advisory services, improve our website and communicate with you
              about our services. We do not sell personal information to
              third parties.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
              4. Disclosure of Information
            </h2>
            <p className="mt-3">
              We do not share personal information with third parties except
              where required to deliver services you have requested, comply
              with legal obligations, or with your explicit consent.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
              5. Data Security
            </h2>
            <p className="mt-3">
              We take reasonable steps to protect personal information from
              misuse, interference, loss and unauthorised access,
              modification or disclosure.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
              6. Your Rights
            </h2>
            <p className="mt-3">
              You may request access to, or correction of, personal
              information we hold about you at any time by contacting us at{" "}
              <a href={`mailto:${site.email}`} className="text-electric-600 underline underline-offset-2">
                {site.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
              7. Contact Us
            </h2>
            <p className="mt-3">
              If you have questions about this policy, please contact us at{" "}
              <a href={`mailto:${site.email}`} className="text-electric-600 underline underline-offset-2">
                {site.email}
              </a>{" "}
              or {site.phone}.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
