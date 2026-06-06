'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const COOKIE_NAME = 'stoneart_consent'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 rok

function readCookie(): 'granted' | 'denied' | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  const val = match?.[1]
  return val === 'granted' || val === 'denied' ? val : null
}

function writeCookie(value: 'granted' | 'denied') {
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`
}

function pushConsent(value: 'granted' | 'denied') {
  window.gtag?.('consent', 'update', { analytics_storage: value })
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = readCookie()
    if (stored === 'granted') {
      pushConsent('granted') // przywróć zgodę przy kolejnej wizycie
    } else if (!stored) {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    writeCookie('granted')
    pushConsent('granted')
    setVisible(false)
  }

  function handleReject() {
    writeCookie('denied')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Zgoda na pliki cookie"
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(26,26,26,0.97)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="container-stone py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">

        <p
          className="flex-1 leading-[1.6]"
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}
        >
          Używamy plików cookie Google Analytics do analizy ruchu na stronie.
          Dane są anonimowe i pomagają nam ulepszać serwis.
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReject}
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              padding: '8px 16px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'
            }}
          >
            Odrzuć
          </button>

          <button
            onClick={handleAccept}
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              padding: '8px 20px',
              border: '1px solid var(--color-gold)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-gold)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#1A1A1A'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-gold)'
            }}
          >
            Akceptuję
          </button>
        </div>

      </div>
    </div>
  )
}
