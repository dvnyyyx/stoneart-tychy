import Link from 'next/link'
import { contentApi, type ContentApi } from '@/lib/content'
import { PageHeader } from '@/components/shared/PageHeader'
import { ReviewsList, type Review } from '@/components/ui/ReviewsList'
import { BreadcrumbSchema } from '@/lib/schema'
import { AnimatedReveal }  from '@/components/shared/AnimatedReveal'

export async function OpiniePageContent({ api = contentApi }: { api?: ContentApi } = {}) {
  // Bazowe opinie renderowane serwerowo z CMS. Świeże opinie Google dociąga
  // ReviewsList po stronie klienta z /api/reviews — strona zostaje statyczna,
  // więc zdjęcia i pozostałe sekcje nie znikają przy re-renderze.
  const [testimonials, cms] = await Promise.all([api.getTestimonials(), api.getOpiniePageContent()])

  const initial: Review[] = testimonials.map((t) => ({
    author: t.author,
    location: t.location,
    quote: t.quote,
    rating: t.rating,
  }))

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Opinie', href: '/opinie' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader label={cms.pageLabel} title={cms.pageTitle} lead={cms.pageLead} />
      </div>

      <section className="bg-stone-dark stone-texture py-section-md">
        <div className="container-stone">
          {initial.length > 0 ? (
            <ReviewsList
              initial={initial}
              gridClassName="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16"
              delayStep={80}
            />
          ) : (
            <p className="text-on-dark-secondary text-[15px] text-center py-12">
              Opinie pojawią się wkrótce.
            </p>
          )}

          {cms.reviewCtaUrl && (
            <AnimatedReveal delay={200} className="mt-16 text-center">
              <p className="text-on-dark-secondary text-[14px] mb-6">
                {cms.reviewCtaText}
              </p>
              <a
                href={cms.reviewCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                {cms.reviewCtaButton}
              </a>
            </AnimatedReveal>
          )}
        </div>
      </section>

      <section className="bg-stone-light py-16 text-center border-t border-stone-border">
        <div className="container-stone">
          <p className="font-display text-display-sm text-ink mb-4" style={{ fontWeight: 400 }}>
            {cms.bottomText}
          </p>
          <Link href={cms.bottomHref} className="btn-primary">
            {cms.bottomButton}
          </Link>
        </div>
      </section>
    </>
  )
}
