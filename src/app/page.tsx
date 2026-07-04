import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/layout/section";
import { Stagger } from "@/components/layout/animation-wrapper";
import { ServiceCard } from "@/components/sections/service-card";
import { IndustryCard } from "@/components/sections/industry-card";
import { FeatureCard } from "@/components/sections/feature-card";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { AnimatedStats } from "@/components/sections/animated-counter";
import { CTA } from "@/components/sections/cta";
import { Button } from "@/components/ui/button";
import servicesData from "@/content/services.json";
import industriesData from "@/content/industries.json";
import whyUsData from "@/content/why-us.json";
import projectsData from "@/content/projects.json";
import statsData from "@/content/stats.json";
import type { Service, Industry, WhyUsItem, Project, Stat } from "@/lib/types";

const services = servicesData as Service[];
const industries = industriesData as Industry[];
const whyUs = whyUsData as WhyUsItem[];
const projects = projectsData as Project[];
const stats = statsData as Stat[];

export default function Home() {
  return (
    <>
      <Hero />

      <Section className="pt-0 lg:pt-0">
        <AnimatedStats stats={stats} />
      </Section>

      <Section className="bg-grey-50">
        <SectionHeading
          eyebrow="Services"
          title="Advisory across the full technology lifecycle"
          description="From strategy and architecture through to hands-on delivery — a single, vendor-independent partner across the technology decisions that matter."
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service, i) => (
            <ServiceCard service={service} delay={i * 0.06} key={service.slug} />
          ))}
        </Stagger>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Industries"
          title="Sector depth across complex environments"
          description="Deep experience across the industries where technology decisions carry genuine organisational weight."
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <IndustryCard industry={industry} delay={i * 0.05} key={industry.slug} />
          ))}
        </Stagger>
      </Section>

      <Section className="relative overflow-hidden bg-navy-950">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-fade opacity-20" />
        <div className="relative">
          <SectionHeading
            eyebrow="Why TOTOTECH"
            title={<span className="text-white">A trusted, independent advisor</span>}
            description="Executive-grade advisory built on genuine delivery experience — not just frameworks and slideware."
            className="[&_p]:text-white/55"
          />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => (
              <FeatureCard item={item} delay={i * 0.05} key={item.title} />
            ))}
          </Stagger>
        </div>
      </Section>

      <Section className="bg-grey-50">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Outcomes across enterprise, education and infrastructure"
          description="A selection of representative engagements across strategy, architecture and transformation."
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, i) => (
            <CaseStudyCard project={project} delay={i * 0.06} key={project.slug} />
          ))}
        </Stagger>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      <CTA />
    </>
  );
}
