import {
  checkAdminAuth,
  ghGetFile,
  ghListDir,
  jsonToBase64,
  base64ToJson,
} from '@/lib/github'

export const runtime = 'nodejs'

export type GalleryItem = {
  slug: string
  fileSha: string
  image: string
  alt: string
  category: string
  featured: boolean
  order?: number
}

/** GET /api/admin/gallery — zwraca listę zdjęć + bieżącą kolejność */
export async function GET(req: Request) {
  if (!checkAdminAuth(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return Response.json({ error: 'GITHUB_TOKEN not set' }, { status: 500 })
  }

  try {
    // Listuj pliki JSON w content/gallery/
    const files = await ghListDir(token, 'content/gallery')
    if (!files) {
      return Response.json({ items: [], orderSlugs: null })
    }

    const jsonFiles = files.filter((f) => f.name.endsWith('.json'))

    // Pobierz zawartość każdego pliku równolegle
    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const data = await ghGetFile(token, `content/gallery/${file.name}`)
        if (!data) return null
        try {
          const content = base64ToJson<Record<string, unknown>>(data.content.replace(/\n/g, ''))
          return {
            slug: file.name.replace('.json', ''),
            fileSha: data.sha,
            image: (content.image as string) ?? '',
            alt: (content.alt as string) ?? '',
            category: (content.category as string) ?? 'inne',
            featured: Boolean(content.featured),
            order: typeof content.order === 'number' ? content.order : 0,
          } satisfies GalleryItem
        } catch {
          return null
        }
      })
    )

    // Pobierz gallery-order.json jeśli istnieje
    let orderSlugs: string[] | null = null
    const orderFile = await ghGetFile(token, 'content/settings/gallery-order.json')
    if (orderFile) {
      try {
        const parsed = base64ToJson<string[]>(orderFile.content.replace(/\n/g, ''))
        if (Array.isArray(parsed)) orderSlugs = parsed
      } catch {}
    }

    const validItems = items.filter(Boolean) as GalleryItem[]

    // Posortuj według orderSlugs (żeby edytor pokazywał aktualną kolejność)
    if (orderSlugs && orderSlugs.length > 0) {
      const orderMap = new Map(orderSlugs.map((slug, i) => [slug, i]))
      validItems.sort((a, b) => {
        const ai = orderMap.has(a.slug) ? (orderMap.get(a.slug) as number) : Infinity
        const bi = orderMap.has(b.slug) ? (orderMap.get(b.slug) as number) : Infinity
        return ai - bi
      })
    } else {
      validItems.sort((a, b) => {
        const ao = a.order ?? 0
        const bo = b.order ?? 0
        if (ao === 0 && bo === 0) return 0
        if (ao === 0) return 1
        if (bo === 0) return -1
        return ao - bo
      })
    }

    return Response.json({ items: validItems, orderSlugs })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
