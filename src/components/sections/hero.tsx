import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HeroBackground } from "@/components/sections/hero-background";
import { FadeIn } from "@/components/layout/animation-wrapper";
import type { HomeContent } from "@/lib/content-data";
import { Editable } from "@/components/cms/editable";

export function Hero({ content }: { content: HomeContent["hero"] }) {
  const titleParts = content.title.split(content.highlight);

  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-44 lg:pb-32 lg:pt-52">
      <HeroBackground />
      <Container className="relative">
        <FadeIn>
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-900/10 bg-white/70 px-4 py-1.5 text-[13px] font-semibold text-navy-900/70 backdrop-blur-sm">
            <Editable file="pages/home" path="hero.eyebrow" label="Hero eyebrow">
              {content.eyebrow}
            </Editable>
          </span>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="mt-8 max-w-4xl font-display text-5xl font-bold leading-[1.06] tracking-tight text-navy-900 sm:text-6xl lg:text-7xl">
            <Editable file="pages/home" path="hero.title" label="Hero title">
              {titleParts[0]}
              <span className="text-gradient">{content.highlight}</span>
              {titleParts[1]}
            </Editable>
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="mt-8 max-w-xl text-lg leading-relaxed text-navy-900/60 lg:text-xl">
            <Editable file="pages/home" path="hero.description" label="Hero description" type="rich" multiline as="div">
              {content.description}
            </Editable>
          </div>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-11 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href={content.primaryCta.href}>
                <Editable file="pages/home" path="hero.primaryCta" label="Primary button" type="link">
                  {content.primaryCta.label}
                </Editable>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={content.secondaryCta.href}>
                <Editable file="pages/home" path="hero.secondaryCta" label="Secondary button" type="link">
                  {content.secondaryCta.label}
                </Editable>
              </Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
