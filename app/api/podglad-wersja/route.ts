import { NextResponse } from 'next/server'

// Zwraca SHA ostatniego commita na gałęzi podglądu. Panel /podglad odpytuje ten
// endpoint co kilka sekund i przeładowuje ramkę dopiero wtedy, gdy SHA się
// zmieni — czyli gdy Keystatic faktycznie zapisał treść. Bez tego trzeba by
// odświeżać na ślepo i migotałoby przy każdym cyklu.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const REPO = 'dvnyyyx/stoneart-tychy'
const BRANCH = process.env.PREVIEW_BRANCH || 'main'

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/commits/${BRANCH}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API ${res.status}` },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const data = await res.json()
    return NextResponse.json(
      {
        sha: data.sha as string,
        message: data.commit?.message ?? '',
        date: data.commit?.committer?.date ?? null,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (err) {
    console.error('[podglad-wersja] błąd:', err)
    return NextResponse.json(
      { error: 'Nie udało się sprawdzić wersji treści.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
