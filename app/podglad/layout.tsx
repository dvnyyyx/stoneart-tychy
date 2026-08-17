import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Podgląd na żywo',
  robots: { index: false, follow: false },
}

// Osobny layout: panel podglądu nie dostaje nagłówka ani stopki strony.
export default function PodgladLayout({ children }: { children: React.ReactNode }) {
  return children
}
