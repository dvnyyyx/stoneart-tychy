import { checkAdminAuth, ghGetFile, ghPutFile, jsonToBase64 } from '@/lib/github'

export const runtime = 'nodejs'

/**
 * POST /api/admin/gallery/order
 * Body: { slugs: string[] }  — tablica slugów w nowej kolejności
 *
 * Zapisuje content/settings/gallery-order.json do repo.
 * Przy następnym deployu Vercel używa tej kolejności.
 */
export async function POST(req: Request) {
  if (!checkAdminAuth(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return Response.json({ error: 'GITHUB_TOKEN not set' }, { status: 500 })
  }

  let slugs: string[]
  try {
    const body = await req.json()
    if (!Array.isArray(body.slugs)) throw new Error('Invalid body')
    slugs = body.slugs
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const repoPath = 'content/settings/gallery-order.json'

    // Pobierz SHA istniejącego pliku (potrzebne do nadpisania)
    const existing = await ghGetFile(token, repoPath)

    const ok = await ghPutFile(
      token,
      repoPath,
      jsonToBase64(slugs),
      'chore: update gallery order',
      existing?.sha
    )

    if (!ok) {
      return Response.json({ error: 'GitHub API error' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
