# TOTOTECH — tototech.com.au

Marketing website for TOTO Technology Pty Ltd, an Australian technology
strategy, enterprise architecture and transformation advisory practice.

## Stack

- **Next.js 16** (App Router, static generation where possible)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for animation
- **Lucide** for iconography
- **React Hook Form + Zod** for the contact form
- Content lives in structured JSON (`src/content/*.json`), not hardcoded in components

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # eslint
```

## Project structure

```
src/
  app/                  Route segments (App Router), one folder per page
    api/contact/        Contact form submission endpoint
    icon.tsx            Favicon (generated from the brand mark)
    opengraph-image.tsx Open Graph / Twitter card image
    sitemap.ts           /sitemap.xml
    robots.ts            /robots.txt
  components/
    brand/              Logo mark + lockup
    layout/             Navbar, Footer, Container, Section, animation helpers
    sections/           Page-level building blocks (hero, cards, CTA, timeline, contact form…)
    ui/                 Small primitives (Button, Input, Textarea, Label)
  content/              Structured JSON content — the "CMS" layer
  lib/                  Types, icon registry, validation schemas, utils
```

### Editing content

All copy for services, industries, projects, the "why us" section, stats,
about page and insights lives in `src/content/*.json`. Update those files
rather than editing components — this is what keeps content and
presentation separate so a future CMS integration only has to replace the
JSON import, not the components.

### Contact form

`src/app/api/contact/route.ts` validates submissions with the shared Zod
schema (`src/lib/validations/contact.ts`) and currently logs the enquiry.
Wire it up to an email or CRM provider (e.g. Resend, SendGrid, HubSpot) by
replacing the `console.log` with a provider call — no other changes are
required.

## Brand

Colours, fonts and the icon mark are defined once in
`src/app/globals.css` (`@theme` block) and `src/components/brand/`. The
palette (deep navy, electric blue gradient, light greys) and the
Space Grotesk / Inter type pairing are derived from the TOTOTECH logo.

## SEO

- Per-page `metadata` exports (title, description, canonical, Open Graph)
- Dynamic OG/Twitter image and favicon generated from the brand mark
- `sitemap.xml` and `robots.txt` generated from `src/content/site.json`
- `ProfessionalService` JSON-LD in the root layout

## Planned extensions

The structure is intentionally left room for: a client portal, a full
blog/CMS behind `/insights`, a resource library, appointment booking, an
AI assistant, a case-study CMS, newsletter sign-up, secure document
sharing and a client dashboard.

## Deployment

Any Next.js-compatible host works (Vercel is the simplest). Set the
production domain in `src/content/site.json` (`domain`) before deploying
so metadata, sitemap and JSON-LD resolve to the correct URL.
