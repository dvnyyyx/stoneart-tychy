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

export function RealizationGalleryClient({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const displayed = photos.slice(0, 6)
  const hasPhotos = displayed.length > 0

  return (
    <section className="bg-stone-bg py-section-md">
      <div className="container-stone">

        <AnimatedReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <SectionLabel>Realizacje</SectionLabel>
            <h2 className="font-display text-display-md text-ink mt-1">
              Wybrane prace.
            </h2>
          </div>
          <Link href="/realizacje" className="link-stone shrink-0">
            Wszystkie realizacje →
          </Link>
        </AnimatedReveal>

        {hasPhotos ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 bg-stone-border">
            {displayed.map((photo, i) => (
              <AnimatedReveal key={photo.src + i} delay={i * 70}>
                <button
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block w-full overflow-hidden bg-stone-dark aspect-stone focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                  aria-label={`Otwórz: ${photo.alt}`}
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
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 bg-stone-border" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-stone bg-stone-light" style={{ opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        )}

        <AnimatedReveal delay={150} className="mt-8 text-center">
          <p className="text-[14px] text-ink-secondary">
            Pracujemy na cmentarzach w Tychach i całym regionie śląskim.
          </p>
        </AnimatedReveal>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={displayed.map((p) => ({ src: p.src, alt: p.alt }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  )
}
