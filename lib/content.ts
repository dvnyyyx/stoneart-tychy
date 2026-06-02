import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

// Keystatic reader — używany w Server Components (SSG/SSR)
export const reader = createReader(process.cwd(), keystaticConfig)

// fields.image() w reader API zwraca ścieżkę względem publicPath.
// Jeśli wartość zaczyna się od '/', zwracamy ją jako-jest (stary format z collection).
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

// Helper: galeria — kolejność = kolejność w tablicy (drag-and-drop w Keystatic)
export async function getGallery() {
  const data = await reader.singletons.galleryData.read()
  return data?.photos ?? []
}

// Helper: tylko zdjęcia wyróżnione (strona główna)
export async function getFeaturedGallery() {
  const all = await getGallery()
  return all.filter((p) => p.featured)
}

// Helper: wszystkie usługi (posortowane po order)
export async function getServices() {
  const slugs = await reader.collections.services.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const data = await reader.collections.services.read(slug)
      return data ? { ...data, slug } : null
    })
  )
  const valid = items.filter(Boolean) as (NonNullable<typeof items[number]>)[]
  return valid.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}

// Helper: jedna usługa po slug
export async function getService(slug: string) {
  const data = await reader.collections.services.read(slug)
  return data ? { ...data, slug } : null
}

// Helper: treść strony O pracowni
export async function getONasContent() {
  return reader.singletons.oNas.read()
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
