import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/layout/animation-wrapper";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-40 lg:pb-24 lg:pt-48">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-fade opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-electric-500/20 blur-[110px]"
      />
      <Container className="relative">
        <FadeIn>
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-electric-300">
            {eyebrow}
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {description}
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
