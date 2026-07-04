import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/layout/section";
import { FadeIn } from "@/components/layout/animation-wrapper";
import { Timeline } from "@/components/sections/timeline";
import { CTA } from "@/components/sections/cta";
import aboutData from "@/content/about.json";
import type { AboutContent } from "@/lib/types";

const about = aboutData as AboutContent;

export const metadata: Metadata = {
  title: "About",
  description:
    "TOTOTECH is an Australian-owned technology consulting practice built on enterprise architecture, technology strategy and hands-on delivery experience.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | TOTOTECH",
    description:
      "TOTOTECH is an Australian-owned technology consulting practice built on enterprise architecture, technology strategy and hands-on delivery experience.",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="An independent, executive-grade technology advisory practice"
        description={about.intro}
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn className="space-y-6">
            {about.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-[17px] leading-relaxed text-navy-900/65">
                {paragraph}
              </p>
            ))}
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-navy-900/8 bg-grey-50 p-8">
              <h3 className="font-display text-lg font-bold tracking-tight text-navy-900">
                Areas of Expertise
              </h3>
              <ul className="mt-6 space-y-5">
                {about.expertise.map((item) => (
                  <li key={item.title}>
                    <p className="text-[15px] font-semibold text-navy-900">{item.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-navy-900/55">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section className="bg-grey-50">
        <SectionHeading
          eyebrow="Our Journey"
          title="A decade of enterprise technology advisory"
          description="Built steadily around real delivery experience across higher education, government and enterprise."
        />
        <div className="mt-14">
          <Timeline items={about.timeline} />
        </div>
      </Section>

      <CTA />
    </>
  );
}
