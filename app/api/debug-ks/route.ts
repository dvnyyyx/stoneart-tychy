export const runtime = 'nodejs'

export async function GET() {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET
  const secret = process.env.KEYSTATIC_SECRET

  return Response.json({
    hasClientId: !!clientId,
    clientIdValue: clientId ?? 'MISSING',
    hasClientSecret: !!clientSecret,
    clientSecretPrefix: clientSecret ? clientSecret.slice(0, 6) + '...' : 'MISSING',
    hasSecret: !!secret,
    secretPrefix: secret ? secret.slice(0, 6) + '...' : 'MISSING',
  })
}
