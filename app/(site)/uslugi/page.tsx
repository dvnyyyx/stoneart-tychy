import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/constants'
import { getServices } from '@/lib/content'
import { PageHeader }   from '@/components/shared/PageHeader'
import { BreadcrumbSchema } from '@/lib/schema'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export const metadata: Metadata = {
  title: 'Usługi kamieniarsko-liternicze — Tychy i okolice',
  description: 'Liternictwo nagrobne, dopiski liter i dat, piaskowanie napisów, renowacja nagrobków i montaż tablic. Klienci i zakłady kamieniarskie — Tychy i okolice.',
  alternates: { canonical: `${SITE.url}/uslugi` },
}

export default async function UslugiPage() {
  const services = await getServices()

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Usługi', href: '/uslugi' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label="Usługi"
          title="Zakres prac."
          lead="Wykonujemy nowe napisy, dopiski liter i dat oraz odnawiamy nagrobki i tablice granitowe. Klienci indywidualni i zakłady kamieniarskie — Tychy i okolice."
        />
      </div>

      <section className="bg-stone-bg py-section-md">
        <div className="container-stone">
          <div className="grid grid-cols-1 gap-px bg-stone-border">
            {services.map((service, i) => (
              <AnimatedReveal key={service.slug} delay={i * 80}>
                <Link
                  href={`/uslugi/${service.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-[1fr_3fr_auto] gap-6 lg:gap-12 items-start bg-stone-bg hover:bg-stone-light transition-colors duration-200 p-7 lg:p-9"
                >
                  <div>
                    <span
                      style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-gold-dark)' }}
                    >
                      {service.category}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-[24px] text-ink mb-3 leading-[1.15]" style={{ fontWeight: 400 }}>
                      {service.title}
                      {service.featured && (
                        <span
                          className="ml-3 inline-block"
                          style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', padding: '2px 8px', verticalAlign: 'middle' }}
                        >
                          Specjalizacja
                        </span>
                      )}
                    </h2>
                    <p className="text-[15px] text-ink-secondary leading-[1.75] max-w-[520px]">
                      {service.description}
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center">
                    <span className="link-stone whitespace-nowrap group-hover:text-gold-dark transition-colors">
                      Więcej →
                    </span>
                  </div>
                </Link>
              </AnimatedReveal>
            ))}
          </div>

          <AnimatedReveal delay={200} className="mt-12 text-center">
            <p className="text-[14px] text-ink-secondary mb-4">
              Nie znalazłeś tego, czego szukasz?
            </p>
            <Link href="/kontakt" className="btn-primary">
              Napisz do nas →
            </Link>
          </AnimatedReveal>
        </div>
      </section>
    </>
  )
}
