import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { FadeIn } from "@/components/layout/animation-wrapper";
import { Editable } from "@/components/cms/editable";

export function CaseStudyCard({ project, delay = 0, index }: { project: Project; delay?: number; index?: number }) {
  const path = index == null ? "" : `${index}`;

  return (
    <FadeIn delay={delay} className="h-full">
      <article
        data-cms-editable={index == null ? undefined : "true"}
        data-cms-file="pages/projects"
        data-cms-path={path}
        data-cms-label={`Project: ${project.title}`}
        data-cms-type="collection"
        data-cms-collection-index={index}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-electric-400/30 hover:shadow-[0_24px_48px_-24px_rgba(11,24,54,0.18)]"
      >
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-navy-950">
          <div
            aria-hidden
            className="absolute inset-0 grid-fade-dark opacity-70"
          />
          <div
            aria-hidden
            className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-electric-500/25 blur-3xl transition-transform duration-500 group-hover:scale-125"
          />
          <span className="relative font-display text-sm font-semibold uppercase tracking-[0.18em] text-electric-300">
            <Editable file="pages/projects" path={`${path}.category`} label={`Project category: ${project.title}`}>
              {project.category}
            </Editable>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <h3 className="font-display text-xl font-bold tracking-tight text-navy-900">
            <Editable file="pages/projects" path={`${path}.title`} label={`Project title: ${project.title}`}>
              {project.title}
            </Editable>
          </h3>
          <div className="mt-3 text-[15px] leading-relaxed text-navy-900/55">
            <Editable file="pages/projects" path={`${path}.summary`} label={`Project summary: ${project.title}`} type="rich" multiline as="div">
              {project.summary}
            </Editable>
          </div>

          <ul className="mt-5 space-y-2.5">
            {project.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-2.5 text-[14px] text-navy-900/70">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" />
                <Editable file="pages/projects" path={`${path}.outcomes.${project.outcomes.indexOf(outcome)}`} label={`Project outcome: ${project.title}`}>
                  {outcome}
                </Editable>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-navy-900/8 pt-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-grey-100 px-3 py-1 text-[12px] font-medium text-navy-900/55"
              >
                <Editable file="pages/projects" path={`${path}.tags.${project.tags.indexOf(tag)}`} label={`Project tag: ${project.title}`}>
                  {tag}
                </Editable>
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-[13.5px] font-semibold text-electric-600">
            Read case study
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
