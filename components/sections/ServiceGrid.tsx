import Link from 'next/link'
import { getHomepageContent, getServices } from '@/lib/content'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export async function ServiceGrid() {
  const [services, home] = await Promise.all([getServices(), getHomepageContent()])

  const featured = services.find((s) => s.featured) ?? services[0]
  if (!featured) return null

  const secondary = services.filter((s) => s.slug !== featured.slug)

  return (
    <section className="bg-stone-bg py-section-md">
      <div className="container-stone">

        <AnimatedReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <SectionLabel>{home.servicesLabel}</SectionLabel>
            <h2 className="font-display text-display-md text-ink mt-1">
              {home.servicesTitle}
            </h2>
          </div>
          <Link href="/uslugi" className="link-stone shrink-0">
            {home.servicesLinkLabel}
          </Link>
        </AnimatedReveal>

        {/*
          Desktop: karta wyróżniona po lewej, pozostałe w kolumnach po prawej.
          Mobile: wyróżniona na górze, reszta pod nią.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr_1fr] gap-px bg-stone-border">

          <AnimatedReveal className="row-span-2">
            <ServiceCard
              slug={featured.slug}
              title={featured.title}
              category={featured.category}
              description={featured.description}
              featured
              image={featured.image || undefined}
              ctaLabel={home.serviceCardCta}
              className="h-full min-h-[300px] lg:min-h-[420px]"
            />
          </AnimatedReveal>

          {secondary.map((service, i) => (
            <AnimatedReveal key={service.slug} delay={i * 80}>
              <ServiceCard
                slug={service.slug}
                title={service.title}
                category={service.category}
                description={service.description}
                image={service.image || undefined}
                className="h-full min-h-[160px]"
              />
            </AnimatedReveal>
          ))}
        </div>

        <AnimatedReveal delay={200} className="mt-10 text-center">
          <p className="text-[14px] text-ink-secondary mb-4">
            {home.servicesCtaText}
          </p>
          <Link href={home.servicesCtaHref} className="link-stone">
            {home.servicesCtaLink}
          </Link>
        </AnimatedReveal>
      </div>
    </section>
  )
}
