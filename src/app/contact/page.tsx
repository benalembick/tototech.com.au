import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/layout/animation-wrapper";
import { ContactForm } from "@/components/sections/contact-form";
import siteData from "@/content/site.json";
import type { SiteConfig } from "@/lib/types";

const site = siteData as SiteConfig;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a confidential consultation with TOTOTECH to discuss your organisation's technology strategy, architecture or transformation program.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | TOTOTECH",
    description:
      "Book a confidential consultation with TOTOTECH to discuss your organisation's technology strategy, architecture or transformation program.",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Book a confidential consultation"
        description="Tell us about your organisation and what you're looking to achieve. We'll respond within one business day."
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <FadeIn className="space-y-10">
            <div className="space-y-6">
              <a
                href={`mailto:${site.email}`}
                className="flex items-start gap-4 rounded-xl border border-navy-900/8 p-5 transition-colors hover:border-electric-400/30 hover:bg-grey-50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold uppercase tracking-wide text-navy-900/50">
                    Email
                  </span>
                  <span className="mt-1 block text-[15px] font-medium text-navy-900">
                    {site.email}
                  </span>
                </span>
              </a>

              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="flex items-start gap-4 rounded-xl border border-navy-900/8 p-5 transition-colors hover:border-electric-400/30 hover:bg-grey-50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900">
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold uppercase tracking-wide text-navy-900/50">
                    Phone
                  </span>
                  <span className="mt-1 block text-[15px] font-medium text-navy-900">
                    {site.phone}
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-4 rounded-xl border border-navy-900/8 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900">
                  <MapPin className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold uppercase tracking-wide text-navy-900/50">
                    Office
                  </span>
                  <span className="mt-1 block text-[15px] font-medium text-navy-900">
                    {site.address.line1}, {site.address.line2}
                    <br />
                    {site.address.suburb} {site.address.state} {site.address.postcode}
                  </span>
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-navy-900/8">
              <div className="flex h-56 items-center justify-center bg-grey-100 text-center">
                <div>
                  <MapPin className="mx-auto h-6 w-6 text-navy-900/30" />
                  <p className="mt-3 text-[13.5px] font-medium text-navy-900/45">
                    Map loads here once a Google Maps API key is configured
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="rounded-2xl border border-navy-900/8 bg-white p-8 lg:p-10">
            <ContactForm />
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
