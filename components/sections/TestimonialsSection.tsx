import Link from 'next/link'
import { getTestimonials } from '@/lib/content'
import { TESTIMONIALS } from '@/lib/constants'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { ReviewsList, type Review } from '@/components/ui/ReviewsList'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export async function TestimonialsSection() {
  // Bazowe opinie renderowane serwerowo (CMS → stałe). Świeże opinie Google
  // dociąga ReviewsList po stronie klienta z /api/reviews — strona główna
  // pozostaje statyczna.
  let initial: Review[]
  try {
    const fromCMS = await getTestimonials()
    initial = fromCMS.length > 0
      ? fromCMS.map((t) => ({ author: t.author, location: t.location, quote: t.quote, rating: t.rating }))
      : TESTIMONIALS.map((t) => ({ author: t.author, location: t.location, quote: t.quote }))
  } catch {
    initial = TESTIMONIALS.map((t) => ({ author: t.author, location: t.location, quote: t.quote }))
  }

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

        <ReviewsList
          initial={initial}
          limit={3}
          gridClassName="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16"
          delayStep={100}
        />

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
