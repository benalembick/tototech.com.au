import type { TimelineItem } from "@/lib/types";
import { FadeIn } from "@/components/layout/animation-wrapper";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative border-l border-navy-900/10 pl-8">
      {items.map((item, i) => (
        <FadeIn as="li" delay={i * 0.08} key={item.year} className="relative pb-12 last:pb-0">
          <span className="absolute -left-[2.35rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-electric-500 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" />
          <span className="font-display text-sm font-bold tracking-wide text-electric-600">
            {item.year}
          </span>
          <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight text-navy-900">
            {item.title}
          </h3>
          <p className="mt-1.5 max-w-lg text-[14.5px] leading-relaxed text-navy-900/55">
            {item.description}
          </p>
        </FadeIn>
      ))}
    </ol>
  );
}
