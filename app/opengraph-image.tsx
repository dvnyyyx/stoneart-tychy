import { ImageResponse } from 'next/og'

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Złoty pasek dekoracyjny — góra */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #2D2D2D 40%, #C4B87A 100%)',
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: 80,
            width: 48,
            height: 48,
            border: '2px solid #C4B87A',
            transform: 'rotate(45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 16, height: 16, background: '#C4B87A' }} />
        </div>

        {/* Nazwa firmy */}
        <div style={{ position: 'absolute', top: 76, left: 148, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 400, letterSpacing: '-0.5px' }}>
            StoneArt
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase' }}>
            Usługi Kamieniarsko-Liternicze
          </span>
        </div>

        {/* Główny nagłówek */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ color: '#FFFFFF', fontSize: 62, fontWeight: 400, lineHeight: 1.05, letterSpacing: '-1px' }}>
            Liternictwo nagrobne
          </span>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 62, fontWeight: 400, lineHeight: 1.05, letterSpacing: '-1px', fontStyle: 'italic' }}>
            i renowacja nagrobków.
          </span>
        </div>

        {/* Podtytuł */}
        <div style={{ marginTop: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 32, height: 1, background: '#C4B87A' }} />
          <span style={{ color: '#C4B87A', fontSize: 14, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Tychy i okolice · 734 130 388
          </span>
        </div>

        {/* Złoty pasek — dół prawy */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 300,
            height: 6,
            background: '#C4B87A',
            opacity: 0.6,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
