export type PlacesReview = {
  author: string
  location: string
  quote: string
}

export async function getGoogleReviews(): Promise<PlacesReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    console.log('[reviews] missing env vars', { apiKey: !!apiKey, placeId: !!placeId })
    return []
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews&key=${apiKey}&language=pl`
    const res = await fetch(url, { cache: 'no-store' })
    console.log('[reviews] fetch status', res.status)

    if (!res.ok) return []

    const data = await res.json()
    console.log('[reviews] api status', data.status, 'reviews count', data.result?.reviews?.length ?? 0)

    const reviews: Record<string, unknown>[] = data.result?.reviews ?? []

    const filtered = reviews.filter((r) => (r.rating as number) >= 4 && typeof r.text === 'string' && (r.text as string).length > 20)
    console.log('[reviews] after filter', filtered.length)

    return filtered.map((r) => ({
      author: r.author_name as string,
      location: `${r.relative_time_description as string} · Google`,
      quote: r.text as string,
    }))
  } catch (e) {
    console.log('[reviews] error', e)
    return []
  }
}
