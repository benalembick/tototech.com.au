# TOTOTECH — tototech.com.au

Marketing website for TOTO Technology Pty Ltd, an Australian technology
strategy, enterprise architecture and transformation advisory practice.

## Stack

- Next.js 16 (App Router, runtime rendering for CMS-managed pages)
- TypeScript
- Tailwind CSS v4
- Framer Motion for animation
- Lucide for iconography
- React Hook Form + Zod for the contact form
- Lightweight file-based CMS content in local JSON files under `content/`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5176](http://localhost:5176) in development.

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # eslint
```

The admin area is available at [http://localhost:5176/admin](http://localhost:5176/admin)
in development. Set a real password before exposing the site:

```bash
CMS_ADMIN_PASSWORD="replace-with-a-strong-password"
CMS_SESSION_SECRET="replace-with-a-long-random-secret"
```

If these are not set, the local fallback password is `changeme`.

## Project structure

```txt
src/
  app/                  Route segments (App Router), one folder per page
    admin/              Password-protected CMS admin interface
    api/admin/          Local JSON and image upload CMS endpoints
    api/contact/        Contact form submission endpoint
    opengraph-image.tsx Open Graph / Twitter card image
    sitemap.ts          /sitemap.xml
    robots.ts           /robots.txt
  components/
    brand/              Logo mark + lockup
    layout/             Navbar, Footer, Container, Section, animation helpers
    sections/           Page-level building blocks
    ui/                 Small primitives
  content/              Bundled fallback JSON content for first-run safety
  lib/                  Types, CMS helpers, icon registry, validation schemas

content/
  pages/                Editable page and collection JSON files
  posts/                Editable post JSON files
  settings/             Editable site/nav settings

public/
  uploads/              Uploaded images served by the public site
```

## Editing content

Most site content is now edited from `/admin` and saved directly to JSON
files in `content/`. Uploaded images are saved to `public/uploads/` and
can be referenced in JSON as `/uploads/filename.ext`.

The legacy `src/content/*.json` files remain as read-only fallbacks so the
site still renders if a local content file is missing. New edits should be
made through `/admin` or directly in `content/`, not `src/content/`.

This CMS is intentionally database-free. It does not use SQL, Prisma,
MongoDB, Firebase, Supabase or any hosted database.

## Contact form

`src/app/api/contact/route.ts` validates submissions with the shared Zod
schema (`src/lib/validations/contact.ts`) and currently logs the enquiry.
Wire it up to an email or CRM provider by replacing the `console.log` with
a provider call.

## SEO

- Per-page metadata exports
- Dynamic OG/Twitter image and favicon generated from the brand mark
- `sitemap.xml` and `robots.txt` generated from `content/settings/site.json`
- `ProfessionalService` JSON-LD in the root layout

## Deployment

Use a Next.js-compatible host or self-hosted Node.js server where the app
process has permission to write to the local filesystem. Set the production
domain in `content/settings/site.json` (`domain`) before deploying so
metadata, sitemap and JSON-LD resolve to the correct URL.

Important: file writing and image uploads will not work properly on purely
static hosts, read-only serverless filesystems, or deployments that discard
runtime filesystem changes. Use a persistent server or a compatible
deployment target with writable persistent storage.
