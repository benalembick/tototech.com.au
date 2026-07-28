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

### cPanel rebuilds

The project includes cPanel-friendly npm lifecycle scripts so the cPanel
**Run NPM Install** button can rebuild the app after updates.

- `.npmrc` forces dev dependencies to be installed because Next.js needs
  build-time packages on the server.
- `preinstall` resolves the real app root from cPanel's virtualenv path
  using shell only, then clears stale `.next` output.
- `postinstall` resolves the real app root using shell only, then starts a
  detached rebuild script in a new session after a short delay. This avoids
  running the Next.js build inside cPanel's npm lifecycle process, which can
  fail with WebAssembly/heap errors even when the same build works in a
  normal terminal.
- The detached rebuild logs to `cpanel-rebuild.log` in the app root and
  mirrors the known-good manual flow:
  `rm -rf node_modules .next`,
  `npm install --include=dev --include=optional --ignore-scripts`,
  then the local Next.js binary is run directly with webpack enabled.
- The app declares Node `22.x` in `package.json` because Node 24 on
  cPanel/CloudLinux has shown unstable WebAssembly allocation behaviour
  during Next.js builds.
- `next.config.js` limits production builds to one worker by default. This is
  intentionally conservative for shared hosting; set `NEXT_BUILD_CPUS` if a
  different deployment target can safely use more workers.

If the cPanel button still fails after a major Node/Next/cPanel change, the
manual equivalent remains:

```bash
cd ~/tototech.com.au
git pull
rm -rf node_modules .next
npm install --include=dev
npx next build --webpack
```

When using the cPanel button, wait for `cpanel-rebuild.log` to show
`Rebuild completed successfully`, then restart the Node.js app from cPanel.

The admin area is available at [http://localhost:5176/admin](http://localhost:5176/admin)
in development. Once logged in, a floating editor toolbar also appears on
the public website so authorised users can browse normally, switch Edit
Mode on, click editable content in context, preview changes, save them back
to JSON, or discard them.

Admin login requires both an authorised email address and password. The
initial authorised admin email is `...@gmail.com`. Set a strong
password before using the CMS:

```bash
CMS_ADMIN_EMAILS="...@gmail.com"
CMS_ADMIN_PASSWORD="replace-with-a-strong-password"
CMS_SESSION_SECRET="replace-with-a-long-random-secret"
```

`CMS_ADMIN_PASSWORD` is required. Admin login is disabled if it is not set.
Use `CMS_ADMIN_EMAILS` as a comma-separated list if more authorised users
are needed later.

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

There are two editing modes:

- Visual editing on the public site for common text, rich text, links and
  repeatable content cards.
- `/admin` for advanced/raw JSON editing.

Visual Edit Mode is only shown after authentication. Public visitors see
the site normally.

The legacy `src/content/*.json` files remain as read-only fallbacks so the
site still renders if a local content file is missing. New edits should be
made through `/admin` or directly in `content/`, not `src/content/`.

This CMS is intentionally database-free. It does not use SQL, Prisma,
MongoDB, Firebase, Supabase or any hosted database.

## Contact form

`src/app/api/contact/route.ts` validates submissions with the shared Zod
schema (`src/lib/validations/contact.ts`) and emails enquiries to
`admin@tototech.com.au` with the subject `Website Enquiry - {NAME}`, where
`{NAME}` is the submitted name from the form.

Configure SMTP before using the contact form:

```bash
CONTACT_EMAIL_TO="admin@tototech.com.au"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="smtp-username"
SMTP_PASSWORD="smtp-password"
CONTACT_EMAIL_FROM="website@tototech.com.au"
```

Use `SMTP_SECURE="true"` for port `465`. `CONTACT_EMAIL_FROM` should be an
address your SMTP provider allows you to send from.

## Google Maps

The contact page embeds a Google Map. Set the pin location with:

```bash
CONTACT_MAP_LOCATION="Wellard, Perth, WA 6170"
```

If unset, it defaults to `Wellard, Perth, WA 6170`.

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

If the deployment filesystem is ephemeral, visual edits may appear to save
temporarily and then disappear after a restart or redeploy. The JSON files
under `content/` remain the source of truth, so use persistent disk storage
or commit exported content changes back into the repository for durable
publishing.
