'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ExternalLink, Monitor, RefreshCw, Smartphone, Tablet } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Strona {
  href: string
  label: string
}

type Szerokosc = 'desktop' | 'tablet' | 'mobile'

const SZEROKOSCI: Record<Szerokosc, { px: number | null; label: string; icon: typeof Monitor }> = {
  desktop: { px: null, label: 'Pełna szerokość', icon: Monitor },
  tablet: { px: 834, label: 'Tablet', icon: Tablet },
  mobile: { px: 390, label: 'Telefon', icon: Smartphone },
}

// Co ile sprawdzamy, czy treść się zmieniła. Endpoint używa warunkowych zapytań
// (ETag), więc niezmieniona treść nie zużywa limitu GitHuba. Odpytujemy wyłącznie
// gdy karta jest widoczna.
const INTERWAL_MS = 8000

export function PodgladPanel({ strony }: { strony: Strona[] }) {
  const [sciezka, setSciezka] = useState('/')
  const [szerokosc, setSzerokosc] = useState<Szerokosc>('desktop')
  const [sha, setSha] = useState<string | null>(null)
  const [status, setStatus] = useState<'start' | 'aktualne' | 'odswiezam' | 'limit' | 'blad'>('start')
  const [komunikat, setKomunikat] = useState<string | null>(null)
  const [ostatnia, setOstatnia] = useState<string | null>(null)
  const [licznik, setLicznik] = useState(0)

  const ramkaRef = useRef<HTMLIFrameElement>(null)
  const shaRef = useRef<string | null>(null)

  const przeladuj = useCallback(() => setLicznik((n) => n + 1), [])

  // Odpytywanie o wersję treści. Nowy SHA na gałęzi = klient właśnie zapisał
  // coś w CMS, więc przeładowujemy ramkę z podglądem.
  useEffect(() => {
    let anulowane = false

    const sprawdz = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const res = await fetch('/api/podglad-wersja', { cache: 'no-store' })
        const dane = (await res.json()) as {
          sha?: string
          message?: string
          date?: string | null
          rateLimited?: boolean
          hasToken?: boolean
          error?: string
        }
        if (anulowane) return

        if (res.status === 429 || dane.error === 'rate_limit') {
          setStatus('limit')
          setKomunikat(
            'Przekroczony limit zapytań do GitHuba. Ustaw GITHUB_TOKEN w zmiennych środowiskowych Vercela.'
          )
          return
        }
        if (!res.ok || !dane.sha) throw new Error(dane.error || String(res.status))
        if (dane.rateLimited) {
          setStatus('limit')
          setKomunikat('Limit zapytań do GitHuba wyczerpany — pokazuję ostatni znany stan.')
          return
        }
        setKomunikat(
          dane.hasToken === false
            ? 'Brak GITHUB_TOKEN. Podgląd działa w trybie oszczędnym (sprawdzanie co 60 s), ale limit GitHuba (60 zapytań/h) wyczerpie się po kilku odświeżeniach. Dodaj token w ustawieniach Vercela — wystarczy odczyt publicznych repozytoriów.'
            : null
        )

        if (shaRef.current === null) {
          shaRef.current = dane.sha
          setSha(dane.sha)
          setStatus('aktualne')
        } else if (dane.sha !== shaRef.current) {
          shaRef.current = dane.sha
          setSha(dane.sha)
          setOstatnia((dane.message ?? '').split('\n')[0] || null)
          setStatus('odswiezam')
          przeladuj()
          setTimeout(() => !anulowane && setStatus('aktualne'), 1500)
        }
      } catch {
        if (!anulowane) setStatus('blad')
      }
    }

    sprawdz()
    const id = setInterval(sprawdz, INTERWAL_MS)
    document.addEventListener('visibilitychange', sprawdz)
    return () => {
      anulowane = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', sprawdz)
    }
  }, [przeladuj])

  const urlPodgladu = `/podglad/strona${sciezka === '/' ? '' : sciezka}`
  const szer = SZEROKOSCI[szerokosc]

  const statusTekst = {
    start: 'Łączę z repozytorium…',
    aktualne: sha ? `Treść aktualna · ${sha.slice(0, 7)}` : 'Treść aktualna',
    odswiezam: 'Wykryto zapis — odświeżam podgląd…',
    limit: 'Limit zapytań GitHuba',
    blad: 'Nie mogę sprawdzić wersji treści',
  }[status]

  const statusKolor = {
    start: 'rgba(255,255,255,0.4)',
    aktualne: '#7FB069',
    odswiezam: '#C4B87A',
    limit: '#D08C3C',
    blad: '#B85C5C',
  }[status]

  return (
    <div className="flex flex-col h-screen bg-[#1A1A1A] overflow-hidden">
      {/* Pasek narzędzi */}
      <header className="shrink-0 flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/10">
        <span
          className="font-display text-white text-[16px] shrink-0"
          style={{ fontWeight: 400 }}
        >
          StoneArt — podgląd
        </span>

        <label className="sr-only" htmlFor="wybor-strony">Wybierz podstronę</label>
        <select
          id="wybor-strony"
          value={sciezka}
          onChange={(e) => setSciezka(e.target.value)}
          className="bg-[#2D2D2D] text-white text-[13px] px-3 py-1.5 border border-white/15 rounded-none focus:outline-none focus:border-[#C4B87A]"
        >
          {strony.map((s) => (
            <option key={s.href} value={s.href}>{s.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-1" role="group" aria-label="Szerokość podglądu">
          {(Object.keys(SZEROKOSCI) as Szerokosc[]).map((k) => {
            const Ikona = SZEROKOSCI[k].icon
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSzerokosc(k)}
                aria-pressed={szerokosc === k}
                title={SZEROKOSCI[k].label}
                className={cn(
                  'w-8 h-8 flex items-center justify-center border transition-colors',
                  szerokosc === k
                    ? 'border-[#C4B87A] text-[#C4B87A] bg-[#C4B87A]/10'
                    : 'border-white/15 text-white/50 hover:text-white'
                )}
              >
                <Ikona size={15} strokeWidth={1.5} />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={przeladuj}
          className="flex items-center gap-2 px-3 h-8 border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors text-[12px]"
          title="Odśwież podgląd"
        >
          <RefreshCw size={13} strokeWidth={1.5} />
          Odśwież
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: statusKolor }}
            aria-hidden="true"
          />
          <span className="text-[11px]" style={{ color: statusKolor }} role="status">
            {statusTekst}
          </span>
          <a
            href="/keystatic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 h-8 border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors text-[12px]"
          >
            <ExternalLink size={12} strokeWidth={1.5} />
            Panel w nowej karcie
          </a>
        </div>
      </header>

      {komunikat && (
        <div
          className="shrink-0 px-4 py-2 text-[12px] border-b"
          style={{ background: 'rgba(208,140,60,0.12)', borderColor: 'rgba(208,140,60,0.3)', color: '#E0A860' }}
          role="alert"
        >
          {komunikat}
        </div>
      )}

      {ostatnia && (
        <div className="shrink-0 px-4 py-1.5 text-[11px] text-white/40 border-b border-white/5 truncate">
          Ostatni zapis: {ostatnia}
        </div>
      )}

      {/* Dwa panele */}
      <div className="flex-1 flex min-h-0 flex-col lg:flex-row">
        <section className="lg:w-[46%] min-h-0 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10">
          <h2 className="sr-only">Panel edycji treści</h2>
          <iframe
            src="/keystatic"
            title="Panel CMS"
            className="flex-1 w-full bg-white"
          />
          <p className="shrink-0 px-3 py-1.5 text-[10px] text-white/30 border-t border-white/5">
            Logowanie do GitHuba nie działa wewnątrz ramki. Jeśli panel jest pusty,
            otwórz go raz w nowej karcie, zaloguj się i wróć tutaj.
          </p>
        </section>

        <section className="flex-1 min-h-0 flex flex-col bg-[#0F0F0F]">
          <h2 className="sr-only">Podgląd strony</h2>
          <div className="flex-1 min-h-0 flex justify-center overflow-auto">
            <iframe
              ref={ramkaRef}
              key={`${urlPodgladu}-${licznik}`}
              src={urlPodgladu}
              title="Podgląd strony"
              className="h-full bg-white"
              style={{
                width: szer.px ? `${szer.px}px` : '100%',
                maxWidth: '100%',
                transition: 'width 200ms ease',
              }}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
