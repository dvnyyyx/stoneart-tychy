import { contentApi, type ContentApi } from '@/lib/content'
import { fillTemplate, toParagraphs } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader'
import { BreadcrumbSchema } from '@/lib/schema'

export async function PolitykaPrywatnosciContent({ api = contentApi }: { api?: ContentApi } = {}) {
  const [cms, site] = await Promise.all([api.getPrivacyPageContent(), api.getSiteSettings()])

  // Klient może wpleść dane firmy w dowolny akapit — bez dotykania kodu.
  const vars = {
    firma: site.companyFullName,
    wlasciciel: site.owner,
    telefon: site.phone,
    email: site.email,
    adres: site.address,
    ulica: site.street,
    kod: site.postcode,
    miasto: site.city,
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Polityka Prywatności', href: '/polityka-prywatnosci' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader label={cms.pageLabel} title={cms.pageTitle} lead={cms.pageLead} />
      </div>

      <section className="section-padding bg-stone-bg">
        <div className="container-stone">
          <article
            className="prose-stone"
            style={{ maxWidth: '720px', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.9, color: 'var(--color-text)' }}
          >
            {cms.sections.map((section, i) => (
              <div key={i} style={{ marginBottom: '48px' }}>
                <h2
                  style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, marginBottom: '16px', color: 'var(--color-text)' }}
                >
                  {section.heading}
                </h2>
                {toParagraphs(fillTemplate(section.body, vars)).map((p, j) => (
                  <p key={j} style={{ marginTop: j > 0 ? '12px' : 0 }}>{p}</p>
                ))}
                {section.bullets.length > 0 && (
                  <ul style={{ marginTop: '12px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'disc' }}>
                    {section.bullets.map((b, j) => (
                      <li key={j}>{fillTemplate(b, vars)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {cms.updatedAt && (
              <p style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>
                Ostatnia aktualizacja: {cms.updatedAt}
              </p>
            )}
          </article>
        </div>
      </section>
    </>
  )
}
