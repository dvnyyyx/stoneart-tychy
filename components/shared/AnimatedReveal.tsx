'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number       // ms
  direction?: 'up' | 'fade'
  threshold?: number   // 0–1
  once?: boolean
}

// Subtelny reveal bez Framer Motion — lepszy performance na urządzeniach mobilnych
// Używać oszczędnie — tylko na kluczowych elementach
export function AnimatedReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  threshold = 0.15,
  once = true,
}: AnimatedRevealProps) {
  const ref       = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  const baseStyle: React.CSSProperties = {
    transition: `opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms, transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms`,
  }

  const hiddenStyle: React.CSSProperties =
    direction === 'up'
      ? { opacity: 0, transform: 'translateY(22px)' }
      : { opacity: 0 }

  const visibleStyle: React.CSSProperties = { opacity: 1, transform: 'translateY(0)' }

  return (
    <div
      ref={ref}
      className={cn('will-animate', className)}
      style={{ ...baseStyle, ...(visible ? visibleStyle : hiddenStyle) }}
    >
      {children}
    </div>
  )
}
