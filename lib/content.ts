import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

// Keystatic reader — używany w Server Components (SSG/SSR)
export const reader = createReader(process.cwd(), keystaticConfig)

// fields.image() zwraca samą nazwę pliku bez ścieżki.
// publicPath działa tylko w UI edytora, nie w reader API.
export function resolveImage(value: string | null | undefined, publicPath = '/images/prace/'): string {
  if (!value) return ''
  if (value.startsWith('/') || value.startsWith('http')) return value
  return publicPath + value
}

// Helper: opinie klientów
export async function getTestimonials() {
  const slugs = await reader.collections.testimonials.list()
  const items = await Promise.all(
    slugs.map((slug) => reader.collections.testimonials.read(slug))
  )
  return items.filter(Boolean) as NonNullable<typeof items[number]>[]
}

// Helper: tylko wyróżnione opinie (na stronę główną)
export async function getFeaturedTestimonials() {
  const all = await getTestimonials()
  return all.filter((t) => t.featured).slice(0, 3)
}

// Helper: galeria — sortowanie wg pola order na każdym zdjęciu (0 = na końcu)
export async function getGallery() {
  const slugs = await reader.collections.gallery.list()
  const itemsRaw = await Promise.all(
    slugs.map(async (slug) => {
      const item = await reader.collections.gallery.read(slug)
      return item ? { ...item, slug } : null
    })
  )
  const items = itemsRaw.filter(Boolean) as (NonNullable<typeof itemsRaw[number]>)[]

  return items.sort((a, b) => {
    const ao = a.order ?? 0
    const bo = b.order ?? 0
    if (ao === 0 && bo === 0) return 0
    if (ao === 0) return 1
    if (bo === 0) return -1
    return ao - bo
  })
}

// Helper: tylko zdjęcia wyróżnione (strona główna)
export async function getFeaturedGallery() {
  const all = await getGallery()
  return all.filter((p) => p.featured)
}

// Helper: ustawienia firmy
export async function getSiteSettings() {
  return reader.singletons.siteSettings.read()
}

// Helper: teksty strony głównej
export async function getHomepageContent() {
  return reader.singletons.homepage.read()
}

// Helper: hero
export async function getHeroContent() {
  return reader.singletons.hero.read()
}
