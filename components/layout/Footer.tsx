import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { SITE, NAV_LINKS, SERVICES } from '@/lib/constants'
import { getServices } from '@/lib/content'
import { StoneArtLogo } from '@/components/shared/StoneArtLogo'

export async function Footer() {
  const year = new Date().getFullYear()

  let serviceLinks: { slug: string; title: string }[] = SERVICES.map((s) => ({
    slug: s.slug,
    title: s.title,
  }))
  try {
    const cmsServices = await getServices()
    if (cmsServices.length > 0) {
      serviceLinks = cmsServices.map((s) => ({ slug: s.slug, title: s.title }))
    }
  } catch {
    // keep constants fallback
  }

  return (
    <footer>
      {/* Main footer — dark charcoal */}
      <div className="bg-stone-dark stone-texture">
        <div className="container-stone py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8">

            {/* Kolumna 1: Logo + dane */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-3 mb-6 group"
                aria-label="StoneArt — strona główna"
              >
                <StoneArtLogo size={36} variant="light" />
                <div>
                  <span className="block font-display text-[22px] leading-none text-on-dark" style={{ fontWeight: 400 }}>
                    StoneArt
                  </span>
                  <span
                    className="block mt-0.5 text-on-dark-secondary"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                  >
                    Usługi Kamieniarsko-Liternicze
                  </span>
                </div>
              </Link>

              <p className="text-on-dark-secondary text-[14px] leading-[1.8] mb-6 max-w-[240px]">
                Liternictwo nagrobne, dopiski<br />
                i renowacja nagrobków — Tychy<br />
                i okolice.
              </p>

              {/* Dane kontaktowe */}
              <div className="flex flex-col gap-3">
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 group/link"
                >
                  <Phone size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                  <span className="text-[14px] text-on-dark group-hover/link:text-gold transition-colors duration-200">
                    {SITE.phone}
                  </span>
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 group/link"
                >
                  <Mail size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                  <span className="text-[14px] text-on-dark-secondary group-hover/link:text-on-dark transition-colors duration-200">
                    {SITE.email}
                  </span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin size={14} strokeWidth={1.5} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                  <span className="text-[14px] text-on-dark-secondary leading-[1.7]">
                    {SITE.address}<br />
                    {SITE.city}, woj. {SITE.region}
                  </span>
                </div>
              </div>

              {/* Bar motif */}
              <div className="bar-motif bar-motif--light mt-8">
                <div className="bar-motif__dark" />
                <div className="bar-motif__gold" />
              </div>
            </div>

            {/* Kolumna 2: Usługi */}
            <div>
              <h3
                className="text-on-dark mb-5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                Usługi
              </h3>
              <ul className="flex flex-col gap-2.5">
                {serviceLinks.map((service) => (
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

            {/* Kolumna 3: Firma */}
            <div>
              <h3
                className="text-on-dark mb-5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                Firma
              </h3>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: 'O pracowni', href: '/o-nas' },
                  { label: 'Realizacje', href: '/realizacje' },
                  { label: 'Opinie', href: '/opinie' },
                  { label: 'Kontakt', href: '/kontakt' },
                ].map((link) => (
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

            {/* Kolumna 4: CTA */}
            <div>
              <h3
                className="text-on-dark mb-5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase' }}
              >
                Wycena
              </h3>
              <p className="text-[13px] text-on-dark-secondary leading-[1.75] mb-5">
                Bezpłatna wycena.<br />
                Odpiszemy lub oddzwonimy<br />
                w ciągu 24 godzin.
              </p>
              <Link
                href="/wycena"
                className="btn-gold text-[9px] inline-block"
              >
                Zapytaj o wycenę
              </Link>
              <p className="text-[11px] text-on-dark-secondary mt-4 leading-[1.7]">
                {SITE.hours}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="bg-[#1A1A1A] relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* Dekoracyjna linia na górze */}
        <div className="absolute top-0 left-0 right-0 flex" style={{ height: '1px' }}>
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
            <p className="text-[11px] text-on-dark-secondary" style={{ color: 'rgba(255,255,255,0.2)' }}>
              © {year} StoneArt {SITE.owner}
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(196,184,122,0.3)' }}>
              {SITE.address} · {SITE.phone}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
