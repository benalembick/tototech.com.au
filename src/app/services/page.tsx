import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Stagger } from "@/components/layout/animation-wrapper";
import { ServiceCard } from "@/components/sections/service-card";
import { CTA } from "@/components/sections/cta";
import servicesData from "@/content/services.json";
import type { Service } from "@/lib/types";

const services = servicesData as Service[];

export const metadata: Metadata = {
  title: "Services",
  description:
    "Technology strategy, enterprise architecture, business analysis, digital transformation, systems integration and program delivery advisory.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | TOTOTECH",
    description:
      "Technology strategy, enterprise architecture, business analysis, digital transformation, systems integration and program delivery advisory.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Advisory across the full technology lifecycle"
        description="Independent, vendor-neutral advisory across strategy, architecture, analysis and delivery — built for organisations where technology decisions carry real weight."
      />

      <Section>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard service={service} delay={(i % 3) * 0.06} key={service.slug} />
          ))}
        </Stagger>
      </Section>

      <CTA
        title="Not sure where to start?"
        description="Every engagement starts with a conversation. Tell us about your organisation and we'll help identify the right starting point."
      />
    </>
  );
}
