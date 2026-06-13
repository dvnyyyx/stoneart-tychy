import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getGallery, resolveImage } from '@/lib/content'
import { BreadcrumbSchema } from '@/lib/schema'
import { RealizacjeClient } from '@/components/sections/RealizacjeClient'

export const metadata: Metadata = {
  title: 'Realizacje — liternictwo i renowacja nagrobków',
  description: 'Galeria prac StoneArt — liternictwo nagrobne, renowacja nagrobków i piaskowanie napisów w Tychach i na Śląsku.',
  alternates: { canonical: `${SITE.url}/realizacje` },
}

export default async function RealizacjePage() {
  let photos: { src: string; alt: string; category?: string }[] = []
  try {
    const fromCMS = await getGallery()
    photos = fromCMS.map((p) => ({
      src: resolveImage(p.image),
      alt: p.alt,
      category: p.category ?? undefined,
    }))
  } catch {
    // brak zdjęć
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Realizacje', href: '/realizacje' }]} />
      <RealizacjeClient photos={photos} />
    </>
  )
}
