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

There are no automated tests in this project.

The Keystatic CMS admin panel is at `/keystatic`. **Storage mode is environment-dependent** (`keystatic.config.tsx`): `kind: 'local'` in dev (writes straight to disk, no OAuth) and `kind: 'github'` in production (commits to `dvnyyyx/stoneart-tychy`, which triggers a Vercel rebuild). This split removes the old "sometimes saves, sometimes doesn't" failure: in dev there is no remote state that local files can diverge from.

`app/api/keystatic/[...params]/route.ts` builds the Keystatic handler **lazily**, on first request. Keystatic validates the GitHub OAuth env vars at module import in `github` mode, which used to abort the entire `next build` in any environment without the secrets (local build, CI, fresh clone). With lazy init the build always passes and a missing configuration surfaces as a readable 500 in the CMS panel instead.

## Architecture

**Next.js 14 (App Router) + Keystatic CMS + Tailwind CSS**

This is a Polish-language marketing site for a stonework/lettering workshop (StoneArt Tychy). All pages are fully static (`revalidate = false`) and rebuild on every deploy. Google reviews are intentionally decoupled from page rendering: they are fetched client-side from the `/api/reviews` route handler (CDN-cached ~24 h), so reviews refresh without a redeploy **and pages never re-render at runtime** — which previously dropped CMS-read gallery images on the home page and `/opinie`.

Imports use the `@/*` path alias mapped to the repo root (`tsconfig.json`), e.g. `import { getServices } from '@/lib/content'`.

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
- `/polityka-prywatnosci` — privacy policy (RODO); `robots: {index: false}` — not indexed

Other routes:
- `app/keystatic/` — CMS admin UI
- `app/api/keystatic/` — Keystatic backend API handler
- `app/api/quote/` — quote request form handler (nodemailer, SMTP via env vars)
- `app/api/reviews/` — Google reviews endpoint (`force-dynamic`, CDN-cached 24 h via `Cache-Control`); read client-side by `ReviewsList`. Isolated from the Keystatic reader, so it can run at runtime safely.

### Content layer

All CMS content lives in `content/` as JSON files, managed via **Keystatic** with GitHub storage. The Keystatic config is in `keystatic.config.tsx` and defines:

- **Collections**: `services`, `testimonials`, `gallery`, `categories` (`content/<name>/*.json`)
- **Singletons**: `hero`, `homepage`, `oNas`, `uslugiPage`, `realizacjePage`, `opiniePage`, `kontaktPage`, `wycenaPage`, `privacyPage`, `quoteForm`, `navigation`, `footer`, `siteSettings` — all under `content/settings/`

Every visible string, link, label and image on the site comes from one of these. Nothing user-facing is hardcoded in components any more.

**The gallery is a collection, not a singleton array.** It used to be `galleryData` — a single JSON holding every photo — so adding one photo rewrote the whole list and could clobber entries written concurrently. One file per photo removes that class of conflict. Gallery `category` is a `fields.relationship` pointing at the `categories` collection, so the client adds filter categories in the CMS without a code change.

### Live preview (`/podglad`)

`/podglad` is a split-screen tool for the client: the Keystatic panel on the left, the rendered site on the right. It polls `/api/podglad-wersja` (which returns the head commit SHA of the preview branch) every 5 s while the tab is visible, and reloads the right-hand iframe when the SHA changes — i.e. the moment a CMS save lands as a commit.

The preview pane renders **the same page components** as the public site, but fed by a different reader:

- `lib/content-api.ts` — `createContentApi(reader, source, imageBaseUrl)` builds the whole content API around any reader.
- `lib/content.ts` — binds it to the filesystem reader. This is what public pages use, and why they stay 100% static.
- `lib/content-preview.ts` — binds it to `createGitHubReader` against the `main` branch, so it shows content seconds after save, without waiting for a Vercel rebuild.

`app/podglad/strona/[[...sciezka]]/page.tsx` is `force-dynamic` and dispatches the path to the right page component from `components/pages/`. **Page bodies live in `components/pages/`, not in the route files** — Next.js rejects extra props on route components (`PageProps` constraint), so the route files are thin wrappers that only own `metadata`, `revalidate` and `generateStaticParams`.

Preview images resolve to `raw.githubusercontent.com/...` (allowed in `next.config.mjs` `remotePatterns`). Without this, a photo the client just uploaded would 404 in preview: the file is committed to the repo, but this deployment's `public/` only knows the state at build time.

