import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'
import {
  SITE_DEFAULTS, type SiteSettings,
  NAVIGATION_DEFAULTS, type NavigationContent,
  FOOTER_DEFAULTS, type FooterContent,
  HERO_DEFAULTS, type HeroContent,
  HOMEPAGE_DEFAULTS, type HomepageContent,
  O_NAS_DEFAULTS, type ONasContent,
  USLUGI_PAGE_DEFAULTS, type UslugiPageContent,
  REALIZACJE_PAGE_DEFAULTS, type RealizacjePageContent,
  OPINIE_PAGE_DEFAULTS, type OpiniePageContent,
  KONTAKT_PAGE_DEFAULTS, type KontaktPageContent,
  WYCENA_PAGE_DEFAULTS, type WycenaPageContent,
  PRIVACY_PAGE_DEFAULTS, type PrivacyPageContent,
  QUOTE_FORM_DEFAULTS, type QuoteFormContent,
} from './defaults'

// Reader Keystatica — czyta pliki z content/ w trakcie builda (Server Components).
export const reader = createReader(process.cwd(), keystaticConfig)

// ─────────────────────────────────────────────────────────────────────────────
//  Pomocnicze
// ─────────────────────────────────────────────────────────────────────────────

// fields.image() zwraca ścieżkę względem publicPath. Wartości zapisane wcześniej
// bywają absolutne — obsługujemy oba formaty, żeby stare JSON-y dalej działały.
export function resolveImage(
  value: string | null | undefined,
  publicPath = '/images/prace/'
): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (trimmed === '') return ''
  if (trimmed.startsWith('/') || trimmed.startsWith('http')) return trimmed
  return publicPath + trimmed
}

// Nakłada odczyt z CMS na wartości domyślne. Puste stringi i puste tablice
// traktujemy jak „brak wartości” — inaczej skasowanie pola w CMS wyczyściłoby
// sekcję na stronie zamiast wrócić do sensownego tekstu.
function withDefaults<T extends object>(
  defaults: T,
  data: Record<string, unknown> | null | undefined
): T {
  if (!data) return defaults
  const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) }
  for (const key of Object.keys(defaults)) {
    const value = data[key]
    if (value === null || value === undefined) continue
    if (typeof value === 'string' && value.trim() === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    out[key] = value
  }
  return out as T
}

