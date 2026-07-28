import { iconMap, defaultIcon } from "@/lib/icons";
import type { Industry } from "@/lib/types";
import { FadeIn } from "@/components/layout/animation-wrapper";
import { Editable } from "@/components/cms/editable";

export function IndustryCard({ industry, delay = 0, index }: { industry: Industry; delay?: number; index?: number }) {
  const Icon = iconMap[industry.icon] ?? defaultIcon;
  const path = index == null ? "" : `${index}`;

  return (
    <FadeIn delay={delay} className="h-full">
      <div
        id={industry.slug}
        data-cms-editable={index == null ? undefined : "true"}
        data-cms-file="pages/industries"
        data-cms-path={path}
        data-cms-label={`Industry: ${industry.title}`}
        data-cms-type="collection"
        data-cms-collection-index={index}
        className="group flex h-full scroll-mt-28 flex-col items-start gap-4 rounded-2xl border border-navy-900/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-electric-400/30 hover:shadow-[0_24px_48px_-24px_rgba(11,24,54,0.16)]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 text-white">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h3 className="font-display text-lg font-bold tracking-tight text-navy-900">
          <Editable file="pages/industries" path={`${path}.title`} label={`Industry title: ${industry.title}`}>
            {industry.title}
          </Editable>
        </h3>
        <div className="text-[14.5px] leading-relaxed text-navy-900/55">
          <Editable file="pages/industries" path={`${path}.summary`} label={`Industry summary: ${industry.title}`} type="rich" multiline as="div">
            {industry.summary}
          </Editable>
        </div>
      </div>
    </FadeIn>
  );
}
