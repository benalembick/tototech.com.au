import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/layout/animation-wrapper";

export function CTA({
  title = "Ready to talk about your technology strategy?",
  description = "Book a confidential consultation to discuss your organisation's technology roadmap, architecture or transformation program.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-fade opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-electric-500/20 blur-[120px]"
      />
      <Container className="relative">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/60">
            {description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">
                Book a Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
