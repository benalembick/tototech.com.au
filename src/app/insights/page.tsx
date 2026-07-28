import type { Metadata } from "next";
import { Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/layout/animation-wrapper";
import { getInsights } from "@/lib/content-data";
import { Editable } from "@/components/cms/editable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Perspectives on enterprise architecture, technology strategy, higher education technology and smart buildings.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights | TOTOTECH",
    description:
      "Perspectives on enterprise architecture, technology strategy, higher education technology and smart buildings.",
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Perspectives on enterprise technology"
        description="Views on technology strategy, architecture and transformation from the practice. New articles published regularly."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {insights.map((post, i) => (
            <FadeIn key={post.slug} delay={(i % 3) * 0.06} className="h-full">
              <article
                data-cms-editable="true"
                data-cms-file="posts/insights"
                data-cms-path={`${i}`}
                data-cms-label={`Insight: ${post.title}`}
                data-cms-type="collection"
                data-cms-collection-index={i}
                className="group flex h-full flex-col rounded-2xl border border-navy-900/8 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-electric-400/30 hover:shadow-[0_24px_48px_-24px_rgba(11,24,54,0.16)]"
              >
                <span className="text-[12.5px] font-semibold uppercase tracking-wide text-electric-600">
                  <span data-cms-editable="true" data-cms-file="posts/insights" data-cms-path={`${i}.category`} data-cms-label={`Insight category: ${post.title}`} data-cms-type="text">
                    {post.category}
                  </span>
                </span>
                <h2 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight text-navy-900">
                  <span data-cms-editable="true" data-cms-file="posts/insights" data-cms-path={`${i}.title`} data-cms-label={`Insight title: ${post.title}`} data-cms-type="text">
                    {post.title}
                  </span>
                </h2>
                <div className="mt-3 flex-1 text-[14.5px] leading-relaxed text-navy-900/55">
                  <Editable
                    file="posts/insights"
                    path={`${i}.excerpt`}
                    label={`Insight excerpt: ${post.title}`}
                    type="rich"
                    multiline
                    as="div"
                  >
                    {post.excerpt}
                  </Editable>
                </div>
                <div className="mt-6 flex items-center gap-4 border-t border-navy-900/8 pt-5 text-[13px] text-navy-900/45">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-16 rounded-2xl border border-dashed border-navy-900/15 bg-grey-50 p-10 text-center">
          <p className="font-display text-lg font-bold text-navy-900">
            More insights are on the way.
          </p>
          <p className="mt-2 text-[14.5px] text-navy-900/55">
            This section is built to grow into a full resource library — subscribe updates coming soon.
          </p>
        </FadeIn>
      </Section>
    </>
  );
}
