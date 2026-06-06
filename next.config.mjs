/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  outputFileTracingIncludes: {
    '/*': ['./content/**/*'],
  },
  async redirects() {
    return [
      // /index.php → strona główna (301 permanent)
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
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

export default nextConfig
