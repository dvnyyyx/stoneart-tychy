import { NextResponse } from 'next/server'

// Zwraca SHA ostatniego commita na gałęzi podglądu. Panel /podglad odpytuje ten
// endpoint i przeładowuje ramkę dopiero wtedy, gdy SHA się zmieni — czyli gdy
// Keystatic faktycznie zapisał treść.
//
// LIMIT ZAPYTAŃ: GitHub API bez tokenu daje 60 żądań na godzinę na adres IP.
// Zmierzone: warunkowe zapytania z ETag NIE ratują sytuacji — odpowiedzi 304
// również zużywają limit. Dlatego liczbę realnych wywołań ograniczamy tutaj:
//
//  1. Dławienie: niezależnie od tego, jak często pyta panel (i ile kart jest
//     otwartych), do GitHuba idziemy najwyżej raz na MIN_ODSTEP_MS. Bez tokenu
//     to 60 s (60/h), z tokenem 5 s.
//  2. GITHUB_TOKEN jest na produkcji WYMAGANY. Samo odpytywanie zmieściłoby się
//     w 60/h, ale renderowanie podglądu też czyta treść przez API GitHuba
//     (kilkanaście żądań na jedno wejście), więc bez tokenu limit pęka po kilku
//     odświeżeniach. Token podnosi go z 60 do 5000/h — wystarczy uprawnienie
//     tylko do odczytu publicznych repozytoriów.
//  3. ETag zostaje: oszczędza transfer i zadziała, gdyby GitHub przywrócił
//     darmowe odpowiedzi 304.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const REPO = 'dvnyyyx/stoneart-tychy'
const BRANCH = process.env.PREVIEW_BRANCH || 'main'

// Pamięć podręczna w obrębie ciepłej instancji funkcji. Przy odpytywaniu co
// kilka sekund instancja pozostaje ciepła, więc trafień w ETag jest dużo.
const MA_TOKEN = Boolean(process.env.GITHUB_TOKEN)
const MIN_ODSTEP_MS = MA_TOKEN ? 5_000 : 60_000

let cachedEtag: string | null = null
let cachedBody: { sha: string; message: string; date: string | null } | null = null
let ostatnieWywolanie = 0

function noStore(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function GET() {
  // Dławienie — chroni limit GitHuba niezależnie od liczby otwartych kart.
  const teraz = Date.now()
  if (cachedBody && teraz - ostatnieWywolanie < MIN_ODSTEP_MS) {
    return noStore({ ...cachedBody, cached: true, hasToken: MA_TOKEN })
  }
  ostatnieWywolanie = teraz

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/commits/${BRANCH}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(cachedEtag ? { 'If-None-Match': cachedEtag } : {}),
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      cache: 'no-store',
    })

    // Bez zmian od poprzedniego odpytania — nie zużyliśmy limitu.
    if (res.status === 304 && cachedBody) {
      return noStore({ ...cachedBody, cached: true, hasToken: MA_TOKEN })
    }

    if (res.status === 403 || res.status === 429) {
      const reset = res.headers.get('x-ratelimit-reset')
      const resetAt = reset ? new Date(Number(reset) * 1000).toISOString() : null
      console.warn('[podglad-wersja] przekroczony limit GitHub API, reset:', resetAt)
      // Zwracamy ostatni znany stan, żeby panel nie migotał błędem.
      if (cachedBody) return noStore({ ...cachedBody, rateLimited: true, resetAt, hasToken: MA_TOKEN })
      return noStore(
        {
          error: 'rate_limit',
          message:
            'Przekroczony limit zapytań do GitHuba. Ustaw GITHUB_TOKEN w zmiennych środowiskowych, żeby podnieść limit z 60 do 5000 na godzinę.',
          resetAt,
        },
        429
      )
    }

    if (!res.ok) {
      return noStore({ error: 'github', message: `GitHub API ${res.status}` }, 502)
    }

    const etag = res.headers.get('etag')
    if (etag) cachedEtag = etag

    const data = await res.json()
    cachedBody = {
      sha: data.sha as string,
      message: data.commit?.message ?? '',
      date: data.commit?.committer?.date ?? null,
    }
    return noStore({ ...cachedBody, hasToken: MA_TOKEN })
  } catch (err) {
    console.error('[podglad-wersja] błąd:', err)
    if (cachedBody) return noStore({ ...cachedBody, stale: true, hasToken: MA_TOKEN })
    return noStore({ error: 'network', message: 'Nie udało się sprawdzić wersji treści.' }, 502)
  }
}
