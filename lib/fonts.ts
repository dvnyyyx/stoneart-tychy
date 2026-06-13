import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'

// Display / Headings — wysokokontrastowy serif jak w logo StoneArt
export const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'], // 500/700 nieużywane — nagłówki mają font-weight:400 (globals.css)
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true, // font nagłówka H1 — kandydat na LCP
})

// Body — czytelny sans-serif
export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

// Cytaty / Testimoniale — elegancki serif kursywą
export const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: false,
})
