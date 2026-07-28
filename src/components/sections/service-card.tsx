import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { iconMap, defaultIcon } from "@/lib/icons";
import type { Service } from "@/lib/types";
import { FadeIn } from "@/components/layout/animation-wrapper";
import { Editable } from "@/components/cms/editable";

export function ServiceCard({ service, delay = 0, index }: { service: Service; delay?: number; index?: number }) {
  const Icon = iconMap[service.icon] ?? defaultIcon;
  const path = index == null ? "" : `${index}`;

  return (
    <FadeIn delay={delay} className="h-full">
      <Link
        id={service.slug}
        href={`/services#${service.slug}`}
        data-cms-editable={index == null ? undefined : "true"}
        data-cms-file="pages/services"
        data-cms-path={path}
        data-cms-label={`Service: ${service.title}`}
        data-cms-type="collection"
        data-cms-collection-index={index}
        className="group relative flex h-full scroll-mt-28 flex-col rounded-2xl border border-navy-900/8 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-electric-400/30 hover:shadow-[0_24px_48px_-24px_rgba(11,24,54,0.18)]"
      >
        <div className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900 transition-colors group-hover:bg-electric-500/10 group-hover:text-electric-600">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <ArrowUpRight className="h-5 w-5 text-navy-900/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric-500" />
        </div>

        <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-navy-900">
          <Editable file="pages/services" path={`${path}.title`} label={`Service title: ${service.title}`}>
            {service.title}
          </Editable>
        </h3>
        <div className="mt-3 text-[15px] leading-relaxed text-navy-900/55">
          <Editable file="pages/services" path={`${path}.summary`} label={`Service summary: ${service.title}`} type="rich" multiline as="div">
            {service.summary}
          </Editable>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {service.items.slice(0, 4).map((item) => (
            <li
              key={item}
              className="rounded-full bg-grey-100 px-3 py-1 text-[12.5px] font-medium text-navy-900/60"
            >
              <Editable file="pages/services" path={`${path}.items.${service.items.indexOf(item)}`} label={`Service item: ${item}`}>
                {item}
              </Editable>
            </li>
          ))}
        </ul>
      </Link>
    </FadeIn>
  );
}
