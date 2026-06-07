export type PlacesReview = {
  author: string
  location: string
  quote: string
  rating: number
}

export async function getGoogleReviews(): Promise<PlacesReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) return []

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews&key=${apiKey}&language=pl`
    const res = await fetch(url, { next: { revalidate: 86400 } })

    if (!res.ok) return []

    const data = await res.json()
    const reviews: Record<string, unknown>[] = data.result?.reviews ?? []

    return reviews
      .filter((r) => (r.rating as number) >= 4 && typeof r.text === 'string' && (r.text as string).length > 20)
      .map((r) => ({
        author: r.author_name as string,
        location: `${r.relative_time_description as string} · Google`,
        quote: r.text as string,
        rating: r.rating as number,
      }))
  } catch {
    return []
  }
}
