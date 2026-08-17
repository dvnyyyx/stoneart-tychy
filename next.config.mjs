// Kandydat na pełną CSP — wdrażany najpierw jako Report-Only (patrz headers()).
// GTM ładuje GA4 i Pixel dynamicznie i nie obsługuje nonce, stąd 'unsafe-inline'
// w script-src. Wiele komponentów używa style={{…}}, stąd 'unsafe-inline' w style-src.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://www.google-analytics.com https://www.facebook.com",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.facebook.com https://vitals.vercel-insights.com",
  "frame-src https://www.googletagmanager.com",
  "form-action 'self'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // W Next 14 ten klucz należy do `experimental` (na top-level trafił dopiero w Next 15).
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./content/**/*'],
    },
  },
  async headers() {
    return [
      {
        // Nagłówki bezpieczeństwa dla wszystkich tras.
        source: '/:path*',
        headers: [
          // HSTS 2 lata + subdomeny. `preload` celowo POMINIĘTY — to jednokierunkowe
          // zobowiązanie (wszystkie subdomeny muszą już zawsze mieć HTTPS). Włącz je
          // dopiero po weryfikacji i zgłoszeniu na https://hstspreload.org.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          // Clickjacking — dwa mechanizmy (starszy X-Frame-Options + nowoczesny
          // frame-ancestors w CSP niżej) dla pełnego pokrycia przeglądarek.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          // CSP egzekwowana: na razie TYLKO frame-ancestors — realnie usuwa
          // clickjacking bez ryzyka zablokowania GTM/GA4/Facebook Pixel.
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          // Pełna CSP w trybie raportowania: nic nie blokuje, ale naruszenia
          // pojawiają się w konsoli przeglądarki. Sprawdź stronę przy włączonej
          // analityce i opiniach Google; gdy konsola jest czysta, przenieś tę
          // wartość do nagłówka wyżej (i usuń stąd).
          { key: 'Content-Security-Policy-Report-Only', value: CSP_REPORT_ONLY },
        ],
      },
    ]
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
