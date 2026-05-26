export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return Response.json({ error: 'missing env vars', apiKey: !!apiKey, placeId: !!placeId })
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews,name&key=${apiKey}&language=pl`

  try {
    const res = await fetch(url)
    const data = await res.json()
    return Response.json(data)
  } catch (e) {
    return Response.json({ error: String(e) })
  }
}
