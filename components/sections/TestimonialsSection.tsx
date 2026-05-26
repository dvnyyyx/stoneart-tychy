import Link from 'next/link'
import { getTestimonials } from '@/lib/content'
import { getGoogleReviews } from '@/lib/reviews'
import { TESTIMONIALS } from '@/lib/constants'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export async function TestimonialsSection() {
  let testimonials: { author: string; location: string; quote: string }[]

  // 1. Google Places API (primary)
  const googleReviews = await getGoogleReviews()

  if (googleReviews.length > 0) {
    testimonials = googleReviews
  } else {
    // 2. Keystatic CMS (fallback)
    try {
      const fromCMS = await getTestimonials()
      testimonials = fromCMS.length > 0
        ? fromCMS
        : TESTIMONIALS.map((t) => ({ author: t.author, location: t.location, quote: t.quote }))
    } catch {
      testimonials = TESTIMONIALS.map((t) => ({ author: t.author, location: t.location, quote: t.quote }))
    }
  }

  // Na homepage pokazujemy 3 opinie
  const displayed = testimonials.slice(0, 3)

  return (
    <section className="bg-stone-dark stone-texture py-section-md overflow-hidden">
      <div className="container-stone">

        <AnimatedReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <SectionLabel variant="light">Opinie klientów</SectionLabel>
            <h2
              className="font-display text-on-dark mt-1"
              style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400 }}
            >
              Co mówią nasi klienci.
            </h2>
          </div>
          <Link href="/opinie" className="link-stone shrink-0" style={{ color: 'var(--color-gold)' }}>
            Wszystkie opinie →
          </Link>
        </AnimatedReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {displayed.map((t, i) => (
            <AnimatedReveal key={t.author} delay={i * 100}>
              <TestimonialCard
                quote={t.quote}
                author={t.author}
                location={t.location}
                variant="dark"
              />
            </AnimatedReveal>
          ))}
        </div>

        {/* Separator */}
        <div className="mt-12 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <AnimatedReveal className="bar-motif bar-motif--light">
            <div className="bar-motif__dark" />
            <div className="bar-motif__gold" />
          </AnimatedReveal>
        </div>
      </div>
    </section>
  )
}
