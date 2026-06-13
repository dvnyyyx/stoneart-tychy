import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { playfair, inter, cormorant } from '@/lib/fonts'
import { SITE } from '@/lib/constants'
import { Analytics } from '@vercel/analytics/next'
import { CookieBanner } from '@/components/ui/CookieBanner'
import './globals.css'

const GTM_ID = 'GTM-PVJ96CRF'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Usługi Kamieniarsko-Liternicze Tychy`,
    template: `%s | ${SITE.name} Tychy`,
  },
  description: SITE.description,
  authors: [{ name: SITE.owner }],
  creator: SITE.owner,
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: SITE.url,
    siteName: SITE.fullName,
    title: `${SITE.name} — Liternictwo nagrobne, dopiski i renowacja nagrobków, Tychy`,
    description: SITE.description,
    images: [
      {
        url: '/og/default.jpg',
        width: 1200,
        height: 630,
        alt: 'StoneArt — Usługi Kamieniarsko-Liternicze Tychy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Liternictwo nagrobne i renowacja nagrobków, Tychy`,
    description: SITE.description,
    images: ['/og/default.jpg'],
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
      { url: '/logo/LOGOX.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
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
          />
        </noscript>
        {children}
        <CookieBanner />
        <Analytics />
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
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </body>
    </html>
  )
}
