import type { Metadata, Viewport } from 'next'
import { playfair, inter, cormorant } from '@/lib/fonts'
import { SITE } from '@/lib/constants'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Usługi Kamieniarsko-Liternicze Tychy`,
    template: `%s | ${SITE.name} Tychy`,
  },
  description: SITE.description,
  keywords: [
    'liternictwo nagrobne Tychy', 'dopiski na nagrobku', 'piaskowanie napisów nagrobki',
    'renowacja nagrobków Tychy', 'kamieniarstwo Tychy', 'odświeżanie napisów nagrobek',
    'montaż tablic nagrobnych', 'zakład kamieniarski Tychy',
  ],
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
    icon: '/favicon.ico',
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
