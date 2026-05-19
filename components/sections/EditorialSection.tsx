import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { AnimatedReveal } from '@/components/shared/AnimatedReveal'

interface EditorialSectionProps {
  label?: string
  title: string
  body: string | React.ReactNode
  linkLabel?: string
  linkHref?: string
  image?: {
    src: string
    alt: string
  }
  imagePosition?: 'left' | 'right'
  imageRatio?: 'landscape' | 'portrait' | 'square'
  background?: 'default' | 'light' | 'dark'
  className?: string
}

export function EditorialSection({
  label,
  title,
  body,
  linkLabel,
  linkHref,
  image,
  imagePosition = 'left',
  imageRatio = 'portrait',
  background = 'light',
  className,
}: EditorialSectionProps) {
  const bgClass = {
    default: 'bg-stone-bg',
    light:   'bg-stone-light',
    dark:    'bg-stone-dark',
  }[background]

  const aspectClass = {
    landscape: 'aspect-[4/3]',
    portrait:  'aspect-[3/4]',
    square:    'aspect-square',
  }[imageRatio]

  const textOnDark = background === 'dark'
  const hasImage = !!image?.src

  const ImageBlock = (
    /* Wrapper wypełnia całą wysokość kolumny siatki */
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[620px] overflow-hidden">
      <AnimatedReveal direction="fade" className="absolute inset-0">
        {hasImage ? (
          <Image
            src={image!.src}
            alt={image!.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-end p-8"
            style={{ background: 'linear-gradient(135deg, #2D2D2D 0%, #1E1E1E 100%)' }}
          >
            <div className="bar-motif">
              <div className="bar-motif__dark" />
              <div className="bar-motif__gold" />
            </div>
          </div>
        )}
      </AnimatedReveal>
    </div>
  )

  const TextBlock = (
    <AnimatedReveal
      delay={100}
      className={cn(
        'flex flex-col justify-center',
        'px-6 py-12 lg:px-16 lg:py-0'
      )}
    >
      {label && (
        <SectionLabel
          variant={textOnDark ? 'light' : 'default'}
          className="mb-4 mt-4"
        >
          {label}
        </SectionLabel>
      )}

      <h2
        className={cn(
          'font-display text-display-md leading-[1.12] mb-5',
          textOnDark ? 'text-on-dark' : 'text-ink'
        )}
      >
        {title}
      </h2>

      <div
        className={cn(
          'text-body-md leading-[1.75] prose-stone',
          textOnDark ? 'text-on-dark-secondary' : 'text-ink-secondary'
        )}
      >
        {typeof body === 'string' ? <p>{body}</p> : body}
      </div>

      {linkLabel && linkHref && (
        <Link
          href={linkHref}
          className={cn(
            'link-stone mt-7 self-start',
            textOnDark && 'text-gold'
          )}
        >
          {linkLabel} →
        </Link>
      )}

      <div className="bar-motif mt-8">
        <div className={cn('bar-motif__dark', textOnDark && 'opacity-30')} />
        <div className="bar-motif__gold" />
      </div>
    </AnimatedReveal>
  )

  return (
    <section className={cn(bgClass, 'stone-texture overflow-hidden', className)}>
      <div className={cn(
        'grid grid-cols-1 lg:grid-cols-2 lg:items-stretch',
      )}>
        {imagePosition === 'left' ? (
          <>
            <div className="relative lg:self-stretch">{ImageBlock}</div>
            <div>{TextBlock}</div>
          </>
        ) : (
          <>
            <div className="order-2 lg:order-1">{TextBlock}</div>
            <div className="relative order-1 lg:order-2 lg:self-stretch">{ImageBlock}</div>
          </>
        )}
      </div>
    </section>
  )
}
