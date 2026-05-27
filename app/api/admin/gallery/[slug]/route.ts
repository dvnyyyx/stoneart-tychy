import { checkAdminAuth, ghGetFile, ghDeleteFile } from '@/lib/github'

export const runtime = 'nodejs'

/**
 * DELETE /api/admin/gallery/[slug]
 *
 * Usuwa content/gallery/{slug}.json z repo.
 * Obraz pozostaje w public/ (nie ma pobocznych efektów).
 */
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  if (!checkAdminAuth(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return Response.json({ error: 'GITHUB_TOKEN not set' }, { status: 500 })
  }

  const { slug } = params
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: 'Invalid slug' }, { status: 400 })
  }

  try {
    const repoPath = `content/gallery/${slug}.json`
    const file = await ghGetFile(token, repoPath)

    if (!file) {
      return Response.json({ error: 'File not found' }, { status: 404 })
    }

    const ok = await ghDeleteFile(
      token,
      repoPath,
      file.sha,
      `chore: remove gallery entry ${slug}`
    )

    if (!ok) {
      return Response.json({ error: 'GitHub API error' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
