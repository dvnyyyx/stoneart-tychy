import { withKeystatic } from '@keystatic/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  async redirects() {
    return [
      // non-www → www (301 permanent)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'stoneart-tychy.pl' }],
        destination: 'https://www.stoneart-tychy.pl/:path*',
        permanent: true,
      },
      // stara błędna domena → www (na wszelki wypadek)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'stoneart.tychy.pl' }],
        destination: 'https://www.stoneart-tychy.pl/:path*',
        permanent: true,
      },
    ]
  },
}

export default withKeystatic(nextConfig)
