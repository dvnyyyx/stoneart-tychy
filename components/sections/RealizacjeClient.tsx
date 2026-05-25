'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PageHeader }     from '@/components/shared/PageHeader'
import { Lightbox }       from '@/components/ui/Lightbox'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'
import { SectionLabel }   from '@/components/shared/SectionLabel'

interface Photo {
  src: string
  alt: string
  category?: string
}

export function RealizacjeClient({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const hasPhotos = photos.length > 0

  return (
    <>
      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label="Realizacje"
          title="Wybrane prace."
          lead="Dokumentacja naszych zleceń — dopiski, renowacje, prace kamieniarskie."
        />
      </div>

      <section className="bg-stone-bg py-section-md">
        <div className="container-stone">

          {hasPhotos ? (
            <>
              <AnimatedReveal>
                <SectionLabel className="mb-8">Galeria prac</SectionLabel>
              </AnimatedReveal>

              <div className="columns-2 md:columns-3 gap-1 space-y-1">
                {photos.map((photo, i) => (
                  <AnimatedReveal key={photo.src + i} delay={i * 40} className="break-inside-avoid">
                    <button
                      onClick={() => setLightboxIndex(i)}
                      className="group relative w-full overflow-hidden bg-stone-dark block focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                      aria-label={`Otwórz: ${photo.alt}`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={600}
                        height={800}
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-stone-dark/0 group-hover:bg-stone-dark/50 transition-colors duration-300 flex flex-col justify-end p-4">
                        <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          {photo.category && (
                            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '3px' }}>
                              {photo.category}
                            </span>
                          )}
                          <span style={{ display: 'block', fontSize: '12px', color: 'white', lineHeight: 1.4 }}>
                            {photo.alt}
                          </span>
                        </div>
                      </div>
                    </button>
                  </AnimatedReveal>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-stone-border">
              <div className="bar-motif justify-center mb-8">
                <div className="bar-motif__dark" />
                <div className="bar-motif__gold" />
              </div>
              <p className="font-display text-[22px] text-ink mb-3" style={{ fontWeight: 400 }}>
                Galeria w przygotowaniu.
              </p>
              <p className="text-[14px] text-ink-secondary max-w-[340px] leading-[1.75]">
                Zdjęcia realizacji będą dostępne wkrótce.
                Zapraszamy do kontaktu — chętnie opowiemy o zakresie naszych prac.
              </p>
            </div>
          )}

          <AnimatedReveal delay={200} className="mt-16 text-center">
            <a href="tel:+48734130388" className="btn-primary">
              Zadzwoń po bezpłatną wycenę →
            </a>
          </AnimatedReveal>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={photos.map((p) => ({ src: p.src, alt: p.alt }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