`previewUrl` on every collection and singleton points at `/podglad/strona/...`, so the CMS "Preview" button also shows fresh content rather than the last deploy.

`components/shared/AnalyticsGate.tsx` suppresses Vercel Analytics and the cookie banner on `/podglad` and `/keystatic`, and the GTM snippet in `app/layout.tsx` is wrapped in a pathname check for the same reason — internal tooling must not pollute the client's statistics.

### Content defaults

`lib/defaults.ts` holds a typed default object for every singleton (`SITE_DEFAULTS`, `HOMEPAGE_DEFAULTS`, …) mirroring the seeded JSON. `lib/content-api.ts` wraps the Keystatic reader with `readSingleton()`, which **never throws and never returns null**: a failed read logs and returns the defaults, and `withDefaults()` merges per field, treating `null`, `''` and `[]` as "not set". Pages therefore consume a complete object and carry no fallback logic of their own.

This is deliberate: fallbacks used to be inlined per page, which meant an empty CMS read rendered a plausible-looking page and hid the failure. Now a failed read is logged once, in one place (`[content] …` in build output).

Collection getters (`getServices`, `getTestimonials`, `getGallery`, `getCategories`) return typed, sorted arrays and `[]` on failure. `getGallery()` drops entries with no image so `<Image src="">` can never be rendered.

Use `api.image(value)` rather than the bare `resolveImage()` when resolving a CMS image path in a component — only the API-bound version knows whether to serve from `public/` or from raw GitHub.

`next.config.mjs` sets `outputFileTracingIncludes: { '/*': ['./content/**/*'] }` so Vercel's file-tracing bundles the `content/` JSON files into the serverless deployment — without this, the Keystatic reader would find no files at runtime.

Images uploaded via Keystatic are stored in `public/images/prace/` and referenced with `publicPath: '/images/prace/'`. Use `resolveImage()` from `lib/content.ts` to normalize image paths (handles both relative and absolute formats returned by the reader).

### Constants

`lib/constants.ts` holds only what cannot live in the CMS because it is needed outside an async read: `SITE_URL` (used for `metadataBase`, canonicals and sitemap), `GTM_ID`, `OG_IMAGE`, `LOGO_PATH`. Company data (phone, e-mail, address, hours, description) lives in Keystatic.

`lib/photos.ts` was deleted. It listed image filenames (`IMG_0413.jpeg`, `granit-impala.png`) that no longer existed on disk, so every "fallback" path it fed rendered a broken image.

Images in `public/images/prace/` are flat and descriptively named. They used to be nested (`photos/0/image.jpeg`) with three orphaned duplicate directories, ~40 MB total; now ~7.4 MB, deduplicated, max 2000 px.

### Quote form

`app/api/quote/route.ts` handles `multipart/form-data` POST requests. It validates with Zod (`lib/validations.ts`), then sends email via nodemailer if `SMTP_HOST` is set in env — otherwise logs to console in dev.

Required env vars for email:
```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
SMTP_SECURE  # optional, "true" forces TLS on a non-465 port
SMTP_TO      # optional, overrides the recipient; otherwise the CMS e-mail is used
```

In production a missing `SMTP_HOST` returns a 500 instead of a silent success — a quote that is never delivered must not look sent.

Required env vars for Keystatic GitHub OAuth (CMS admin panel):
```
KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET
```

**Required for the `/podglad` live preview:**
```
GITHUB_TOKEN   # read-only access to public repositories
```
Without it the preview still works but shares the unauthenticated GitHub limit of 60 requests/hour, which one or two preview reloads exhaust — the `createGitHubReader` content reads cost a dozen-plus API calls per render. `/api/podglad-wersja` throttles itself to one upstream call per 60 s without a token (5 s with one) and the panel shows a warning banner. ETag conditional requests are sent but do **not** help: measured against the live API, 304 responses still count against the primary rate limit.

`PREVIEW_BRANCH` (optional) points the preview at a branch other than `main`.

Optional env vars for live Google reviews (`lib/reviews.ts`):
```
GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID
```
`getGoogleReviews()` returns `[]` silently when these are absent. It is called **only** by the `/api/reviews` route handler — never in a page/component server render. Pages render Keystatic/hardcoded testimonials server-side as the baseline; the `ReviewsList` client component (`components/ui/ReviewsList.tsx`) then fetches `/api/reviews` and swaps in live Google reviews (progressive enhancement). Keep server components free of `getGoogleReviews()` so `/opinie` and the homepage stay fully static.

### Component structure

