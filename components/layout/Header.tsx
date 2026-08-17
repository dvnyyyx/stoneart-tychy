import { getNavigation, getSiteSettings } from '@/lib/content'
import { HeaderClient } from './HeaderClient'

// Serwerowa otoczka: czyta menu i dane firmy z Keystatica, interaktywną część
// (scroll, menu mobilne) obsługuje HeaderClient. Dzięki temu klient edytuje
// pozycje menu, podpis pod logo i przycisk CTA w CMS, bez zmian w kodzie.
export async function Header() {
  const [nav, site] = await Promise.all([getNavigation(), getSiteSettings()])

  return (
    <HeaderClient
      links={nav.links}
      ctaLabel={nav.ctaLabel}
      ctaHref={nav.ctaHref}
      tagline={nav.tagline}
      companyName={site.companyName}
      phone={site.phone}
    />
  )
}
