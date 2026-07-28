import "server-only";

import aboutFallback from "@/content/about.json";
import industriesFallback from "@/content/industries.json";
import insightsFallback from "@/content/insights.json";
import navFallback from "@/content/nav.json";
import projectsFallback from "@/content/projects.json";
import servicesFallback from "@/content/services.json";
import siteFallback from "@/content/site.json";
import statsFallback from "@/content/stats.json";
import whyUsFallback from "@/content/why-us.json";
import { readJsonFile } from "@/lib/cms";
import type {
  AboutContent,
  FooterColumn,
  Industry,
  InsightPost,
  NavLink,
  Project,
  Service,
  SiteConfig,
  Stat,
  WhyUsItem,
} from "@/lib/types";

export interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    primaryCta: NavLink;
    secondaryCta: NavLink;
  };
  sections: {
    services: { eyebrow: string; title: string; description: string };
    industries: { eyebrow: string; title: string; description: string };
    whyUs: { eyebrow: string; title: string; description: string };
    projects: { eyebrow: string; title: string; description: string };
  };
}

export interface ContactContent {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  mapNote: string;
}

export interface NavContent {
  primary: NavLink[];
  footerColumns: FooterColumn[];
  legal: NavLink[];
}

const homeFallback: HomeContent = {
  hero: {
    eyebrow: "Australian owned · Vendor independent",
    title: "Technology strategy for organisations building the future",
    highlight: "building the future",
    description:
      "Helping organisations design, transform and optimise enterprise technology environments — with independent advice you can trust.",
    primaryCta: { label: "Book a Consultation", href: "/contact" },
    secondaryCta: { label: "Our Services", href: "/services" },
  },
  sections: {
    services: {
      eyebrow: "Services",
      title: "Advisory across the full technology lifecycle",
      description:
        "From strategy and architecture through to hands-on delivery — a single, vendor-independent partner across the technology decisions that matter.",
    },
    industries: {
      eyebrow: "Industries",
      title: "Sector depth across complex environments",
      description:
        "Deep experience across the industries where technology decisions carry genuine organisational weight.",
    },
    whyUs: {
      eyebrow: "Why TOTOTECH",
      title: "A trusted, independent advisor",
      description:
        "Executive-grade advisory built on genuine delivery experience — not just frameworks and slideware.",
    },
    projects: {
      eyebrow: "Featured Projects",
      title: "Outcomes across enterprise, education and infrastructure",
      description:
        "A selection of representative engagements across strategy, architecture and transformation.",
    },
  },
};

const contactFallback: ContactContent = {
  hero: {
    eyebrow: "Contact",
    title: "Book a confidential consultation",
    description:
      "Tell us about your organisation and what you're looking to achieve. We'll respond within one business day.",
  },
  mapNote: "Map loads here once a Google Maps API key is configured",
};

export const getHomeContent = () => readJsonFile<HomeContent>("pages", "home", homeFallback);
export const getAboutContent = () =>
  readJsonFile<AboutContent>("pages", "about", aboutFallback as AboutContent);
export const getContactContent = () =>
  readJsonFile<ContactContent>("pages", "contact", contactFallback);
export const getServices = () =>
  readJsonFile<Service[]>("pages", "services", servicesFallback as Service[]);
export const getIndustries = () =>
  readJsonFile<Industry[]>("pages", "industries", industriesFallback as Industry[]);
export const getProjects = () =>
  readJsonFile<Project[]>("pages", "projects", projectsFallback as Project[]);
export const getInsights = () =>
  readJsonFile<InsightPost[]>("posts", "insights", insightsFallback as InsightPost[]);
export const getStats = () => readJsonFile<Stat[]>("pages", "stats", statsFallback as Stat[]);
export const getWhyUs = () =>
  readJsonFile<WhyUsItem[]>("pages", "why-us", whyUsFallback as WhyUsItem[]);
export const getNav = () => readJsonFile<NavContent>("settings", "nav", navFallback as NavContent);
export const getSite = () =>
  readJsonFile<SiteConfig>("settings", "site", siteFallback as SiteConfig);
