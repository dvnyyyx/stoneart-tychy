'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { cn, telHref } from '@/lib/utils'
import { StoneArtLogo } from '@/components/shared/StoneArtLogo'

export interface HeaderClientProps {
  links: readonly { label: string; href: string }[]
  ctaLabel: string
  ctaHref: string
  tagline: string
  companyName: string
  phone: string
}

export function HeaderClient({
  links,
  ctaLabel,
  ctaHref,
  tagline,
  companyName,
  phone,
}: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const phoneLink = telHref(phone)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Zamknięcie menu klawiszem Escape — bez tego użytkownik klawiatury
  // zostaje uwięziony w overlayu.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Na stronie głównej hero jest ciemne — nagłówek startuje jako przezroczysty.
  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[#F4F1EB]/95 backdrop-blur-sm border-b border-[#D8D4C8] shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
            : 'bg-transparent'
        )}
      >
        {/* Pasek dekoracyjny — pojawia się po scroll */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 flex overflow-hidden transition-opacity duration-500 pointer-events-none',
            scrolled ? 'opacity-100' : 'opacity-0'
          )}
          style={{ height: '2px' }}
          aria-hidden="true"
        >
          <div
            className="flex-[0.4]"
            style={{
              background: '#1E1E1E',
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
            }}
          />
          <div
            className="flex-[0.6]"
            style={{
              background: '#C4B87A',
              clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)',
            }}
          />
        </div>

        <div className="container-stone">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0"
              aria-label={`${companyName} — strona główna`}
            >
              <StoneArtLogo
                className="transition-opacity duration-300 group-hover:opacity-80"
                size={36}
                variant={transparent ? 'light' : 'dark'}
              />
              <div>
                <span
                  className={cn(
                    'block font-display text-[20px] leading-none tracking-[-0.01em] transition-colors duration-500',
                    transparent ? 'text-white' : 'text-ink'
                  )}
                  style={{ fontWeight: 400 }}
                >
                  {companyName}
                </span>
                <span
                  className="block mt-0.5 transition-colors duration-500"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '7px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: transparent ? 'rgba(255,255,255,0.5)' : 'var(--color-text-2)',
                  }}
                >
                  {tagline}
                </span>
              </div>
            </Link>

            {/* Nav desktop */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Nawigacja główna"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'relative text-[11px] tracking-[0.1em] uppercase transition-colors duration-300',
                    'after:absolute after:bottom-[-3px] after:left-0 after:h-[1px] after:w-full',
                    'after:scale-x-0 after:transition-transform after:duration-300 after:origin-left',
                    'after:bg-[#C4B87A]',
                    isActive(link.href)
                      ? cn('after:scale-x-100', transparent ? 'text-white' : 'text-ink')
                      : transparent
                        ? 'text-white/60 hover:text-white hover:after:scale-x-100'
                        : 'text-ink/60 hover:text-ink hover:after:scale-x-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href={phoneLink}
                className={cn(
                  'hidden md:flex items-center gap-2 text-[10px] transition-all duration-300',
                  transparent
                    ? 'btn border border-white/30 text-white hover:border-white/70'
                    : 'btn-primary'
                )}
                aria-label={`Zadzwoń: ${phone}`}
              >
                <Phone size={12} strokeWidth={1.5} aria-hidden="true" />
                {phone}
              </a>

              <Link href={ctaHref} className="hidden lg:block text-[10px] btn-gold transition-all duration-300">
                {ctaLabel}
              </Link>

              <button
                type="button"
                className={cn(
                  'lg:hidden flex items-center justify-center w-11 h-11 transition-colors duration-300',
                  transparent ? 'text-white' : 'text-ink'
                )}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav — overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden transition-all duration-400',
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-stone-dark/40 backdrop-blur-sm transition-opacity duration-300',
            menuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMenuOpen(false)}
        />

        <nav
          id="mobile-nav"
          className={cn(
            'absolute top-0 right-0 bottom-0 w-[300px] bg-[#F4F1EB] flex flex-col',
            'transition-transform duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          aria-label="Nawigacja mobilna"
        >
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#D8D4C8]">
            <span className="font-display text-[18px] text-ink">{companyName}</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-ink/60"
              aria-label="Zamknij menu"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 flex flex-col px-6 py-8 gap-1 overflow-y-auto">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={menuOpen ? undefined : -1}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'flex items-center py-4 border-b border-[#D8D4C8]/60',
                  'font-display text-[22px] font-[400] tracking-[-0.01em] transition-colors duration-200',
                  isActive(link.href) ? 'text-ink' : 'text-ink/50 hover:text-ink',
                  menuOpen ? `animate-[fadeIn_0.4s_ease_${i * 0.05}s_both]` : ''
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C4B87A]" aria-hidden="true" />
                )}
              </Link>
            ))}
          </div>

          <div className="px-6 pb-10 flex flex-col gap-3">
            <Link
              href={ctaHref}
              tabIndex={menuOpen ? undefined : -1}
              className="btn-primary w-full text-center"
            >
              {ctaLabel}
            </Link>
            <a
              href={phoneLink}
              tabIndex={menuOpen ? undefined : -1}
              className="btn-ghost w-full text-center flex items-center justify-center gap-2"
            >
              <Phone size={13} strokeWidth={1.5} aria-hidden="true" />
              {phone}
            </a>
            <div className="bar-motif mt-4" aria-hidden="true">
              <div className="bar-motif__dark" />
              <div className="bar-motif__gold" />
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
