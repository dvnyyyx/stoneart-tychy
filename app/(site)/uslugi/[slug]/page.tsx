import type { Metadata } from 'next'
import { notFound }       from 'next/navigation'
import Link               from 'next/link'
import Image              from 'next/image'
import { Check }          from 'lucide-react'
import { SERVICES, SITE } from '@/lib/constants'
import { PHOTOS, photoSrc } from '@/lib/photos'
import { PageHeader }     from '@/components/shared/PageHeader'
import { QuoteSection }   from '@/components/sections/QuoteSection'
import { ServiceSchema, BreadcrumbSchema } from '@/lib/schema'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = SERVICES.find((s) => s.slug === params.slug)
  if (!service) return {}

  return {
    title: `${service.title} — Tychy i Śląsk`,
    description: service.description,
    alternates: { canonical: `${SITE.url}/uslugi/${service.slug}` },
    openGraph: {
      title: `${service.title} | StoneArt Tychy`,
      description: service.description,
      url: `${SITE.url}/uslugi/${service.slug}`,
    },
  }
}

export default function ServicePage({ params }: PageProps) {
  const service = SERVICES.find((s) => s.slug === params.slug)
  if (!service) notFound()

  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 2)

  // Pierwsze dostępne zdjęcie z galerii jako okładka usługi
  const coverPhoto = PHOTOS[0] ? photoSrc(PHOTOS[0].file) : null

  return (
    <>
      <ServiceSchema slug={service.slug} />
      <BreadcrumbSchema
        items={[
          { name: 'Usługi', href: '/uslugi' },
          { name: service.title, href: `/uslugi/${service.slug}` },
        ]}
      />

      {/* Header */}
      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label={service.category}
          title={service.title}
          lead={service.description}
        />
      </div>

      {/* Zdjęcie główne + zakres */}
      <section className="bg-stone-bg py-section-sm">
        <div className="container-stone">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Zdjęcie */}
            <AnimatedReveal direction="fade">
              {coverPhoto ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={coverPhoto}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                /* Placeholder — zanim dodasz zdjęcia */
                <div
                  className="aspect-[4/3] bg-stone-dark flex items-end p-8"
                  style={{ background: 'linear-gradient(135deg, #2D2D2D 0%, #1a1a1a 100%)' }}
                >
                  <div className="bar-motif">
                    <div className="bar-motif__dark" />
                    <div className="bar-motif__gold" />
                  </div>
                </div>
              )}
            </AnimatedReveal>

            {/* Zakres prac */}
            <AnimatedReveal delay={100}>
              <p
                className="mb-8"
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-gold-dark)' }}
              >
                Zakres prac
              </p>
              <ul className="flex flex-col gap-0" role="list">
                {service.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 py-4"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <div
                      className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(196,184,122,0.15)' }}
                    >
                      <Check size={11} strokeWidth={2} style={{ color: 'var(--color-gold-dark)' }} />
                    </div>
                    <span className="text-[16px] text-ink-secondary leading-[1.6]">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/wycena" className="btn-primary">
                  Zapytaj o wycenę
                </Link>
                <a href="tel:+48734130388" className="btn-ghost flex items-center gap-2">
                  734 130 388
                </a>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* Inne usługi */}
      {related.length > 0 && (
        <section className="bg-stone-light py-section-sm border-t border-stone-border">
          <div className="container-stone">
            <p
              className="mb-8"
              style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-text-2)' }}
            >
              Inne usługi
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-stone-border">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/uslugi/${s.slug}`}
                  className="group bg-stone-light p-6 flex flex-col gap-3 hover:bg-stone-bg transition-colors duration-200"
                >
                  <span
                    style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gold-dark)' }}
                  >
                    {s.category}
                  </span>
                  <span className="font-display text-[20px] text-ink" style={{ fontWeight: 400 }}>
                    {s.title}
                  </span>
                  <span className="link-stone mt-auto">Więcej →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Formularz wyceny */}
      <QuoteSection />
    </>
  )
}