// Odczyt singletonu, który nigdy nie rzuca i nigdy nie zwraca null.
// Awaria readera (brak pliku, zły JSON) kończy się kompletnymi wartościami
// domyślnymi zamiast pustej sekcji lub błędu builda.
async function readSingleton<T extends object>(
  read: () => Promise<unknown>,
  defaults: T,
  label: string
): Promise<T> {
  try {
    const data = (await read()) as Record<string, unknown> | null
    if (!data) {
      console.warn(`[content] brak treści CMS dla "${label}" — używam wartości domyślnych`)
      return defaults
    }
    return withDefaults(defaults, data)
  } catch (err) {
    console.error(`[content] błąd odczytu "${label}":`, err)
    return defaults
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Singletony
// ─────────────────────────────────────────────────────────────────────────────

export const getSiteSettings = (): Promise<SiteSettings> =>
  readSingleton(() => reader.singletons.siteSettings.read(), SITE_DEFAULTS, 'Dane firmy')

export const getNavigation = (): Promise<NavigationContent> =>
  readSingleton(() => reader.singletons.navigation.read(), NAVIGATION_DEFAULTS, 'Menu górne')

export const getFooterContent = (): Promise<FooterContent> =>
  readSingleton(() => reader.singletons.footer.read(), FOOTER_DEFAULTS, 'Stopka')

export const getHeroContent = (): Promise<HeroContent> =>
  readSingleton(() => reader.singletons.hero.read(), HERO_DEFAULTS, 'Hero')

export const getHomepageContent = (): Promise<HomepageContent> =>
  readSingleton(() => reader.singletons.homepage.read(), HOMEPAGE_DEFAULTS, 'Strona główna')

export const getONasContent = (): Promise<ONasContent> =>
  readSingleton(() => reader.singletons.oNas.read(), O_NAS_DEFAULTS, 'O pracowni')

export const getUslugiPageContent = (): Promise<UslugiPageContent> =>
  readSingleton(() => reader.singletons.uslugiPage.read(), USLUGI_PAGE_DEFAULTS, 'Strona Usługi')

export const getRealizacjePageContent = (): Promise<RealizacjePageContent> =>
  readSingleton(() => reader.singletons.realizacjePage.read(), REALIZACJE_PAGE_DEFAULTS, 'Strona Realizacje')

export const getOpiniePageContent = (): Promise<OpiniePageContent> =>
  readSingleton(() => reader.singletons.opiniePage.read(), OPINIE_PAGE_DEFAULTS, 'Strona Opinie')

export const getKontaktPageContent = (): Promise<KontaktPageContent> =>
  readSingleton(() => reader.singletons.kontaktPage.read(), KONTAKT_PAGE_DEFAULTS, 'Strona Kontakt')

export const getWycenaPageContent = (): Promise<WycenaPageContent> =>
  readSingleton(() => reader.singletons.wycenaPage.read(), WYCENA_PAGE_DEFAULTS, 'Strona Wycena')

export const getPrivacyPageContent = (): Promise<PrivacyPageContent> =>
  readSingleton(() => reader.singletons.privacyPage.read(), PRIVACY_PAGE_DEFAULTS, 'Polityka prywatności')

export const getQuoteFormContent = (): Promise<QuoteFormContent> =>
  readSingleton(() => reader.singletons.quoteForm.read(), QUOTE_FORM_DEFAULTS, 'Formularz wyceny')

// ─────────────────────────────────────────────────────────────────────────────
//  Kolekcje
// ─────────────────────────────────────────────────────────────────────────────

export interface ServiceEntry {
  slug: string
  title: string
  shortTitle: string
  category: string
  description: string
  features: readonly string[]
  image: string
  featured: boolean
  order: number
  metaTitle: string
  metaDescription: string
}

export async function getServices(): Promise<ServiceEntry[]> {
  try {
    const slugs = await reader.collections.services.list()
    const items = await Promise.all(
      slugs.map(async (slug): Promise<ServiceEntry | null> => {
        const data = await reader.collections.services.read(slug)
        if (!data) return null
        return {
          slug,
          title: data.title,
          shortTitle: data.shortTitle,
          category: data.category ?? '',
          description: data.description,
          features: (data.features ?? []).filter((f): f is string => Boolean(f)),
          image: resolveImage(data.image),
          featured: Boolean(data.featured),
          order: data.order ?? 99,
          metaTitle: data.metaTitle ?? '',
          metaDescription: data.metaDescription ?? '',
        }
      })
    )
    return items
      .filter((s): s is ServiceEntry => s !== null)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pl'))
  } catch (err) {
    console.error('[content] błąd odczytu usług:', err)
    return []
  }
}

export async function getService(slug: string): Promise<ServiceEntry | null> {
  const all = await getServices()
  return all.find((s) => s.slug === slug) ?? null
}

export interface TestimonialEntry {
  slug: string
  author: string
  location: string
  rating: number
  source: string
  quote: string
  featured: boolean
  order: number
}

export async function getTestimonials(): Promise<TestimonialEntry[]> {
  try {
    const slugs = await reader.collections.testimonials.list()
    const items = await Promise.all(
      slugs.map(async (slug): Promise<TestimonialEntry | null> => {
        const data = await reader.collections.testimonials.read(slug)
        if (!data) return null
        return {
          slug,
          author: data.author,
          location: data.location,
          rating: data.rating ?? 5,
          source: data.source ?? 'google',
          quote: data.quote,
          featured: Boolean(data.featured),
          order: data.order ?? 99,
        }
      })
    )
    return items
      .filter((t): t is TestimonialEntry => t !== null)
      .sort((a, b) => a.order - b.order || a.author.localeCompare(b.author, 'pl'))
  } catch (err) {
    console.error('[content] błąd odczytu opinii:', err)
    return []
  }
}

export async function getFeaturedTestimonials(limit = 3): Promise<TestimonialEntry[]> {
  const all = await getTestimonials()
  const featured = all.filter((t) => t.featured)
  return (featured.length > 0 ? featured : all).slice(0, limit)
}

export interface CategoryEntry {
  slug: string
  name: string
  order: number
}

export async function getCategories(): Promise<CategoryEntry[]> {
  try {
    const slugs = await reader.collections.categories.list()
    const items = await Promise.all(
      slugs.map(async (slug): Promise<CategoryEntry | null> => {
        const data = await reader.collections.categories.read(slug)
        if (!data) return null
        return { slug, name: data.name, order: data.order ?? 99 }
      })
    )
    return items
      .filter((c): c is CategoryEntry => c !== null)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'pl'))
  } catch (err) {
    console.error('[content] błąd odczytu kategorii:', err)
    return []
  }
}

export interface GalleryPhoto {
  src: string
  alt: string
  /** slug kategorii — klucz filtrowania */
  category: string
  /** nazwa kategorii do wyświetlenia */
  categoryName: string
  featured: boolean
}

// Kolejność zdjęć = kolejność w tablicy z CMS (przeciąganie w panelu).
// Nie ma pola „order”: dwa zdjęcia nie mogą już zająć tej samej pozycji,
// a wstawienie zdjęcia na początek przesuwa pozostałe automatycznie.
export async function getGallery(): Promise<GalleryPhoto[]> {
  try {
    const [data, categories] = await Promise.all([
      reader.singletons.gallery.read(),
      getCategories(),
    ])
    const categoryNames = new Map(categories.map((c) => [c.slug, c.name]))

    return (data?.photos ?? []).flatMap((photo) => {
      const src = resolveImage(photo.image)
      // Wpis bez zdjęcia zepsułby <Image src="">, więc go pomijamy.
      if (!src) return []
      const category = photo.category ?? ''
      return [{
        src,
        alt: photo.alt,
        category,
        categoryName: categoryNames.get(category) ?? category,
        featured: Boolean(photo.featured),
      }]
    })
  } catch (err) {
    console.error('[content] błąd odczytu galerii:', err)
    return []
  }
}

export async function getFeaturedGallery(limit = 6): Promise<GalleryPhoto[]> {
  const all = await getGallery()
  const featured = all.filter((p) => p.featured)
  return (featured.length > 0 ? featured : all).slice(0, limit)
}
