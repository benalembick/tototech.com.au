import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { Stagger } from "@/components/layout/animation-wrapper";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { CTA } from "@/components/sections/cta";
import { getProjects } from "@/lib/content-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Representative technology strategy, enterprise architecture and transformation engagements across higher education, government and enterprise.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | TOTOTECH",
    description:
      "Representative technology strategy, enterprise architecture and transformation engagements across higher education, government and enterprise.",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Outcomes across enterprise, education and infrastructure"
        description="A selection of representative engagements demonstrating strategic thinking backed by hands-on delivery."
      />

      <Section>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <CaseStudyCard project={project} index={i} delay={(i % 3) * 0.06} key={project.slug} />
          ))}
        </Stagger>
      </Section>

      <CTA
        title="Considering a similar program?"
        description="Let's discuss how a similar approach could apply to your organisation's technology strategy or transformation."
      />
    </>
  );
}
