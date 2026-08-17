'use client'

import { usePathname } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { CookieBanner } from '@/components/ui/CookieBanner'

// Panel podglądu i CMS to narzędzia wewnętrzne — nie mogą zaśmiecać statystyk
// klienta ani pokazywać mu banera cookies przy każdej edycji.
function czyNarzedzie(pathname: string) {
  return pathname.startsWith('/podglad') || pathname.startsWith('/keystatic')
}

export function AnalyticsGate() {
  const pathname = usePathname()
  if (czyNarzedzie(pathname)) return null
  return (
    <>
      <CookieBanner />
      <Analytics />
    </>
  )
}
