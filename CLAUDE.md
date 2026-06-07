# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # production server (after build)
npm run lint     # ESLint via Next.js
npx tsc --noEmit # type-check without emitting files
```

The Keystatic CMS admin panel is available at `/keystatic` in dev mode. It requires GitHub OAuth — changes are committed directly to the `dvnyyyx/stoneart-tychy` repo.

## Architecture

**Next.js 14 (App Router) + Keystatic CMS + Tailwind CSS**

This is a Polish-language marketing site for a stonework/lettering workshop (StoneArt Tychy). The site is fully static (`revalidate = false` on all pages) and rebuilds on every deploy.

### Routing

Public pages under `app/(site)/` (shared `Header`/`Footer` layout):
- `/` — homepage
- `/o-nas` — about the workshop
- `/uslugi` — services list
- `/uslugi/[slug]` — service detail (statically generated via `generateStaticParams()` from CMS)
- `/realizacje` — gallery
- `/opinie` — testimonials
- `/wycena` — quote request form
- `/kontakt` — contact

Other routes:
- `app/keystatic/` — CMS admin UI
- `app/api/keystatic/` — Keystatic backend API handler
- `app/api/quote/` — quote request form handler (nodemailer, SMTP via env vars)

### Content layer

All CMS content lives in `content/` as JSON files, managed via **Keystatic** with GitHub storage. The Keystatic config is in `keystatic.config.tsx` and defines:

- **Collections**: `services` (`content/services/*.json`), `testimonials` (`content/testimonials/*.json`)
- **Singletons**: `hero`, `homepage`, `galleryData`, `oNas`, `siteSettings` — all under `content/settings/`

`lib/content.ts` exposes typed async helpers (`getServices`, `getTestimonials`, `getGallery`, `getSiteSettings`, etc.) that wrap the Keystatic reader. Pages call these in Server Components and fall back to hardcoded defaults if the CMS read fails.

`next.config.mjs` sets `outputFileTracingIncludes: { '/*': ['./content/**/*'] }` so Vercel's file-tracing bundles the `content/` JSON files into the serverless deployment — without this, the Keystatic reader would find no files at runtime.

Images uploaded via Keystatic are stored in `public/images/prace/` and referenced with `publicPath: '/images/prace/'`. Use `resolveImage()` from `lib/content.ts` to normalize image paths (handles both relative and absolute formats returned by the reader).

### Hardcoded fallbacks

`lib/constants.ts` contains hardcoded `SITE`, `NAV_LINKS`, `SERVICES`, `TESTIMONIALS`, and `WORK_TYPES` constants. These serve as fallback data when CMS content is unavailable. `lib/photos.ts` lists static image filenames from `public/images/prace/`.

### Quote form

`app/api/quote/route.ts` handles `multipart/form-data` POST requests. It validates with Zod (`lib/validations.ts`), then sends email via nodemailer if `SMTP_HOST` is set in env — otherwise logs to console in dev.

Required env vars for email:
```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
```

Required env vars for Keystatic GitHub OAuth (CMS admin panel):
```
KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET
```

Optional env vars for live Google reviews (`lib/reviews.ts`):
```
GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID
```
`getGoogleReviews()` returns `[]` silently when these are absent — used as a supplementary source alongside Keystatic testimonials.

### Component structure

- `components/layout/` — `Header`, `Footer`
- `components/sections/` — full-page sections: `Hero`, `EditorialSection`, `ServiceGrid`, `RealizationGallery` (server), `RealizationGalleryClient` / `RealizacjeClient` (client-side filter/lightbox wrappers), `TestimonialsSection`, `QuoteSection`
- `components/shared/` — small reusables (`AnimatedReveal`, `PageHeader`, `SectionLabel`, `StoneArtLogo`)
- `components/ui/` — interactive UI pieces (`QuoteForm`, `BeforeAfterSlider`, `Lightbox`, `ServiceCard`, `TestimonialCard`, `ImageUpload`)

Animations use **Framer Motion** via the `AnimatedReveal` wrapper. The `clsx` + `tailwind-merge` combo is used for conditional class merging (`lib/utils.ts`).

`app/opengraph-image.tsx` and `app/icon.tsx` generate the default OG image (1200×630) and favicon (32×32) programmatically via Next.js `ImageResponse`. The static `/og/default.jpg` is also served as a fallback OG image referenced in root metadata.

