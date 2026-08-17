'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { PageHeader }     from '@/components/shared/PageHeader'
import { Lightbox }       from '@/components/ui/Lightbox'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'
import { SectionLabel }   from '@/components/shared/SectionLabel'
import { cn } from '@/lib/utils'

export interface GalleryItem {
  src: string
  alt: string
  /** slug kategorii — klucz filtrowania */
  category: string
  /** etykieta kategorii do wyświetlenia */
  categoryName: string
}

export interface FilterOption {
  slug: string
  name: string
}

interface Props {
  photos: GalleryItem[]
  filters: FilterOption[]
  phoneHref: string
  content: {
    pageLabel: string
    pageTitle: string
    pageLead: string
    galleryLabel: string
    allFilterLabel: string
    emptyTitle: string
    emptyText: string
    ctaButton: string
  }
}

export function RealizacjeClient({ photos, filters, phoneHref, content }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  // Filtrujemy najpierw, a lightbox dostaje już przefiltrowaną listę —
  // inaczej indeksy rozjeżdżały się po zmianie filtra.
  const visible = useMemo(
    () => (activeFilter === 'all' ? photos : photos.filter((p) => p.category === activeFilter)),
    [photos, activeFilter]
  )

  const hasPhotos = photos.length > 0
  const showFilters = filters.length > 1

  const selectFilter = (slug: string) => {
    setActiveFilter(slug)
    setLightboxIndex(null)
  }

  return (
    <>
      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label={content.pageLabel}
          title={content.pageTitle}
          lead={content.pageLead}
        />
      </div>

      <section className="bg-stone-bg py-section-md">
        <div className="container-stone">

          {hasPhotos ? (
            <>
              <AnimatedReveal>
                <SectionLabel className="mb-6">{content.galleryLabel}</SectionLabel>
              </AnimatedReveal>

              {showFilters && (
                <div
                  className="flex flex-wrap gap-2 mb-8"
                  role="group"
                  aria-label="Filtruj realizacje według kategorii"
                >
                  {[{ slug: 'all', name: content.allFilterLabel }, ...filters].map((f) => (
                    <button
                      key={f.slug}
                      type="button"
                      onClick={() => selectFilter(f.slug)}
                      aria-pressed={activeFilter === f.slug}
                      className={cn(
                        'px-4 py-2 border transition-all duration-200',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold'
                      )}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        borderColor: activeFilter === f.slug ? 'var(--color-gold)' : 'var(--color-border)',
                        color: activeFilter === f.slug ? 'var(--color-gold-dark)' : 'var(--color-text-2)',
                        background: activeFilter === f.slug ? 'rgba(196,184,122,0.08)' : 'transparent',
                      }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              )}

              {visible.length > 0 ? (
                <div className="columns-2 md:columns-3 gap-1 space-y-1">
                  {visible.map((photo, i) => (
                    <AnimatedReveal key={photo.src} delay={i * 40} className="break-inside-avoid">
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(i)}
                        className="group relative w-full overflow-hidden bg-stone-dark block focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                        aria-label={`Otwórz zdjęcie: ${photo.alt}`}
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
                            {photo.categoryName && (
                              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '3px' }}>
                                {photo.categoryName}
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
              ) : (
                <p className="text-[14px] text-ink-secondary py-12 text-center" role="status">
                  Brak zdjęć w tej kategorii.
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-stone-border">
              <div className="bar-motif justify-center mb-8" aria-hidden="true">
                <div className="bar-motif__dark" />
                <div className="bar-motif__gold" />
              </div>
              <p className="font-display text-[22px] text-ink mb-3" style={{ fontWeight: 400 }}>
                {content.emptyTitle}
              </p>
              <p className="text-[14px] text-ink-secondary max-w-[340px] leading-[1.75]">
                {content.emptyText}
              </p>
            </div>
          )}

          <AnimatedReveal delay={200} className="mt-16 text-center">
            <a href={phoneHref} className="btn-primary">
              {content.ctaButton}
            </a>
          </AnimatedReveal>
        </div>
      </section>

      {lightboxIndex !== null && visible[lightboxIndex] && (
        <Lightbox
          images={visible.map((p) => ({ src: p.src, alt: p.alt }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
