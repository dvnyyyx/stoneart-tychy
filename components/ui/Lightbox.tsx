'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LightboxProps {
  images: Array<{ src: string; alt: string }>
  initialIndex?: number
  onClose: () => void
}

export function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [visible, setVisible] = useState(false)

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      handleClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const current = images[index]

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Podgląd zdjęcia"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1A1A]/96 cursor-pointer"
        onClick={handleClose}
      />

      {/* Zamknij */}
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 z-10 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
        aria-label="Zamknij podgląd"
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      {/* Nawigacja prev */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 z-10 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
            aria-label="Poprzednie zdjęcie"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-16 z-10 w-11 h-11 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
            aria-label="Następne zdjęcie"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Zdjęcie */}
      <div
        className="relative z-10 w-full h-full max-w-5xl mx-auto px-16 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ maxHeight: '85vh' }}>
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={1200}
            height={800}
            className="object-contain max-h-[85vh] w-auto mx-auto"
            style={{ animation: 'fadeIn 0.25s ease both' }}
          />
        </div>
      </div>

      {/* Licznik */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"
          aria-live="polite"
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="transition-all duration-200"
              style={{
                width: i === index ? '20px' : '5px',
                height: '2px',
                background: i === index ? 'var(--color-gold)' : 'rgba(255,255,255,0.25)',
              }}
              aria-label={`Zdjęcie ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Alt tekst */}
      <div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 text-center"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.35)',
          maxWidth: '400px',
        }}
      >
        {current.alt}
      </div>
    </div>
  )
}
