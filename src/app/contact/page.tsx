import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/layout/animation-wrapper";
import { ContactForm } from "@/components/sections/contact-form";
import { getContactContent, getSite } from "@/lib/content-data";

export const dynamic = "force-dynamic";

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

export default async function ContactPage() {
  const [contact, site] = await Promise.all([getContactContent(), getSite()]);
  const mapLocation = process.env.CONTACT_MAP_LOCATION || "Wellard, Perth, WA 6170";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`;

  return (
    <>
      <PageHero
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        description={contact.hero.description}
        edit={{
          file: "pages/contact",
          eyebrowPath: "hero.eyebrow",
          titlePath: "hero.title",
          descriptionPath: "hero.description",
        }}
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
                    <span data-cms-editable="true" data-cms-file="settings/site" data-cms-path="email" data-cms-label="Email address" data-cms-type="text">
                      {site.email}
                    </span>
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
                    <span data-cms-editable="true" data-cms-file="settings/site" data-cms-path="phone" data-cms-label="Phone number" data-cms-type="text">
                      {site.phone}
                    </span>
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
                    <span data-cms-editable="true" data-cms-file="settings/site" data-cms-path="address.line1" data-cms-label="Address line 1" data-cms-type="text">{site.address.line1}</span>,{" "}
                    <span data-cms-editable="true" data-cms-file="settings/site" data-cms-path="address.line2" data-cms-label="Address line 2" data-cms-type="text">{site.address.line2}</span>
                  </span>
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-navy-900/8">
              <iframe
                title={`Map showing ${mapLocation}`}
                src={mapSrc}
                className="h-56 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
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
