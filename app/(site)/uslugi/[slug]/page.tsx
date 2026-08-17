import type { Metadata } from 'next'
import { notFound }       from 'next/navigation'
import Link               from 'next/link'
import Image              from 'next/image'
import { Check }          from 'lucide-react'
import { SITE_URL } from '@/lib/constants'
import { getServices, getService, getSiteSettings, getUslugiPageContent } from '@/lib/content'
import { telHref } from '@/lib/utils'
import { PageHeader }     from '@/components/shared/PageHeader'
import { QuoteSection }   from '@/components/sections/QuoteSection'
import { ServiceSchema, BreadcrumbSchema } from '@/lib/schema'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

interface PageProps {
  params: { slug: string }
}

export const revalidate = false
// Slug spoza CMS → 404 zamiast prób renderowania w runtime.
export const dynamicParams = false

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = await getService(params.slug)
  if (!service) return {}

  const title = service.metaTitle || `${service.title} — Tychy i Śląsk`
  const description = service.metaDescription || service.description

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/uslugi/${service.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/uslugi/${service.slug}`,
    },
  }
}

export default async function ServicePage({ params }: PageProps) {
  const [service, allServices, site, cms] = await Promise.all([
    getService(params.slug),
    getServices(),
    getSiteSettings(),
    getUslugiPageContent(),
  ])
  if (!service) notFound()

  const related = allServices.filter((s) => s.slug !== service.slug).slice(0, 2)

  return (
    <>
      <ServiceSchema service={service} />
      <BreadcrumbSchema
        items={[
          { name: 'Usługi', href: '/uslugi' },
          { name: service.title, href: `/uslugi/${service.slug}` },
        ]}
      />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label={service.category || cms.pageLabel}
          title={service.title}
          lead={service.description}
        />
      </div>

      <section className="bg-stone-bg py-section-sm">
        <div className="container-stone">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            <AnimatedReveal direction="fade">
              {service.image ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.title} — ${site.companyName} ${site.city}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div
                  className="aspect-[4/3] bg-stone-dark flex items-end p-8"
                  style={{ background: 'linear-gradient(135deg, #2D2D2D 0%, #1a1a1a 100%)' }}
                  aria-hidden="true"
                >
                  <div className="bar-motif">
                    <div className="bar-motif__dark" />
                    <div className="bar-motif__gold" />
                  </div>
                </div>
              )}
            </AnimatedReveal>

            <AnimatedReveal delay={100}>
              {service.features.length > 0 && (
                <>
                  <p
                    className="mb-8"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-gold-dark)' }}
                  >
                    {cms.detailScopeLabel}
                  </p>
                  <ul className="flex flex-col gap-0">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 py-4"
                        style={{ borderBottom: '1px solid var(--color-border)' }}
                      >
                        <div
                          className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: 'rgba(196,184,122,0.15)' }}
                          aria-hidden="true"
                        >
                          <Check size={11} strokeWidth={2} style={{ color: 'var(--color-gold-dark)' }} />
                        </div>
                        <span className="text-[16px] text-ink-secondary leading-[1.6]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/wycena" className="btn-primary">
                  {cms.detailCtaButton}
                </Link>
                <a href={telHref(site.phone)} className="btn-ghost flex items-center gap-2">
                  {site.phone}
                </a>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-stone-light py-section-sm border-t border-stone-border">
          <div className="container-stone">
            <p
              className="mb-8"
              style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-text-2)' }}
            >
              {cms.detailRelatedLabel}
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
                  <span className="link-stone mt-auto">{cms.moreLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteSection />
    </>
  )
}
