import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Stagger } from "@/components/layout/animation-wrapper";
import { IndustryCard } from "@/components/sections/industry-card";
import { CTA } from "@/components/sections/cta";
import industriesData from "@/content/industries.json";
import type { Industry } from "@/lib/types";

const industries = industriesData as Industry[];

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Sector experience across higher education, government, corporate, health, construction, infrastructure, local government and commercial property.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industries | TOTOTECH",
    description:
      "Sector experience across higher education, government, corporate, health, construction, infrastructure, local government and commercial property.",
  },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Sector depth across complex environments"
        description="From university campuses to government agencies and commercial property portfolios — experience across the sectors where technology decisions carry genuine organisational weight."
      />

      <Section>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <IndustryCard industry={industry} delay={(i % 4) * 0.06} key={industry.slug} />
          ))}
        </Stagger>
      </Section>

      <CTA
        title="Working in a sector we haven't listed?"
        description="Our advisory approach is grounded in enterprise technology fundamentals that translate across industries. Let's talk about your context."
      />
    </>
  );
}
