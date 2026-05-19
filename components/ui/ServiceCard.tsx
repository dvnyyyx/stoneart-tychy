import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SectionLabel } from '@/components/shared/SectionLabel'

interface ServiceCardProps {
  slug: string
  title: string
  category: string
  description: string
  featured?: boolean
  image?: string
  className?: string
}

export function ServiceCard({
  slug,
  title,
  category,
  description,
  featured = false,
  image,
  className,
}: ServiceCardProps) {
  if (featured) {
    return (
      <Link
        href={`/uslugi/${slug}`}
        className={cn(
          'group relative flex flex-col justify-between overflow-hidden',
          'bg-stone-dark stone-texture p-7 lg:p-9',
          'border border-white/5',
          'transition-all duration-300 hover:border-gold/30',
          className
        )}
      >
        {/* Dekoracyjny pasek złoty — lewy border */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: 'var(--color-gold)',
            clipPath: 'polygon(0 4px, 100% 0, 100% 100%, 0 calc(100% - 4px))',
          }}
        />

        <div>
          <SectionLabel variant="light" className="mb-4">
            {category}
          </SectionLabel>

          <h3
            className="font-display text-on-dark leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 400 }}
          >
            {title}
          </h3>

          <p className="text-[14px] text-on-dark-secondary leading-[1.8] max-w-[320px]">
            {description}
          </p>
        </div>

        <div className="mt-8">
          <div className="bar-motif bar-motif--light mb-5">
            <div className="bar-motif__dark" />
            <div className="bar-motif__gold" />
          </div>
          <span
            className="text-[9px] tracking-[0.12em] uppercase transition-colors duration-200"
            style={{ color: 'var(--color-gold)' }}
          >
            Zapytaj o wycenę →
          </span>
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(196,184,122,0.03)' }}
        />
      </Link>
    )
  }

  return (
    <Link
      href={`/uslugi/${slug}`}
      className={cn(
        'group flex flex-col gap-3 p-5 lg:p-6',
        'bg-stone-light border border-stone-border',
        'transition-all duration-300 hover:border-gold',
        className
      )}
    >
      <SectionLabel className="mb-1">
        {category}
      </SectionLabel>

      <h3
        className="font-display text-ink leading-[1.15]"
        style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', fontWeight: 400 }}
      >
        {title}
      </h3>

      <p className="text-[13px] text-ink-secondary leading-[1.7] flex-1">
        {description}
      </p>

      <span className="link-stone mt-2 self-start">
        Więcej →
      </span>
    </Link>
  )
}
