import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getSiteSettings } from '@/lib/content'
import { PageHeader } from '@/components/shared/PageHeader'
import { QuoteForm }  from '@/components/ui/QuoteForm'
import { BreadcrumbSchema } from '@/lib/schema'
import { Phone, Mail, MapPin } from 'lucide-react'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export const metadata: Metadata = {
  title: 'Wycena — bezpłatne zapytanie',
  description: 'Zapytaj o bezpłatną wycenę renowacji nagrobka, liternictwa lub innych prac kamieniarskich. Odpiszemy w ciągu 24 godzin.',
  alternates: { canonical: `${SITE.url}/wycena` },
}

export default async function WycenaPage() {
  let site: Awaited<ReturnType<typeof getSiteSettings>> = null
  try { site = await getSiteSettings() } catch {}

  const phone   = site?.phone   || SITE.phone
  const email   = site?.email   || SITE.email
  const address = site?.address || SITE.address
  const city    = site?.city    || SITE.city
  const hours   = site?.hours   || SITE.hours

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Wycena', href: '/wycena' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label="Wycena"
          title="Zapytaj o wycenę."
          lead="Opisz zakres prac i podaj lokalizację. Wycena jest bezpłatna i bez zobowiązań — odpiszemy lub oddzwonimy w ciągu 24 godzin."
        />
      </div>

      <section className="bg-stone-bg py-section-md">
        <div className="container-stone">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24">

            <AnimatedReveal>
              <div>
                <h2 className="font-display text-display-sm text-ink mb-8" style={{ fontWeight: 400 }}>
                  Kontakt bezpośredni
                </h2>

                <div className="flex flex-col gap-5">
                  {[
                    {
                      icon: <Phone size={18} strokeWidth={1.5} />,
                      label: 'Telefon',
                      value: phone,
                      href:  `tel:+48${phone.replace(/\s/g, '')}`,
                      note:  hours,
                    },
                    {
                      icon: <Mail size={18} strokeWidth={1.5} />,
                      label: 'E-mail',
                      value: email,
                      href:  `mailto:${email}`,
                      note:  'Odpiszemy do 24h',
                    },
                    {
                      icon: <MapPin size={18} strokeWidth={1.5} />,
                      label: 'Adres',
                      value: address,
                      href:  undefined,
                      note:  city,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-5 py-5"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <div
                        className="w-11 h-11 flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(196,184,122,0.12)', color: 'var(--color-gold-dark)' }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p
                          style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '4px' }}
                        >
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="block text-[17px] text-ink hover:text-[#A89B58] transition-colors duration-200"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[17px] text-ink" style={{ fontFamily: 'var(--font-body)' }}>
                            {item.value}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-[12px] text-ink-secondary mt-1">{item.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bar-motif mt-10">
                  <div className="bar-motif__dark" />
                  <div className="bar-motif__gold" />
                </div>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={100}>
              <div
                className="bg-stone-white p-7 lg:p-10"
                style={{ border: '1px solid var(--color-border)' }}
              >
                <h2 className="font-display text-display-sm text-ink mb-6" style={{ fontWeight: 400 }}>
                  Formularz wyceny
                </h2>
                <QuoteForm />
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>
    </>
  )
}
