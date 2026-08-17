import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getQuoteFormContent, getSiteSettings, getWycenaPageContent } from '@/lib/content'
import { telHref, mailHref } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader'
import { QuoteForm }  from '@/components/ui/QuoteForm'
import { BreadcrumbSchema } from '@/lib/schema'
import { Phone, Mail, MapPin } from 'lucide-react'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getWycenaPageContent()
  return {
    title: cms.metaTitle || cms.pageTitle,
    description: cms.metaDescription || cms.pageLead,
    alternates: { canonical: `${SITE_URL}/wycena` },
  }
}

export default async function WycenaPage() {
  const [cms, site, form] = await Promise.all([
    getWycenaPageContent(),
    getSiteSettings(),
    getQuoteFormContent(),
  ])

  const contacts = [
    {
      icon: <Phone size={18} strokeWidth={1.5} />,
      label: cms.phoneLabel,
      value: site.phone,
      href: telHref(site.phone),
      note: site.hours,
    },
    {
      icon: <Mail size={18} strokeWidth={1.5} />,
      label: cms.emailLabel,
      value: site.email,
      href: mailHref(site.email),
      note: cms.emailNote,
    },
    {
      icon: <MapPin size={18} strokeWidth={1.5} />,
      label: cms.addressLabel,
      value: site.address,
      href: undefined,
      note: `${site.postcode} ${site.city}`,
    },
  ]

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Wycena', href: '/wycena' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader label={cms.pageLabel} title={cms.pageTitle} lead={cms.pageLead} />
      </div>

      <section className="bg-stone-bg py-section-md">
        <div className="container-stone">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24">

            <AnimatedReveal>
              <div>
                <h2 className="font-display text-display-sm text-ink mb-8" style={{ fontWeight: 400 }}>
                  {cms.contactTitle}
                </h2>

                <div className="flex flex-col gap-5">
                  {contacts.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-5 py-5"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <div
                        className="w-11 h-11 flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(196,184,122,0.12)', color: 'var(--color-gold-dark)' }}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p
                          style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '4px' }}
                        >
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="block text-[17px] text-ink hover:text-[#A89B58] transition-colors duration-200 break-words"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[17px] text-ink" style={{ fontFamily: 'var(--font-body)' }}>
                            {item.value}
                          </p>
                        )}
                        {item.note && <p className="text-[12px] text-ink-secondary mt-1">{item.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bar-motif mt-10" aria-hidden="true">
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
                  {cms.formTitle}
                </h2>
                <QuoteForm content={form} phone={site.phone} />
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>
    </>
  )
}
