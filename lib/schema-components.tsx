import { SITE_URL, OG_IMAGE, LOGO_PATH } from './constants'
import { contentApi } from './content'
import { telHref } from './utils'
import type { ContentApi, ServiceEntry } from './content'

// JSON-LD dla Google. Wszystkie dane firmowe pochodzą z Keystatica
// (content/settings/site.json), więc zmiana telefonu czy godzin w CMS
// aktualizuje też dane strukturalne — bez dotykania kodu.

function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export async function LocalBusinessSchema({ api = contentApi }: { api?: ContentApi } = {}) {
  const site = await api.getSiteSettings()

  const sameAs = [site.googleProfileUrl, site.facebookUrl].filter(
    (url): url is string => Boolean(url)
  )

  const latitude = Number.parseFloat(site.latitude)
  const longitude = Number.parseFloat(site.longitude)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: site.companyFullName,
    alternateName: site.companyName,
    description: site.description,
    url: SITE_URL,
    telephone: telHref(site.phone).replace('tel:', ''),
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      addressLocality: site.city,
      postalCode: site.postcode,
      addressRegion: site.region,
      addressCountry: 'PL',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: site.opensAt,
        closes: site.closesAt,
      },
    ],
    areaServed: {
      '@type': 'State',
      name: `województwo ${site.region.toLowerCase()}`,
    },
    knowsAbout: [
      'Piaskowanie liter na nagrobkach',
      'Dopiski i uzupełnianie inskrypcji',
      'Renowacja nagrobków granitowych',
      'Montaż tablic nagrobnych',
    ],
    priceRange: '$$',
    image: `${SITE_URL}${OG_IMAGE}`,
    logo: `${SITE_URL}${LOGO_PATH}`,
  }

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    schema.geo = { '@type': 'GeoCoordinates', latitude, longitude }
  }
  if (sameAs.length > 0) schema.sameAs = sameAs

  return <JsonLd schema={schema} />
}

export async function WebSiteSchema({ api = contentApi }: { api?: ContentApi } = {}) {
  const site = await api.getSiteSettings()

  return (
    <JsonLd
      schema={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: site.companyFullName,
        alternateName: site.companyName,
        url: SITE_URL,
        inLanguage: 'pl-PL',
        publisher: { '@id': `${SITE_URL}/#business` },
      }}
    />
  )
}

export async function ServiceSchema({
  service,
  api = contentApi,
}: {
  service: ServiceEntry
  api?: ContentApi
}) {
  const site = await api.getSiteSettings()

  return (
    <JsonLd
      schema={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.description,
        provider: {
          '@type': 'LocalBusiness',
          name: site.companyFullName,
          '@id': `${SITE_URL}/#business`,
        },
        serviceType: service.title,
        areaServed: [
          { '@type': 'City', name: site.city },
          { '@type': 'AdministrativeArea', name: `województwo ${site.region.toLowerCase()}` },
        ],
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PLN',
          availability: 'https://schema.org/InStock',
        },
        url: `${SITE_URL}/uslugi/${service.slug}`,
      }}
    />
  )
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; href: string }>
}) {
  return (
    <JsonLd
      schema={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Strona główna', item: SITE_URL },
          ...items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 2,
            name: item.name,
            item: `${SITE_URL}${item.href}`,
          })),
        ],
      }}
    />
  )
}
