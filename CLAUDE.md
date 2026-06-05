# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint via Next.js
```

The Keystatic CMS admin panel is available at `/keystatic` in dev mode. It requires GitHub OAuth — changes are committed directly to the `dvnyyyx/stoneart-tychy` repo.

## Architecture

**Next.js 14 (App Router) + Keystatic CMS + Tailwind CSS**

This is a Polish-language marketing site for a stonework/lettering workshop (StoneArt Tychy). The site is fully static (`revalidate = false` on all pages) and rebuilds on every deploy.

### Routing

- `app/(site)/` — public pages with shared `Header`/`Footer` layout
- `app/keystatic/` — CMS admin UI (Keystatic)
- `app/api/keystatic/` — Keystatic backend API handler
- `app/api/quote/` — quote request form handler (nodemailer, SMTP via env vars)

### Content layer

All CMS content lives in `content/` as JSON files, managed via **Keystatic** with GitHub storage. The Keystatic config is in `keystatic.config.tsx` and defines:

- **Collections**: `services` (`content/services/*.json`), `testimonials` (`content/testimonials/*.json`)
- **Singletons**: `hero`, `homepage`, `galleryData`, `oNas`, `siteSettings` — all under `content/settings/`

`lib/content.ts` exposes typed async helpers (`getServices`, `getTestimonials`, `getGallery`, `getSiteSettings`, etc.) that wrap the Keystatic reader. Pages call these in Server Components and fall back to hardcoded defaults if the CMS read fails.

Images uploaded via Keystatic are stored in `public/images/prace/` and referenced with `publicPath: '/images/prace/'`. Use `resolveImage()` from `lib/content.ts` to normalize image paths (handles both relative and absolute formats returned by the reader).

### Hardcoded fallbacks

`lib/constants.ts` contains hardcoded `SITE`, `NAV_LINKS`, `SERVICES`, `TESTIMONIALS`, and `WORK_TYPES` constants. These serve as fallback data when CMS content is unavailable. `lib/photos.ts` lists static image filenames from `public/images/prace/`.

### Quote form

`app/api/quote/route.ts` handles `multipart/form-data` POST requests. It validates with Zod (`lib/validations.ts`), then sends email via nodemailer if `SMTP_HOST` is set in env — otherwise logs to console in dev.

Required env vars for email:
```
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
```

### Component structure

- `components/layout/` — `Header`, `Footer`
- `components/sections/` — full-page sections (Hero, EditorialSection, ServiceGrid, RealizationGallery, TestimonialsSection, QuoteSection)
- `components/shared/` — small reusables (AnimatedReveal, PageHeader, SectionLabel, StoneArtLogo)
- `components/ui/` — interactive UI pieces (QuoteForm, BeforeAfterSlider, Lightbox, ServiceCard, TestimonialCard)

Animations use **Framer Motion** via the `AnimatedReveal` wrapper. The `clsx` + `tailwind-merge` combo is used for conditional class merging (`lib/utils.ts`).

### SEO

`lib/schema.ts` / `lib/schema.tsx` provide JSON-LD structured data (`LocalBusiness` schema). `app/sitemap.ts` and `app/robots.ts` are auto-generated. The site redirects non-www to www (configured in `next.config.mjs`).