- `components/layout/` — `Header` (async server component: reads menu + company data), `HeaderClient` (interactive shell: scroll state, mobile drawer), `Footer` (async server component)
- `components/sections/` — full-page sections: `Hero`, `EditorialSection`, `ServiceGrid`, `RealizationGallery` (server), `RealizationGalleryClient` / `RealizacjeClient` (client-side filter/lightbox wrappers), `TestimonialsSection`, `QuoteSection`

The server/client split is the pattern throughout: the async server component reads Keystatic and passes plain props into the `'use client'` component. Client components never import `lib/content.ts`.

`RealizacjeClient` renders category filter buttons derived from the `categories` collection; only categories that actually have photos are offered. The lightbox receives the *filtered* list, so its indices stay in sync when the filter changes.
- `components/pages/` — the body of each public page, taking an optional `api` prop; shared by the real route and by `/podglad`
- `components/preview/` — `PodgladPanel`, the split-screen preview shell
- `components/shared/` — small reusables (`AnimatedReveal`, `PageHeader`, `SectionLabel`, `StoneArtLogo`, `AnalyticsGate`)
- `components/ui/` — interactive UI pieces (`QuoteForm`, `BeforeAfterSlider`, `Lightbox`, `ServiceCard`, `TestimonialCard`, `ImageUpload`)

Animations use **Framer Motion** via the `AnimatedReveal` wrapper. The `clsx` + `tailwind-merge` combo is used for conditional class merging (`lib/utils.ts`). Icons come from `lucide-react`. `QuoteForm` is built with `react-hook-form` + `@hookform/resolvers/zod`. It is a client component and takes all its copy (field labels, placeholders, work-type options, success and error text) as a `content` prop read from the `quoteForm` singleton by its server parent. `ImageUpload` previews use plain `<img>` with `blob:` URLs — `next/image` cannot proxy those — and revoke their object URLs on unmount.

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

GTM ID (`GTM-PVJ96CRF`) is a constant in `lib/constants.ts` — not an env var. The layout injects a `<script id="consent-defaults">` **before** the GTM snippet that sets `analytics_storage: 'denied'` with `wait_for_update: 500ms` (Google Consent Mode v2).

`components/ui/CookieBanner` is a client component that manages the `stoneart_consent` cookie (1-year, `SameSite=Lax`). On mount it reads the stored value: if `'granted'` it re-fires `gtag('consent','update',{analytics_storage:'granted'})` immediately; if absent it shows the banner. Accept/reject write the cookie and call `window.gtag` to update consent state. The banner never re-appears once a choice is stored.

### SEO

`lib/schema-components.tsx` provides JSON-LD structured data (`LocalBusinessSchema`, `WebSiteSchema`, `ServiceSchema`, `BreadcrumbSchema`). The first three are **async server components** that read company data from Keystatic, so editing the phone number or opening hours in the CMS updates the structured data too. `WebSiteSchema` + `LocalBusinessSchema` render once on the homepage; `ServiceSchema`/`BreadcrumbSchema` render per relevant page.

Do **not** add `aggregateRating` markup built from the `testimonials` collection: those entries are editorial copy, not verified reviews, and Google treats self-declared review markup aggregated from third-party sources as a manual-action risk.

Page metadata comes from the CMS via `generateMetadata()` on every route (and on the root layout). Per-page `metaTitle` should not repeat the brand — the root layout appends `| <companyName> <city>`. `lib/schema.ts` re-exports them — always import from `lib/schema` (not `lib/schema-components`). **Do not recreate `lib/schema.tsx`:** a stale duplicate used to live there, and because webpack resolves `.tsx` *before* `.ts` (the opposite of `tsc`), the production build silently used the duplicate instead of `schema.ts`. Adding an export only to `schema-components.tsx` then broke the Vercel build (`WebSiteSchema is not exported` → `Unsupported Server Component type: undefined`) while local `tsc --noEmit` passed. The duplicate has been deleted; keep a single source in `schema-components.tsx`. (`next.config.ts.bak` is a stale backup of the now-`.mjs` config and is safe to delete.) `app/sitemap.ts` and `app/robots.ts` are auto-generated. `next.config.mjs` redirects non-www → www, the old `stoneart.tychy.pl` host → www, and `/index.php` → `/` (all 301). It also sets the security headers, including an enforced `Content-Security-Policy: frame-ancestors 'self'` and a full candidate policy as `Content-Security-Policy-Report-Only`. Promote the report-only policy to the enforced header only after checking the browser console shows no violations with analytics and Google reviews active.
