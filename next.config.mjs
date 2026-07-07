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
          // CSP: na razie TYLKO frame-ancestors — realnie usuwa clickjacking bez
          // ryzyka zablokowania GTM/GA4/Facebook Pixel. Pełny script-src/connect-src
          // wymaga testów z Twoim kontenerem GTM (patrz komentarz na końcu pliku).
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
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

// ─────────────────────────────────────────────────────────────────────────────
// PEŁNA CSP (do włączenia po testach) — kontroluje ładowanie skryptów, nie tylko
// ramki. UWAGA: błędna dyrektywa po cichu wyłączy GTM/GA4/Facebook Pixel, więc
// najpierw wdróż jako `Content-Security-Policy-Report-Only`, sprawdź w konsoli
// przeglądarki brak naruszeń przy realnym ruchu (analityka, zdjęcia opinii Google),
// dopiero potem zamień nazwę nagłówka na `Content-Security-Policy`.
//
//   "default-src 'self'; " +
//   "base-uri 'self'; " +
//   "object-src 'none'; " +
//   "frame-ancestors 'self'; " +
//   // GTM ładuje GA4 i Pixel dynamicznie; wymaga 'unsafe-inline' (brak nonce w GTM):
//   "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; " +
//   // Wiele komponentów używa style={{…}} (inline) → 'unsafe-inline' konieczne:
//   "style-src 'self' 'unsafe-inline'; " +
//   "font-src 'self'; " +                                  // fonty są self-hostowane (next/font)
//   "img-src 'self' data: https://lh3.googleusercontent.com https://www.google-analytics.com https://www.facebook.com; " +
//   "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.facebook.com; " +
//   "frame-src https://www.googletagmanager.com; " +       // noscript iframe GTM
//   "form-action 'self'"
// ─────────────────────────────────────────────────────────────────────────────
