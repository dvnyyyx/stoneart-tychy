import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getFooterContent, getServices, getSiteSettings } from '@/lib/content'
import { telHref, mailHref, toParagraphs } from '@/lib/utils'
import { StoneArtLogo } from '@/components/shared/StoneArtLogo'

export async function Footer() {
  const year = new Date().getFullYear()
  const [footer, site, services] = await Promise.all([
    getFooterContent(),
    getSiteSettings(),
    getServices(),
  ])

  return (
    <footer>
      {/* Główna część — ciemny grafit */}
      <div className="bg-stone-dark stone-texture">
        <div className="container-stone py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8">

            {/* Kolumna 1: logo + dane */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-3 mb-6 group"
                aria-label={`${site.companyName} — strona główna`}
              >
                <StoneArtLogo size={36} variant="light" />
                <div>
                  <span className="block font-display text-[22px] leading-none text-on-dark" style={{ fontWeight: 400 }}>
                    {site.companyName}
                  </span>
                  <span
                    className="block mt-0.5 text-on-dark-secondary"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                  >
                    {site.companyFullName.replace(site.companyName, '').trim() || site.companyFullName}
                  </span>
                </div>
              </Link>

              <div className="text-on-dark-secondary text-[14px] leading-[1.8] mb-6 max-w-[260px]">
                {toParagraphs(footer.about).map((p, i) => (
                  <p key={i} className={i > 0 ? 'mt-3' : undefined}>{p}</p>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <a href={telHref(site.phone)} className="flex items-center gap-3 group/link">
                  <Phone size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)', flexShrink: 0 }} aria-hidden="true" />
                  <span className="text-[14px] text-on-dark group-hover/link:text-gold transition-colors duration-200">
                    {site.phone}
                  </span>
                </a>
                <a href={mailHref(site.email)} className="flex items-center gap-3 group/link">
                  <Mail size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)', flexShrink: 0 }} aria-hidden="true" />
                  <span className="text-[14px] text-on-dark-secondary group-hover/link:text-on-dark transition-colors duration-200 break-all">
                    {site.email}
                  </span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                  <span className="text-[14px] text-on-dark-secondary leading-[1.7]">
                    {site.address}<br />
                    {site.city}, woj. {site.region}
                  </span>
                </div>
              </div>

              <div className="bar-motif bar-motif--light mt-8" aria-hidden="true">
                <div className="bar-motif__dark" />
                <div className="bar-motif__gold" />
              </div>
            </div>

            {/* Kolumna 2: usługi */}
            <div>
              <h2
                className="text-on-dark mb-5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                {footer.servicesHeading}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/uslugi/${service.slug}`}
                      className="text-[13px] text-on-dark-secondary hover:text-on-dark transition-colors duration-200 leading-[1.6]"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolumna 3: firma */}
            <div>
              <h2
                className="text-on-dark mb-5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                {footer.companyHeading}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {footer.companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-on-dark-secondary hover:text-on-dark transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolumna 4: wycena */}
            <div>
              <h2
                className="text-on-dark mb-5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                {footer.ctaHeading}
              </h2>
              <p className="text-[13px] text-on-dark-secondary leading-[1.75] mb-5">
                {footer.ctaText}
              </p>
              <Link href={footer.ctaHref} className="btn-gold text-[9px] inline-block">
                {footer.ctaButton}
              </Link>
              <p className="text-[11px] text-on-dark-secondary mt-4 leading-[1.7]">
                {site.hours}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dolny pasek */}
      <div
        className="bg-[#1A1A1A] relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="absolute top-0 left-0 right-0 flex" style={{ height: '1px' }} aria-hidden="true">
          <div
            className="flex-[0.45]"
            style={{
              background: '#2D2D2D',
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
            }}
          />
          <div
            className="flex-[0.55]"
            style={{
              background: 'rgba(196,184,122,0.15)',
              clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%)',
            }}
          />
        </div>

        <div className="container-stone py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              © {year} {site.companyName} {site.owner}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-[11px]" style={{ color: 'rgba(196,184,122,0.3)' }}>
                {site.address} · {site.phone}
              </p>
              <Link
                href="/polityka-prywatnosci"
                className="text-[11px] transition-colors duration-200 hover:opacity-60"
                style={{ color: 'rgba(255,255,255,0.18)' }}
              >
                {footer.privacyLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
