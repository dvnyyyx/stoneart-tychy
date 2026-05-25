import { getFeaturedGallery, resolveImage } from '@/lib/content'
import { homepagePhotos, photoSrc } from '@/lib/photos'
import { RealizationGalleryClient } from '@/components/sections/RealizationGalleryClient'

export async function RealizationGallery() {
  // Spróbuj wczytać z Keystatic; fallback na lib/photos.ts
  let photos: { src: string; alt: string; category?: string }[]
  try {
    const fromCMS = await getFeaturedGallery()
    if (fromCMS.length > 0) {
      photos = fromCMS.map((p) => ({
        src: resolveImage(p.image),
        alt: p.alt,
        category: p.category ?? undefined,
      }))
    } else {
      photos = homepagePhotos(6).map((p) => ({
        src: photoSrc(p.file),
        alt: p.alt,
        category: p.category,
      }))
    }
  } catch {
    photos = homepagePhotos(6).map((p) => ({
      src: photoSrc(p.file),
      alt: p.alt,
      category: p.category,
    }))
  }

  return <RealizationGalleryClient photos={photos} />
}
