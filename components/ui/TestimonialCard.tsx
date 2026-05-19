import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  quote: string
  author: string
  location: string
  variant?: 'dark' | 'light'
  className?: string
}

export function TestimonialCard({
  quote,
  author,
  location,
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
        "
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
