import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

// Keystatic reader — używany w Server Components (SSG/SSR)
// Czyta pliki JSON z katalogu content/
export const reader = createReader(process.cwd(), keystaticConfig)

// Helper: pobierz wszystkie opinie posortowane
export async function getTestimonials() {
  const slugs = await reader.collections.testimonials.list()
  const items = await Promise.all(
    slugs.map((slug) => reader.collections.testimonials.read(slug))
  )
  return items.filter(Boolean) as NonNullable<typeof items[number]>[]
}

// Helper: pobierz ustawienia strony
export async function getSiteSettings() {
  return reader.singletons.siteSettings.read()
}

// Helper: pobierz teksty strony głównej
export async function getHomepageContent() {
  return reader.singletons.homepage.read()
}
