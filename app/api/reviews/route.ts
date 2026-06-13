import { NextResponse } from 'next/server'
import { getGoogleReviews } from '@/lib/reviews'

// Opinie Google jako osobny endpoint — celowo odseparowany od readera Keystatic.
// Dzięki temu strony z galerią pozostają w 100% statyczne (reader czyta content/
// tylko podczas builda), a opinie odświeżają się bez redeployu.
//
// CDN Vercela cache'uje tę odpowiedź na 24h (s-maxage), więc Google Places API
// odpytujemy ~raz na dobę; stale-while-revalidate serwuje poprzednią odpowiedź
// podczas odświeżania w tle. Trasa nie dotyka systemu plików, więc bezpiecznie
// działa w runtime.
export const dynamic = 'force-dynamic'

export async function GET() {
  const reviews = await getGoogleReviews()
  return NextResponse.json(
    { reviews },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    }
  )
}
