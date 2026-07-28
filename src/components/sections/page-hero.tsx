import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/layout/animation-wrapper";
import { DarkHeroBackground } from "@/components/sections/dark-hero-background";
import { Editable } from "@/components/cms/editable";

export function PageHero({
  eyebrow,
  title,
  description,
  edit,
}: {
  eyebrow: string;
  title: string;
  description: string;
  edit?: {
    file: string;
    eyebrowPath?: string;
    titlePath?: string;
    descriptionPath?: string;
  };
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-40 lg:pb-24 lg:pt-48">
      <DarkHeroBackground seed={eyebrow} />
      <Container className="relative">
        <FadeIn>
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-electric-300">
            {edit?.eyebrowPath ? (
              <Editable file={edit.file} path={edit.eyebrowPath} label="Page eyebrow">
                {eyebrow}
              </Editable>
            ) : (
              eyebrow
            )}
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {edit?.titlePath ? (
              <Editable file={edit.file} path={edit.titlePath} label="Page title">
                {title}
              </Editable>
            ) : (
              title
            )}
          </h1>
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {edit?.descriptionPath ? (
              <Editable file={edit.file} path={edit.descriptionPath} label="Page description" type="rich" multiline as="div">
                {description}
              </Editable>
            ) : (
              description
            )}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
