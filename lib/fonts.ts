import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'

// Display / Headings — wysokokontrastowy serif jak w logo StoneArt
export const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
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
