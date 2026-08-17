import Link from 'next/link'
import Image from 'next/image'
import { getHeroContent, getSiteSettings, resolveImage } from '@/lib/content'
import { telHref } from '@/lib/utils'
import { SectionLabel } from '@/components/shared/SectionLabel'

export async function Hero() {
  const [hero, site] = await Promise.all([getHeroContent(), getSiteSettings()])
  const heroImageSrc = resolveImage(hero.heroImage)

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden bg-stone-dark"
      aria-label="Nagłówek strony"
    >
      <div className="absolute inset-0">
        {heroImageSrc && (
          <Image
            src={heroImageSrc}
            alt={hero.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            style={{ opacity: 0.55 }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(30,30,30,0.95) 0%, rgba(30,30,30,0.6) 55%, rgba(30,30,30,0.2) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(30,30,30,0.5) 0%, transparent 50%)',
          }}
        />
      </div>

      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ width: '280px', height: '56px', overflow: 'hidden' }}
        aria-hidden="true"
      >
        <svg width="280" height="56" viewBox="0 0 280 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,56 200,56 230,0 30,0" fill="#1E1E1E" opacity="0.7" />
          <polygon points="195,56 280,56 280,28 225,56" fill="#C4B87A" opacity="0.55" />
        </svg>
      </div>

      <div className="relative z-10 container-stone py-20 lg:py-28 w-full">
        <div className="max-w-[560px]">
          <SectionLabel variant="light" withLine className="mb-6">
            {hero.label}
          </SectionLabel>

          <h1
            className="font-display text-on-dark leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(44px, 6vw, 78px)', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            {hero.titleLine1}<br />
            {hero.titleLine2}<br />
            <span className="italic" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {hero.titleLine3}
            </span>
          </h1>

          <p
            className="text-on-dark-secondary text-[17px] leading-[1.75] max-w-[420px] mb-10"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href={hero.ctaPrimaryHref} className="btn-gold">
              {hero.ctaPrimary}
            </Link>
            <a
              href={telHref(site.phone)}
              className="btn flex items-center gap-2.5 text-on-dark-secondary border border-white/20 hover:border-white/50 transition-colors duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.29 6.29l.95-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {site.phone}
            </a>
          </div>

          {hero.scrollLabel && (
            <div className="hidden lg:flex items-center gap-3 mt-20" style={{ color: 'rgba(255,255,255,0.25)' }} aria-hidden="true">
              <div className="w-[1px] h-[48px]" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>
                {hero.scrollLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
