import { getFeaturedGallery, resolveImage } from '@/lib/content'
import { RealizationGalleryClient } from '@/components/sections/RealizationGalleryClient'

export async function RealizationGallery() {
  let photos: { src: string; alt: string; category?: string }[] = []
  try {
    const fromCMS = await getFeaturedGallery()
    console.log('[gallery] featured count:', fromCMS.length, fromCMS.map(p => p.featured))
    photos = fromCMS.map((p) => ({
      src: resolveImage(p.image),
      alt: p.alt,
      category: p.category ?? undefined,
    }))
  } catch (e) {
    console.log('[gallery] error:', e)
  }

  console.log('[gallery] photos to render:', photos.length)
  if (photos.length === 0) return null

  return <RealizationGalleryClient photos={photos} />
}
