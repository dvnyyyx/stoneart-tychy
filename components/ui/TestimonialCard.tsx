import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  quote: string
  author: string
  location: string
  rating?: number
  variant?: 'dark' | 'light'
  className?: string
}

function Stars({ rating, isDark }: { rating: number; isDark: boolean }) {
  const gold = isDark ? 'var(--color-gold)' : 'var(--color-gold-dark)'
  const empty = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
  return (
    <div aria-label={`Ocena: ${rating} na 5`} style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i <= rating ? gold : empty}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialCard({
  quote,
  author,
  location,
  rating,
  variant = 'dark',
  className,
}: TestimonialCardProps) {
  const isDark = variant === 'dark'

  return (
    <figure
      className={cn(
        'flex flex-col gap-5',
        isDark ? 'text-on-dark' : 'text-ink',
        className
      )}
    >
      {/* Gwiazdki (jeśli podane) */}
      {rating != null && <Stars rating={rating} isDark={isDark} />}

      {/* Cudzysłów dekoracyjny */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-quote)',
          fontSize: '48px',
          lineHeight: 1,
          color: isDark ? 'rgba(196,184,122,0.3)' : 'rgba(168,155,88,0.25)',
          marginBottom: '-16px',
          fontStyle: 'italic',
        }}
      >
        &ldquo;
      </div>

      <blockquote>
        <p
          className="leading-[1.75]"
          style={{
            fontFamily: 'var(--font-quote)',
            fontSize: '17px',
            fontStyle: 'italic',
            fontWeight: 300,
            color: isDark ? 'rgba(255,255,255,0.78)' : 'var(--color-text)',
          }}
        >
          {quote}
        </p>
      </blockquote>

      <figcaption className="flex items-center gap-3">
        {/* Linia akcentowa */}
        <div
          style={{
            width: '20px',
            height: '1px',
            background: isDark ? 'var(--color-gold)' : 'var(--color-gold-dark)',
            flexShrink: 0,
          }}
        />
        <div>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: isDark ? 'var(--color-gold)' : 'var(--color-text)',
            }}
          >
            {author}
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              color: isDark ? 'rgba(255,255,255,0.35)' : 'var(--color-text-3)',
              marginTop: '1px',
            }}
          >
            {location}
          </span>
        </div>
      </figcaption>
    </figure>
  )
}
