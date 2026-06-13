'use client'

import { useEffect, useState } from 'react'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

export type Review = {
  author: string
  location: string
  quote: string
  rating?: number
}

interface ReviewsListProps {
  initial: Review[]
  limit?: number
  gridClassName: string
  delayStep?: number
}

// Progresywne wzbogacenie: serwer renderuje `initial` (opinie z CMS / stałe),
// a po zamontowaniu dociągamy świeże opinie Google z /api/reviews i podmieniamy
// listę. Fetch dzieje się wyłącznie po stronie klienta, więc strona hostująca
// ten komponent pozostaje statyczna.
export function ReviewsList({ initial, limit, gridClassName, delayStep = 80 }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>(initial)

  useEffect(() => {
    let cancelled = false
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data?.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const displayed = limit ? reviews.slice(0, limit) : reviews

  return (
    <div className={gridClassName}>
      {displayed.map((t, i) => (
        <AnimatedReveal key={`${t.author}-${i}`} delay={i * delayStep}>
          <TestimonialCard
            quote={t.quote}
            author={t.author}
            location={t.location}
            rating={t.rating}
            variant="dark"
          />
        </AnimatedReveal>
      ))}
    </div>
  )
}
