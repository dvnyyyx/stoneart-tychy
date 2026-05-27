import { checkAdminAuth, ghGetFile, ghPutFile } from '@/lib/github'

export const runtime = 'nodejs'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

/**
 * POST /api/admin/gallery/upload
 * FormData: files[] (File), alts[] (string), categories[] (string), featured[] (string)
 *
 * Dla każdego pliku:
 * 1. Uploaduje obraz do public/images/prace/{filename}
 * 2. Tworzy content/gallery/{slug}.json
 */
export async function POST(req: Request) {
  if (!checkAdminAuth(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return Response.json({ error: 'GITHUB_TOKEN not set' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const files = formData.getAll('files') as File[]
  const alts = formData.getAll('alts') as string[]
  const categories = formData.getAll('categories') as string[]
  const featuredFlags = formData.getAll('featured') as string[]

  if (files.length === 0) {
    return Response.json({ error: 'No files provided' }, { status: 400 })
  }

  const results: Array<{ filename: string; slug: string; success: boolean; error?: string }> = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const altText = alts[i] || file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
    const category = categories[i] || 'inne'
    const featured = featuredFlags[i] === 'true'

    // Generuj unikalny slug (alt + timestamp)
    const baseSlug = slugify(altText)
    const slug = `${baseSlug}-${Date.now().toString(36)}`
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${slug}.${ext}`

    try {
      // 1. Wgraj obraz do public/images/prace/
      const bytes = await file.arrayBuffer()
      const imageBase64 = Buffer.from(bytes).toString('base64')

      const imgPath = `public/images/prace/${filename}`
      const imgOk = await ghPutFile(
        token,
        imgPath,
        imageBase64,
        `feat: add gallery photo ${filename}`
      )

      if (!imgOk) {
        results.push({ filename: file.name, slug, success: false, error: 'Image upload failed' })
        continue
      }

      // 2. Utwórz wpis w content/gallery/
      const galleryEntry = {
        image: `/images/prace/${filename}`,
        alt: altText,
        category,
        featured,
        order: 0,
      }

      const jsonBase64 = Buffer.from(JSON.stringify(galleryEntry, null, 2)).toString('base64')
      const jsonPath = `content/gallery/${slug}.json`

      // Sprawdź czy slug już istnieje (mało prawdopodobne, ale bezpiecznie)
      const existing = await ghGetFile(token, jsonPath)

      const jsonOk = await ghPutFile(
        token,
        jsonPath,
        jsonBase64,
        `feat: add gallery entry ${slug}`,
        existing?.sha
      )

      if (!jsonOk) {
        results.push({ filename: file.name, slug, success: false, error: 'Gallery entry creation failed' })
        continue
      }

      results.push({ filename: file.name, slug, success: true })
    } catch (err) {
      results.push({ filename: file.name, slug, success: false, error: String(err) })
    }
  }

  return Response.json({ results })
}
