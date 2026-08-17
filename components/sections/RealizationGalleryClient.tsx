'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SectionLabel }   from '@/components/shared/SectionLabel'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'
import { Lightbox }       from '@/components/ui/Lightbox'

interface Photo {
  src: string
  alt: string
  category?: string
}

interface Props {
  photos: Photo[]
  label: string
  title: string
  linkLabel: string
  note: string
}

export function RealizationGalleryClient({ photos, label, title, linkLabel, note }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <section className="bg-stone-bg py-section-md">
      <div className="container-stone">

        <AnimatedReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <SectionLabel>{label}</SectionLabel>
            <h2 className="font-display text-display-md text-ink mt-1">
              {title}
            </h2>
          </div>
          <Link href="/realizacje" className="link-stone shrink-0">
            {linkLabel}
          </Link>
        </AnimatedReveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 bg-stone-border">
          {photos.map((photo, i) => (
            <AnimatedReveal key={photo.src + i} delay={i * 70}>
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group relative block w-full overflow-hidden bg-stone-dark aspect-stone focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                aria-label={`Otwórz zdjęcie: ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-all duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-stone-dark/0 group-hover:bg-stone-dark/45 transition-colors duration-300 flex flex-col justify-end p-4">
                  <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {photo.category && (
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                        {photo.category}
                      </span>
                    )}
                    <span style={{ display: 'block', fontSize: '11px', color: 'white', marginTop: '2px' }}>
                      {photo.alt}
                    </span>
                  </div>
                </div>
              </button>
            </AnimatedReveal>
          ))}
        </div>

        {note && (
          <AnimatedReveal delay={150} className="mt-8 text-center">
            <p className="text-[14px] text-ink-secondary">{note}</p>
          </AnimatedReveal>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={photos.map((p) => ({ src: p.src, alt: p.alt }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  )
}
