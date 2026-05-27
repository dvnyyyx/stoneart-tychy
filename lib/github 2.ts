/**
 * GitHub API helpers — używane przez /api/admin/gallery
 */

export const GH_OWNER = 'dvnyyyx'
export const GH_REPO = 'stoneart-tychy'
export const GH_API = 'https://api.github.com'
export const GH_BRANCH = 'main'

export function ghHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

export type GhFile = {
  sha: string
  content: string // raw base64
}

/** Pobiera plik z repo; zwraca null gdy nie istnieje */
export async function ghGetFile(token: string, repoPath: string): Promise<GhFile | null> {
  const res = await fetch(
    `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${repoPath}?ref=${GH_BRANCH}`,
    { headers: ghHeaders(token), cache: 'no-store' }
  )
  if (!res.ok) return null
  return res.json()
}

/** Tworzy lub nadpisuje plik w repo */
export async function ghPutFile(
  token: string,
  repoPath: string,
  content: string, // base64
  message: string,
  sha?: string
): Promise<boolean> {
  const body: Record<string, string> = { message, content }
  if (sha) body.sha = sha

  const res = await fetch(
    `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${repoPath}`,
    {
      method: 'PUT',
      headers: ghHeaders(token),
      body: JSON.stringify(body),
    }
  )
  return res.ok
}

/** Usuwa plik z repo */
export async function ghDeleteFile(
  token: string,
  repoPath: string,
  sha: string,
  message: string
): Promise<boolean> {
  const res = await fetch(
    `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${repoPath}`,
    {
      method: 'DELETE',
      headers: ghHeaders(token),
      body: JSON.stringify({ message, sha }),
    }
  )
  return res.ok
}

/** Listuje pliki w katalogu repo */
export async function ghListDir(
  token: string,
  repoPath: string
): Promise<Array<{ name: string; sha: string; type: string }> | null> {
  const res = await fetch(
    `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${repoPath}?ref=${GH_BRANCH}`,
    { headers: ghHeaders(token), cache: 'no-store' }
  )
  if (!res.ok) return null
  const data = await res.json()
  return Array.isArray(data) ? data : null
}

/** Pomocnik: JSON → base64 */
export function jsonToBase64(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj, null, 2)).toString('base64')
}

/** Pomocnik: base64 → JSON */
export function base64ToJson<T = unknown>(b64: string): T {
  return JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))
}

/** Sprawdza autoryzację admina */
export function checkAdminAuth(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false // jeśli nie skonfigurowano — blokuj
  return req.headers.get('x-admin-secret') === secret
}
