import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { playfair, inter, cormorant } from '@/lib/fonts'
import { SITE_URL, GTM_ID, OG_IMAGE, LOGO_PATH } from '@/lib/constants'
import { getSiteSettings } from '@/lib/content'
import { AnalyticsGate } from '@/components/shared/AnalyticsGate'
import './globals.css'

// Metadane czytane z Keystatica — zmiana nazwy firmy czy opisu w CMS
// aktualizuje tytuły, OG i Twitter Card na całej stronie.
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.companyName} — Usługi Kamieniarsko-Liternicze ${site.city}`,
      template: `%s | ${site.companyName} ${site.city}`,
    },
    description: site.description,
    authors: [{ name: site.owner }],
    creator: site.owner,
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      url: SITE_URL,
      siteName: site.companyFullName,
      title: `${site.companyName} — Liternictwo nagrobne, dopiski i renowacja nagrobków, ${site.city}`,
      description: site.description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${site.companyFullName} ${site.city}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.companyName} — Liternictwo nagrobne i renowacja nagrobków, ${site.city}`,
      description: site.description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    icons: {
      icon: [
        { url: LOGO_PATH, type: 'image/svg+xml' },
        { url: '/favicon.ico' },
      ],
      apple: '/apple-touch-icon.png',
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#EDEAE3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pl"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="antialiased">
        {/* Bez JS: pokaż treść animowaną (fallback dla AnimatedReveal) */}
        <noscript>
          <style>{`.will-animate{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <AnalyticsGate />
        {/* Domyślna blokada GA4 — musi być przed GTM */}
        <Script
          id="consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent','default',{analytics_storage:'denied',wait_for_update:500});
            `,
          }}
        />
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if(!/^\/(podglad|keystatic)/.test(location.pathname)){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');}`,
          }}
        />
      </body>
    </html>
  )
}
