import { Phone, Mail } from 'lucide-react'
import { getQuoteFormContent, getSiteSettings } from '@/lib/content'
import { telHref, mailHref } from '@/lib/utils'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { QuoteForm } from '@/components/ui/QuoteForm'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export async function QuoteSection() {
  const [form, site] = await Promise.all([getQuoteFormContent(), getSiteSettings()])
  const titleLines = form.sectionTitle.split('\n').filter(Boolean)

  return (
    <section
      id="wycena"
      className="bg-stone-light stone-texture py-section-md"
      aria-labelledby="quote-heading"
    >
      <div className="container-stone">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-20">

          {/* Lewa kolumna — tekst */}
          <AnimatedReveal className="flex flex-col justify-center">
            <SectionLabel className="mb-4">{form.sectionLabel}</SectionLabel>

            <h2
              id="quote-heading"
              className="font-display text-ink leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400 }}
            >
              {titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h2>

            <p className="text-body-md text-ink-secondary prose-stone leading-[1.75] mb-8">
              {form.sectionText}
            </p>

            <div className="flex flex-col gap-4">
              <a
                href={telHref(site.phone)}
                className="group flex items-center gap-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(196,184,122,0.12)' }}
                >
                  <Phone size={16} strokeWidth={1.5} style={{ color: 'var(--color-gold-dark)' }} aria-hidden="true" />
                </div>
                <div>
                  <span
                    className="block text-[17px] font-[400] text-ink group-hover:text-[#A89B58] transition-colors duration-200"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {site.phone}
                  </span>
                  <span className="block text-[11px] text-ink-secondary mt-0.5">{site.hours}</span>
                </div>
              </a>

              <a
                href={mailHref(site.email)}
                className="group flex items-center gap-4 py-3"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(196,184,122,0.12)' }}
                >
                  <Mail size={16} strokeWidth={1.5} style={{ color: 'var(--color-gold-dark)' }} aria-hidden="true" />
                </div>
                <div>
                  <span
                    className="block text-[15px] text-ink-secondary group-hover:text-ink transition-colors duration-200 break-all"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {site.email}
                  </span>
                  <span className="block text-[11px] text-ink-secondary mt-0.5">{form.emailNote}</span>
                </div>
              </a>
            </div>

            <div className="bar-motif mt-10" aria-hidden="true">
              <div className="bar-motif__dark" />
              <div className="bar-motif__gold" />
            </div>
          </AnimatedReveal>

          {/* Prawa kolumna — formularz */}
          <AnimatedReveal delay={120}>
            <div
              className="bg-stone-white p-7 lg:p-9"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <QuoteForm content={form} phone={site.phone} />
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  )
}
