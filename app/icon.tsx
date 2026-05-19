import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#1E1E1E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Uproszczony motyw S — geometryczny */}
        <div
          style={{
            width: 18,
            height: 18,
            border: '1.5px solid #C4B87A',
            transform: 'rotate(45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              background: '#C4B87A',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
