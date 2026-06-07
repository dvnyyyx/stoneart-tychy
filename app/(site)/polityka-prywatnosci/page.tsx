import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { PageHeader } from '@/components/shared/PageHeader'
import { BreadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Polityka Prywatności — StoneArt Tychy',
  description: 'Informacje o przetwarzaniu danych osobowych przez StoneArt Adam Wytrykus zgodnie z RODO.',
  alternates: { canonical: `${SITE.url}/polityka-prywatnosci` },
  robots: { index: false },
}

export default function PolitykaPrywatnosci() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Polityka Prywatności', href: '/polityka-prywatnosci' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label="Informacje prawne"
          title="Polityka Prywatności."
          lead="Dowiedz się, jakie dane zbieramy, w jakim celu i jakie przysługują Ci prawa."
        />
      </div>

      <section className="section-padding bg-white">
        <div className="container-stone">
          <div className="prose-stone" style={{ maxWidth: '720px' }}>

            <article style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: '1.9', color: 'var(--color-text-1)' }}>

              {/* 1 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, marginBottom: '16px', color: 'var(--color-ink)' }}>
                  1. Administrator danych osobowych
                </h2>
                <p>
                  Administratorem Twoich danych osobowych jest <strong>Adam Wytrykus</strong> prowadzący działalność
                  pod nazwą <strong>StoneArt Usługi Kamieniarsko-Liternicze</strong>, z siedzibą przy ul. Różana 41,
                  43-100 Tychy.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Kontakt w sprawach dotyczących danych osobowych:{' '}
                  <a href={`mailto:${SITE.email}`} style={{ color: 'var(--color-gold-dark)', textDecoration: 'underline' }}>
                    {SITE.email}
                  </a>
                </p>
              </div>

              {/* 2 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, marginBottom: '16px', color: 'var(--color-ink)' }}>
                  2. Jakie dane zbieramy i w jakim celu
                </h2>

                <h3 style={{ fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: '10px', color: 'var(--color-text-2)' }}>
                  Formularz wyceny
                </h3>
                <p>
                  Gdy wypełniasz formularz wyceny na stronie <strong>/wycena</strong>, zbieramy: imię i nazwisko,
                  numer telefonu lub adres e-mail, nazwę miejscowości lub cmentarza, opis zlecenia oraz
                  opcjonalnie przesłane zdjęcia. Dane te są niezbędne do przygotowania oferty i kontaktu w
                  sprawie wyceny. Podstawa prawna: <strong>art. 6 ust. 1 lit. b RODO</strong> (działanie na żądanie osoby
                  przed zawarciem umowy).
                </p>

                <h3 style={{ fontSize: '14px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: '10px', marginTop: '28px', color: 'var(--color-text-2)' }}>
                  Analityka (pliki cookie)
                </h3>
                <p>
                  Za Twoją zgodą używamy <strong>Google Analytics 4</strong> do anonimowej analizy ruchu na stronie
                  (liczba odwiedzin, strony wejścia, czas na stronie). Dane są przekazywane do Google LLC
                  i przechowywane zgodnie z polityką prywatności Google. Podstawa prawna:{' '}
                  <strong>art. 6 ust. 1 lit. a RODO</strong> (zgoda). Zgodę możesz wycofać w każdej chwili,
                  klikając &ldquo;Odrzuć&rdquo; w banerze cookies lub czyszcząc pliki cookie w przeglądarce.
                </p>
              </div>

              {/* 3 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, marginBottom: '16px', color: 'var(--color-ink)' }}>
                  3. Jak długo przechowujemy dane
                </h2>
                <p>
                  Dane z formularza wyceny przechowywane są wyłącznie w skrzynce e-mail administratora przez
                  czas niezbędny do obsługi zapytania, nie dłużej niż 2 lata. Dane analityczne Google
                  Analytics są przechowywane przez 14 miesięcy (domyślne ustawienie GA4).
                </p>
              </div>

              {/* 4 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, marginBottom: '16px', color: 'var(--color-ink)' }}>
                  4. Twoje prawa
                </h2>
                <p>Na podstawie RODO przysługuje Ci prawo do:</p>
                <ul style={{ marginTop: '12px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>dostępu</strong> do swoich danych osobowych,</li>
                  <li><strong>sprostowania</strong> nieprawidłowych danych,</li>
                  <li><strong>usunięcia</strong> danych (&bdquo;prawo do bycia zapomnianym&rdquo;),</li>
                  <li><strong>ograniczenia</strong> przetwarzania,</li>
                  <li><strong>wycofania zgody</strong> w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania przed wycofaniem),</li>
                  <li><strong>wniesienia skargi</strong> do Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.</li>
                </ul>
                <p style={{ marginTop: '16px' }}>
                  Aby skorzystać z powyższych praw, skontaktuj się mailowo:{' '}
                  <a href={`mailto:${SITE.email}`} style={{ color: 'var(--color-gold-dark)', textDecoration: 'underline' }}>
                    {SITE.email}
                  </a>
                </p>
              </div>

              {/* 5 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, marginBottom: '16px', color: 'var(--color-ink)' }}>
                  5. Pliki cookie
                </h2>
                <p>
                  Strona używa wyłącznie plików cookie niezbędnych do działania oraz analitycznych
                  (Google Analytics) — wyłącznie po wyrażeniu zgody. Nie używamy cookies reklamowych
                  ani śledzących.
                </p>
                <div
                  style={{
                    marginTop: '20px',
                    borderLeft: '2px solid var(--color-gold)',
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    { name: 'stoneart_consent', type: 'Niezbędne', desc: 'Zapamiętuje Twoją decyzję dotyczącą cookies. Ważność: 1 rok.' },
                    { name: '_ga, _ga_*', type: 'Analityczne (za zgodą)', desc: 'Google Analytics — anonimowe dane o ruchu na stronie. Ważność: do 2 lat.' },
                  ].map((cookie) => (
                    <div key={cookie.name}>
                      <p style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--color-gold-dark)', marginBottom: '2px' }}>
                        {cookie.name}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-2)', marginBottom: '2px' }}>
                        <strong>{cookie.type}</strong>
                      </p>
                      <p style={{ fontSize: '14px' }}>{cookie.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, marginBottom: '16px', color: 'var(--color-ink)' }}>
                  6. Przekazywanie danych poza EOG
                </h2>
                <p>
                  Google Analytics przekazuje dane do Google LLC (USA). Google stosuje standardowe klauzule
                  umowne zatwierdzone przez Komisję Europejską, co zapewnia odpowiedni poziom ochrony danych
                  zgodny z RODO.
                </p>
              </div>

              {/* 7 */}
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, marginBottom: '16px', color: 'var(--color-ink)' }}>
                  7. Zmiany polityki prywatności
                </h2>
                <p>
                  Niniejsza polityka może być aktualizowana. Datę ostatniej zmiany znajdziesz poniżej.
                  W przypadku istotnych zmian poinformujemy o nich na stronie głównej.
                </p>
                <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-text-2)' }}>
                  Ostatnia aktualizacja: 7 czerwca 2026 r.
                </p>
              </div>

            </article>
          </div>
        </div>
      </section>
    </>
  )
}
