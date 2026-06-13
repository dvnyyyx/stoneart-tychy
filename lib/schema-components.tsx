import { SITE } from './constants'

// Schema.org LocalBusiness — komponent React renderujący JSON-LD
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#business`,
    name: SITE.fullName,
    alternateName: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: `+48${SITE.phone.replace(/\s/g, '')}`,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Różana 41',
      addressLocality: SITE.city,
      postalCode: SITE.postcode,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.1276,
      longitude: 18.9765,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    areaServed: {
      '@type': 'State',
      name: 'województwo śląskie',
    },
    knowsAbout: [
      'Piaskowanie liter na nagrobkach',
      'Dopiski i uzupełnianie inskrypcji',
      'Renowacja nagrobków granitowych',
      'Montaż tablic nagrobnych',
    ],
    priceRange: '$$',
    image: `${SITE.url}/og/default.jpg`,
    logo: `${SITE.url}/logo/LOGOX.svg`,
    sameAs: [
      // Profil Google (link „Udostępnij" z wizytówki) — uzupełnić właściwym URL-em.
      'https://g.page/r/CV0zVsr-ocNpEBM',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Schema.org WebSite — encja witryny (renderować raz, np. na stronie głównej)
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.fullName,
    alternateName: SITE.name,
    url: SITE.url,
    inLanguage: 'pl-PL',
    publisher: { '@id': `${SITE.url}/#business` },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ServiceSchema({
  slug,
  title,
  description,
}: {
  slug: string
  title: string
  description: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description: description,
    provider: {
      '@type': 'LocalBusiness',
      name: SITE.fullName,
      '@id': `${SITE.url}/#business`,
    },
    serviceType: title,
    areaServed: [
      { '@type': 'City', name: 'Tychy' },
      { '@type': 'City', name: 'Katowice' },
      { '@type': 'AdministrativeArea', name: 'województwo śląskie' },
    ],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PLN',
      availability: 'https://schema.org/InStock',
    },
    url: `${SITE.url}/uslugi/${slug}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; href: string }>
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Strona główna',
        item: SITE.url,
      },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.name,
        item: `${SITE.url}${item.href}`,
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
