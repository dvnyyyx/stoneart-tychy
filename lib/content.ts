import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

// Keystatic reader — używany w Server Components (SSG/SSR)
export const reader = createReader(process.cwd(), keystaticConfig)

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

// Helper: galeria — wszystkie zdjęcia posortowane
export async function getGallery() {
  const slugs = await reader.collections.gallery.list()
  const items = await Promise.all(
    slugs.map((slug) => reader.collections.gallery.read(slug))
  )
  const valid = items.filter(Boolean) as NonNullable<typeof items[number]>[]
  return valid.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
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
