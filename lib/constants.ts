// Stałe infrastrukturalne — wszystko, czego NIE da się trzymać w CMS,
// bo jest potrzebne poza kontekstem asynchronicznego odczytu (metadataBase,
// kanoniczne adresy, sitemap) albo jest częścią konfiguracji hostingu.
//
// Treść firmowa (telefon, e-mail, adres, godziny, opis) mieszka w Keystaticu:
// content/settings/site.json → getSiteSettings() z lib/content.ts.
// Wartości domyślne dla tych pól są w lib/defaults.ts.

export const SITE_URL = 'https://www.stoneart-tychy.pl'

export const GTM_ID = 'GTM-PVJ96CRF'

// Ścieżki obrazów używanych w metadanych (OG) — statyczne pliki w public/.
export const OG_IMAGE = '/og/default.jpg'
export const LOGO_PATH = '/logo/LOGOX.svg'
