import { getFeaturedGallery, resolveImage } from '@/lib/content'
import { RealizationGalleryClient } from '@/components/sections/RealizationGalleryClient'

export async function RealizationGallery() {
  let photos: { src: string; alt: string; category?: string }[] = []
  try {
    const fromCMS = await getFeaturedGallery()
    photos = fromCMS.map((p) => ({
      src: resolveImage(p.image),
      alt: p.alt,
      category: p.category ?? undefined,
    }))
  } catch {
    // brak zdjęć — galeria ukryta
  }

  if (photos.length === 0) return null

  return <RealizationGalleryClient photos={photos} />
}
