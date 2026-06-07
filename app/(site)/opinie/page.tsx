import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, TESTIMONIALS } from '@/lib/constants'
import { getTestimonials } from '@/lib/content'
import { getGoogleReviews } from '@/lib/reviews'
import { PageHeader } from '@/components/shared/PageHeader'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { BreadcrumbSchema } from '@/lib/schema'
import { AnimatedReveal }  from '@/components/shared/AnimatedReveal'

export const revalidate = 86400 // odświeżaj opinie Google raz na dobę

export const metadata: Metadata = {
  title: 'Opinie klientów',
  description: 'Opinie klientów StoneArt — renowacja nagrobków i prace kamieniarskie w Tychach i na Śląsku.',
  alternates: { canonical: `${SITE.url}/opinie` },
}

export default async function OpiniePage() {
  let testimonials: { author: string; location: string; quote: string; rating?: number }[]

  const googleReviews = await getGoogleReviews()

  if (googleReviews.length > 0) {
    testimonials = googleReviews
  } else {
    try {
      const fromCMS = await getTestimonials()
      testimonials = fromCMS.length > 0
        ? fromCMS.map((t) => ({ author: t.author, location: t.location, quote: t.quote, rating: t.rating }))
        : TESTIMONIALS.map((t) => ({ author: t.author, location: t.location, quote: t.quote }))
    } catch {
      testimonials = TESTIMONIALS.map((t) => ({ author: t.author, location: t.location, quote: t.quote }))
    }
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Opinie', href: '/opinie' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label="Opinie klientów"
          title="Co mówią nasi klienci."
          lead="Każda opinia pochodzi od prawdziwego klienta. Pracujemy z polecenia i na zaufaniu."
        />
      </div>

      <section className="bg-stone-dark stone-texture py-section-md">
        <div className="container-stone">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {testimonials.map((t, i) => (
              <AnimatedReveal key={t.author} delay={i * 80}>
                <TestimonialCard
                  quote={t.quote}
                  author={t.author}
                  location={t.location}
                  rating={t.rating}
                  variant="dark"
                />
              </AnimatedReveal>
            ))}
          </div>

          <AnimatedReveal delay={200} className="mt-16 text-center">
            <p className="text-on-dark-secondary text-[14px] mb-6">
              Masz doświadczenie z naszą pracownią?
            </p>
            <a
              href="https://g.page/r/CV0zVsr-ocNpEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              Napisz opinię →
            </a>
          </AnimatedReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-light py-16 text-center border-t border-stone-border">
        <div className="container-stone">
          <p className="font-display text-display-sm text-ink mb-4" style={{ fontWeight: 400 }}>
            Chcesz dołączyć do naszych klientów?
          </p>
          <Link href="/wycena" className="btn-primary">
            Zapytaj o wycenę →
          </Link>
        </div>
      </section>
    </>
  )
}
