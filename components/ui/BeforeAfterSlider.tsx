'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BeforeAfterSliderProps {
  before: string
  after: string
  alt: string
  className?: string
}

export function BeforeAfterSlider({
  before,
  after,
  alt,
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50) // 0–100
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - left) / width) * 100))
    setPosition(pct)
  }, [])

  // Mouse
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    updatePosition(e.clientX)
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging) updatePosition(e.clientX)
  }, [dragging, updatePosition])

  const onMouseUp = useCallback(() => setDragging(false), [])

  // Touch
  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true)
    updatePosition(e.touches[0].clientX)
  }

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (dragging) updatePosition(e.touches[0].clientX)
  }, [dragging, updatePosition])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onMouseUp)
    }
  }, [onMouseMove, onMouseUp, onTouchMove])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden select-none bg-stone-dark cursor-col-resize',
        className
      )}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      aria-label={`Porównanie przed i po: ${alt}`}
      role="img"
    >
      {/* Zdjęcie PO — pełna szerokość */}
      <div className="absolute inset-0">
        <Image
          src={after}
          alt={`Po renowacji: ${alt}`}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Zdjęcie PRZED — przycinane clip-path */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`Przed renowacją: ${alt}`}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Linia podziału */}
      <div
        className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
        style={{
          left: `${position}%`,
          background: 'var(--color-gold)',
          transform: 'translateX(-50%)',
          boxShadow: '0 0 8px rgba(196,184,122,0.4)',
        }}
      />

      {/* Uchwyt — handle */}
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        style={{ left: `${position}%` }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--color-gold)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 6 15 12 9 18" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,0)"/>
          </svg>
        </div>
      </div>

      {/* Etykiety PRZED / PO */}
      <div
        className="absolute top-4 left-4 pointer-events-none"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(0,0,0,0.35)',
          padding: '4px 8px',
          opacity: position < 20 ? 0 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        Przed
      </div>
      <div
        className="absolute top-4 right-4 pointer-events-none"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(0,0,0,0.35)',
          padding: '4px 8px',
          opacity: position > 80 ? 0 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        Po
      </div>
    </div>
  )
}
