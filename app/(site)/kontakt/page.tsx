import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/constants'
import { PageHeader } from '@/components/shared/PageHeader'
import { BreadcrumbSchema } from '@/lib/schema'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export const metadata: Metadata = {
  title: 'Kontakt — Tychy, Śląskie',
  description: `Skontaktuj się z StoneArt. Tel: ${SITE.phone}, e-mail: ${SITE.email}. ${SITE.address}.`,
  alternates: { canonical: `${SITE.url}/kontakt` },
}

export default function KontaktPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Kontakt', href: '/kontakt' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label="Kontakt"
          title="Skontaktuj się z nami."
          lead={`Pracujemy od poniedziałku do piątku, ${SITE.hours}. Odpiszemy lub oddzwonimy najszybciej jak to możliwe.`}
        />
      </div>

      <section className="bg-stone-bg py-section-md">
        <div className="container-stone">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-border">

            {[
              {
                icon:  <Phone size={22} strokeWidth={1.5} />,
                label: 'Telefon',
                main:  SITE.phone,
                href:  SITE.phoneHref,
                sub:   SITE.hours,
                cta:   'Zadzwoń teraz',
              },
              {
                icon:  <Mail size={22} strokeWidth={1.5} />,
                label: 'E-mail',
                main:  SITE.email,
                href:  `mailto:${SITE.email}`,
                sub:   'Odpiszemy w ciągu 24 godzin',
                cta:   'Napisz wiadomość',
              },
              {
                icon:  <MapPin size={22} strokeWidth={1.5} />,
                label: 'Adres',
                main:  SITE.address,
                href:  `https://maps.google.com/?q=${encodeURIComponent(SITE.address + ', ' + SITE.city)}`,
                sub:   `${SITE.city}, woj. ${SITE.region}`,
                cta:   'Pokaż na mapie',
              },
            ].map((item, i) => (
              <AnimatedReveal key={i} delay={i * 80}>
                <div className="bg-stone-bg p-8 lg:p-10 h-full flex flex-col gap-5">
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ background: 'rgba(196,184,122,0.12)', color: 'var(--color-gold-dark)' }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p
                      style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '8px' }}
                    >
                      {item.label}
                    </p>
                    <a
                      href={item.href}
                      className="block font-display text-[22px] text-ink hover:text-[#A89B58] transition-colors duration-200 leading-[1.2] mb-2"
                      style={{ fontWeight: 400 }}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {item.main}
                    </a>
                    <p className="text-[13px] text-ink-secondary">{item.sub}</p>
                  </div>
                  <a href={item.href} className="link-stone mt-auto self-start">
                    {item.cta} →
                  </a>
                </div>
              </AnimatedReveal>
            ))}
          </div>

          {/* CTA do wyceny */}
          <AnimatedReveal delay={200} className="mt-16 text-center">
            <p className="font-display text-display-sm text-ink mb-4" style={{ fontWeight: 400 }}>
              Wolisz wypełnić formularz?
            </p>
            <Link href="/wycena" className="btn-primary">
              Zapytaj o wycenę →
            </Link>
          </AnimatedReveal>
        </div>
      </section>
    </>
  )
}
