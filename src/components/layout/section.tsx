import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export function Section({ id, className, containerClassName, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 lg:py-32", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-electric-600">
          <span className="h-px w-6 bg-electric-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-navy-900/60">
          {description}
        </p>
      )}
    </div>
  );
}
