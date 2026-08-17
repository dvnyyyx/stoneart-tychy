import { NextResponse } from 'next/server'
import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../keystatic.config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Keystatic w trybie `github` waliduje zmienne OAuth JUŻ PRZY IMPORCIE modułu.
// Wcześniej wywalało to cały `next build`, gdy sekretów nie było w środowisku
// budującym (lokalny build, CI, świeży klon) — mimo że reszta strony jest
// statyczna i tych sekretów nie potrzebuje.
//
// Dlatego handler tworzymy leniwie, przy pierwszym żądaniu do /api/keystatic:
// build przechodzi zawsze, a brak konfiguracji zgłasza się czytelnym 500
// dokładnie tam, gdzie ma znaczenie — w panelu CMS.
type Handler = ReturnType<typeof makeRouteHandler>

let cached: Handler | null = null
let initError: string | null = null

function getHandler(): Handler | null {
  if (cached) return cached
  if (initError) return null
  try {
    cached = makeRouteHandler({
      config,
      clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: process.env.KEYSTATIC_SECRET,
    })
    return cached
  } catch (err) {
    initError = err instanceof Error ? err.message : String(err)
    console.error('[keystatic] Nie udało się zainicjować API panelu:', initError)
    return null
  }
}

function configError() {
  return NextResponse.json(
    {
      error:
        'Panel CMS nie jest skonfigurowany. Ustaw KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET i KEYSTATIC_SECRET w zmiennych środowiskowych.',
      details: initError,
    },
    { status: 500 }
  )
}

export async function GET(...args: Parameters<Handler['GET']>) {
  const handler = getHandler()
  if (!handler) return configError()
  return handler.GET(...args)
}

export async function POST(...args: Parameters<Handler['POST']>) {
  const handler = getHandler()
  if (!handler) return configError()
  return handler.POST(...args)
}
