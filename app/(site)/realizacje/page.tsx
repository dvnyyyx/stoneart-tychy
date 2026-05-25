import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { PHOTOS, photoSrc } from '@/lib/photos'
import { getGallery } from '@/lib/content'
import { BreadcrumbSchema } from '@/lib/schema'
import { RealizacjeClient } from '@/components/sections/RealizacjeClient'

export const metadata: Metadata = {
  title: 'Realizacje',
  description: 'Galeria prac StoneArt — liternictwo nagrobne, renowacja nagrobków i piaskowanie napisów w Tychach i na Śląsku.',
  alternates: { canonical: `${SITE.url}/realizacje` },
}

export default async function RealizacjePage() {
  let photos: { src: string; alt: string; category?: string }[]
  try {
    const fromCMS = await getGallery()
    if (fromCMS.length > 0) {
      photos = fromCMS.map((p) => ({
        src: p.image ?? '',
        alt: p.alt,
        category: p.category ?? undefined,
      }))
    } else {
      photos = PHOTOS.map((p) => ({
        src: photoSrc(p.file),
        alt: p.alt,
        category: p.category,
      }))
    }
  } catch {
    photos = PHOTOS.map((p) => ({
      src: photoSrc(p.file),
      alt: p.alt,
      category: p.category,
    }))
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Realizacje', href: '/realizacje' }]} />
      <RealizacjeClient photos={photos} />
    </>
  )
}
