import { iconMap, defaultIcon } from "@/lib/icons";
import type { WhyUsItem } from "@/lib/types";
import { FadeIn } from "@/components/layout/animation-wrapper";

export function FeatureCard({ item, delay = 0 }: { item: WhyUsItem; delay?: number }) {
  const Icon = iconMap[item.icon] ?? defaultIcon;

  return (
    <FadeIn delay={delay} className="h-full">
      <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.07]">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric-500/15 text-electric-300">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h3 className="font-display text-lg font-bold tracking-tight text-white">
          {item.title}
        </h3>
        <p className="text-[14.5px] leading-relaxed text-white/50">
          {item.description}
        </p>
      </div>
    </FadeIn>
  );
}
