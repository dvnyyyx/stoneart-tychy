import Link from 'next/link'
import { TESTIMONIALS } from '@/lib/constants'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export function TestimonialsSection() {
  // Na homepage pokazujemy 3 opinie
  const displayed = TESTIMONIALS.slice(0, 3)

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
            <AnimatedReveal key={t.id} delay={i * 100}>
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
