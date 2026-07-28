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
import { getHomeContent, getIndustries, getProjects, getServices, getStats, getWhyUs } from "@/lib/content-data";
import { Editable } from "@/components/cms/editable";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [home, services, industries, whyUs, projects, stats] = await Promise.all([
    getHomeContent(),
    getServices(),
    getIndustries(),
    getWhyUs(),
    getProjects(),
    getStats(),
  ]);

  return (
    <>
      <Hero content={home.hero} />

      <Section className="pt-0 lg:pt-0">
        <AnimatedStats stats={stats} />
      </Section>

      <Section className="bg-grey-50">
        <SectionHeading
          eyebrow={<Editable file="pages/home" path="sections.services.eyebrow" label="Services eyebrow">{home.sections.services.eyebrow}</Editable>}
          title={<Editable file="pages/home" path="sections.services.title" label="Services heading">{home.sections.services.title}</Editable>}
          description={<Editable file="pages/home" path="sections.services.description" label="Services description" type="rich" multiline>{home.sections.services.description}</Editable>}
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service, i) => (
            <ServiceCard service={service} index={i} delay={i * 0.06} key={service.slug} />
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
          eyebrow={<Editable file="pages/home" path="sections.industries.eyebrow" label="Industries eyebrow">{home.sections.industries.eyebrow}</Editable>}
          title={<Editable file="pages/home" path="sections.industries.title" label="Industries heading">{home.sections.industries.title}</Editable>}
          description={<Editable file="pages/home" path="sections.industries.description" label="Industries description" type="rich" multiline>{home.sections.industries.description}</Editable>}
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <IndustryCard industry={industry} index={i} delay={i * 0.05} key={industry.slug} />
          ))}
        </Stagger>
      </Section>

      <Section className="relative overflow-hidden bg-navy-950">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-fade-dark opacity-50" />
        <div className="relative">
          <SectionHeading
            eyebrow={<Editable file="pages/home" path="sections.whyUs.eyebrow" label="Why us eyebrow">{home.sections.whyUs.eyebrow}</Editable>}
            title={<span className="text-white"><Editable file="pages/home" path="sections.whyUs.title" label="Why us heading">{home.sections.whyUs.title}</Editable></span>}
            description={<Editable file="pages/home" path="sections.whyUs.description" label="Why us description" type="rich" multiline>{home.sections.whyUs.description}</Editable>}
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
          eyebrow={<Editable file="pages/home" path="sections.projects.eyebrow" label="Projects eyebrow">{home.sections.projects.eyebrow}</Editable>}
          title={<Editable file="pages/home" path="sections.projects.title" label="Projects heading">{home.sections.projects.title}</Editable>}
          description={<Editable file="pages/home" path="sections.projects.description" label="Projects description" type="rich" multiline>{home.sections.projects.description}</Editable>}
        />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project, i) => (
            <CaseStudyCard project={project} index={i} delay={i * 0.06} key={project.slug} />
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