Vercel Analytics (`@vercel/analytics/next`) is mounted as `<Analytics />` in `app/layout.tsx` — no configuration needed beyond the package being present.

### Design system

`app/globals.css` defines the CSS custom properties and component classes that drive all styling. Prefer these over raw Tailwind utilities when they exist:

**Layout:**
- `.container-stone` — max-width 1280px with fluid horizontal padding
- `.section-padding`, `.section-padding-sm`, `.section-padding-lg` — vertical section spacing + horizontal padding
- `.prose-stone` — constrained text width (680px)

**Brand elements:**
- `.bar-motif` + `.bar-motif__dark` / `.bar-motif__gold` — diagonal bar brand accent from the business card; use `.bar-motif--light` on dark backgrounds
- `.section-label` — 10px uppercase gold label above headings; `.section-label--light` for dark backgrounds
- `.link-stone` — small uppercase gold link with animated underline

**Buttons:** `.btn-primary` (dark fill), `.btn-gold` (gold outline), `.btn-ghost` (neutral outline)

**Forms:** `.form-field`, `.form-label`, `.form-error`

**Cards:** `.card-stone` (light bg, hover gold border), `.card-stone--dark`

**Utilities:** `.stone-texture` (SVG grain overlay via `::before`), `.text-on-dark`, `.text-on-dark-secondary`, `.text-gold`, `.text-gold-dark`, `.aspect-stone` (4:3), `.aspect-portrait` (3:4), `.aspect-hero` (16:9)

Color CSS vars (`--color-bg`, `--color-gold`, `--color-text-2`, etc.) are used in inline styles when Tailwind tokens don't have enough granularity. Tailwind tokens (`stone-*`, `gold`, `ink-*`) map 1-to-1 to these vars.

**Typography scale** (custom Tailwind `fontSize` tokens — use these over arbitrary values):
- `text-display-xl` → `clamp(48px, 6vw, 80px)` — hero headings
- `text-display-lg` → `clamp(36px, 4.5vw, 60px)` — page titles
- `text-display-md` → `clamp(28px, 3.5vw, 44px)` — section headings
- `text-display-sm` → `clamp(22px, 2.5vw, 30px)` — sub-headings
- `text-body-lg/md/sm` — body copy at 18/17/15px
- `text-label` / `text-label-sm` — 10px/9px uppercase labels (wide tracking)

**Spacing tokens:** `section-sm` (80px), `section-md` (120px), `section-lg` (160px) for vertical rhythm.

### Fonts

Three fonts loaded via `lib/fonts.ts` using `next/font/google`, injected as CSS variables:
- `--font-playfair` / `.font-display` / `font-family: display` — Playfair Display (headings)
- `--font-inter` / `font-family: body` — Inter (body text, labels, buttons)
- `--font-cormorant` / `.font-quote` / `font-family: quote` — Cormorant Garamond (testimonial quotes)

### Analytics & Consent

GTM ID (`GTM-PVJ96CRF`) is hardcoded in `app/layout.tsx` — not an env var. The layout injects a `<script id="consent-defaults">` **before** the GTM snippet that sets `analytics_storage: 'denied'` with `wait_for_update: 500ms` (Google Consent Mode v2).

`components/ui/CookieBanner` is a client component that manages the `stoneart_consent` cookie (1-year, `SameSite=Lax`). On mount it reads the stored value: if `'granted'` it re-fires `gtag('consent','update',{analytics_storage:'granted'})` immediately; if absent it shows the banner. Accept/reject write the cookie and call `window.gtag` to update consent state. The banner never re-appears once a choice is stored.

### SEO

`lib/schema-components.tsx` provides JSON-LD structured data (`LocalBusinessSchema`, `ServiceSchema`, `BreadcrumbSchema`). `lib/schema.ts` re-exports them — always import from `lib/schema` (not `lib/schema-components`). **Note:** `lib/schema.tsx` is an unreachable duplicate of `lib/schema-components.tsx` (TypeScript resolves `.ts` before `.tsx` when both `lib/schema.ts` and `lib/schema.tsx` exist) and should be deleted. `app/sitemap.ts` and `app/robots.ts` are auto-generated. The site redirects non-www to www (configured in `next.config.mjs`).
