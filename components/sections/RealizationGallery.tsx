import { contentApi, type ContentApi } from '@/lib/content'
import { RealizationGalleryClient } from '@/components/sections/RealizationGalleryClient'

export async function RealizationGallery({ api = contentApi }: { api?: ContentApi } = {}) {
  const home = await api.getHomepageContent()
  const photos = await api.getFeaturedGallery(home.galleryLimit)

  // Brak zdjęć w CMS — sekcja znika zamiast pokazywać pustą siatkę.
  if (photos.length === 0) return null

  return (
    <RealizationGalleryClient
      photos={photos.map((p) => ({ src: p.src, alt: p.alt, category: p.categoryName }))}
      label={home.galleryLabel}
      title={home.galleryTitle}
      linkLabel={home.galleryLinkLabel}
      note={home.galleryNote}
    />
  )
}
