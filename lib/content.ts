import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'
import fs from 'fs'
import path from 'path'

// Keystatic reader — używany w Server Components (SSG/SSR)
export const reader = createReader(process.cwd(), keystaticConfig)

// fields.image() zwraca samą nazwę pliku bez ścieżki.
// publicPath działa tylko w UI edytora, nie w reader API.
export function resolveImage(value: string | null | undefined, publicPath = '/images/prace/'): string {
  if (!value) return ''
  if (value.startsWith('/') || value.startsWith('http')) return value
  return publicPath + value
}

// Czyta kolejność zdjęć z pliku gallery-order.json (zarządzany przez /admin/galeria)
function getGalleryOrder(): string[] | null {
  try {
    const filePath = path.join(process.cwd(), 'content/settings/gallery-order.json')
    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
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

// Helper: galeria — sortowanie wg gallery-order.json, fallback na pole order
export async function getGallery() {
  const slugs = await reader.collections.gallery.list()
  const itemsRaw = await Promise.all(
    slugs.map(async (slug) => {
      const item = await reader.collections.gallery.read(slug)
      return item ? { ...item, slug } : null
    })
  )
  const items = itemsRaw.filter(Boolean) as (NonNullable<typeof itemsRaw[number]>)[]

  // Priorytet: kolejność z gallery-order.json (drag-and-drop admin)
  const orderedSlugs = getGalleryOrder()
  if (orderedSlugs && orderedSlugs.length > 0) {
    const orderMap = new Map(orderedSlugs.map((slug, i) => [slug, i]))
    return items.sort((a, b) => {
      const ai = orderMap.has(a.slug) ? (orderMap.get(a.slug) as number) : Infinity
      const bi = orderMap.has(b.slug) ? (orderMap.get(b.slug) as number) : Infinity
      return ai - bi
    })
  }

  // Fallback: pole order (0 = na końcu)
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
