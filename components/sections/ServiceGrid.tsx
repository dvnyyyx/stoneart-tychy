import Link from 'next/link'
import { SERVICES } from '@/lib/constants'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export function ServiceGrid() {
  const featured  = SERVICES.find((s) => s.featured)!
  const secondary = SERVICES.filter((s) => !s.featured)

  return (
    <section className="bg-stone-bg py-section-md">
      <div className="container-stone">

        {/* Nagłówek sekcji */}
        <AnimatedReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <SectionLabel>Usługi</SectionLabel>
            <h2 className="font-display text-display-md text-ink mt-1">
              Zakres prac.
            </h2>
          </div>
          <Link href="/uslugi" className="link-stone shrink-0">
            Wszystkie usługi →
          </Link>
        </AnimatedReveal>

        {/* Grid usług — asymetryczny */}
        {/*
          Desktop: featured (duży) po lewej, 2x2 grid po prawej
          Mobile: featured na górze, reszta poniżej
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr_1fr] gap-px bg-stone-border">

          {/* Karta wyróżniona — renowacja nagrobków */}
          <AnimatedReveal className="row-span-2">
            <ServiceCard
              slug={featured.slug}
              title={featured.title}
              category={featured.category}
              description={featured.description}
              featured={true}
              className="h-full min-h-[300px] lg:min-h-[420px]"
            />
          </AnimatedReveal>

          {/* Pozostałe usługi */}
          {secondary.map((service, i) => (
            <AnimatedReveal key={service.slug} delay={i * 80}>
              <ServiceCard
                slug={service.slug}
                title={service.title}
                category={service.category}
                description={service.description}
                featured={false}
                className="h-full min-h-[160px]"
              />
            </AnimatedReveal>
          ))}
        </div>

        {/* CTA pod gridem */}
        <AnimatedReveal delay={200} className="mt-10 text-center">
          <p className="text-[14px] text-ink-secondary mb-4">
            Nie znalazłeś tego, czego szukasz?
          </p>
          <Link href="/kontakt" className="link-stone">
            Napisz do nas, wycenimy każdą pracę →
          </Link>
        </AnimatedReveal>
      </div>
    </section>
  )
}
