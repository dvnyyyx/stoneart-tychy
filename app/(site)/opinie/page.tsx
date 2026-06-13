import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, TESTIMONIALS } from '@/lib/constants'
import { getTestimonials } from '@/lib/content'
import { PageHeader } from '@/components/shared/PageHeader'
import { ReviewsList, type Review } from '@/components/ui/ReviewsList'
import { BreadcrumbSchema } from '@/lib/schema'
import { AnimatedReveal }  from '@/components/shared/AnimatedReveal'

export const metadata: Metadata = {
  title: 'Opinie klientów',
  description: 'Opinie klientów StoneArt — renowacja nagrobków i prace kamieniarskie w Tychach i na Śląsku.',
  alternates: { canonical: `${SITE.url}/opinie` },
}

export default async function OpiniePage() {
  // Bazowe opinie renderowane serwerowo (CMS → stałe). Świeże opinie Google
  // dociąga ReviewsList po stronie klienta z /api/reviews — strona pozostaje
  // statyczna, więc galeria i pozostałe zdjęcia nie znikają przy re-renderze.
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
          <ReviewsList
            initial={initial}
            gridClassName="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16"
            delayStep={80}
          />

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
