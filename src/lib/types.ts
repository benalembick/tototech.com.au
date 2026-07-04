export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface Service {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  items: string[];
}

export interface Industry {
  slug: string;
  title: string;
  icon: string;
  summary: string;
}

export interface WhyUsItem {
  title: string;
  icon: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  outcomes: string[];
  tags: string[];
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface ExpertiseItem {
  title: string;
  description: string;
}

export interface AboutContent {
  intro: string;
  body: string[];
  expertise: ExpertiseItem[];
  timeline: TimelineItem[];
}

export interface InsightPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  domain: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  linkedin: string;
  address: {
    line1: string;
    line2: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  };
  abn: string;
  founded: number;
}
