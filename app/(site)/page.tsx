import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getHomepageContent, getSiteSettings, resolveImage } from '@/lib/content'
import { Hero }                from '@/components/sections/Hero'
import { EditorialSection }    from '@/components/sections/EditorialSection'
import { ServiceGrid }         from '@/components/sections/ServiceGrid'
import { RealizationGallery }  from '@/components/sections/RealizationGallery'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { QuoteSection }        from '@/components/sections/QuoteSection'
import { LocalBusinessSchema, WebSiteSchema } from '@/lib/schema'

export const revalidate = false // strona statyczna — przebudowa przy każdym deployu

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([getHomepageContent(), getSiteSettings()])
  return {
    title: { absolute: home.metaTitle },
    description: home.metaDescription || site.description,
    alternates: { canonical: SITE_URL },
  }
}

export default async function HomePage() {
  const [home, site] = await Promise.all([getHomepageContent(), getSiteSettings()])

  const editorial1 = resolveImage(home.editorialImage1)
  const editorial2 = resolveImage(home.editorialImage2)

  return (
    <>
      <LocalBusinessSchema />
      <WebSiteSchema />
      <Hero />

      <EditorialSection
        label={home.aboutLabel}
        title={home.aboutTitle}
        body={
          <>
            <p>{home.aboutText1}</p>
            {home.aboutText2 && <p style={{ marginTop: '16px' }}>{home.aboutText2}</p>}
          </>
        }
        linkLabel={home.aboutLinkLabel}
        linkHref={home.aboutLinkHref}
        image={editorial1 ? { src: editorial1, alt: `${site.companyName} — pracownia kamieniarsko-liternicza` } : undefined}
        imagePosition="left"
        imageRatio="landscape"
        background="light"
      />

      <ServiceGrid />
      <RealizationGallery />

      <EditorialSection
        label={home.qualityLabel}
        title={home.qualityTitle}
        body={
          <>
            <p>{home.qualityText1}</p>
            {home.qualityText2 && <p style={{ marginTop: '16px' }}>{home.qualityText2}</p>}
          </>
        }
        linkLabel={home.qualityLinkLabel}
        linkHref={home.qualityLinkHref}
        image={editorial2 ? { src: editorial2, alt: `${site.companyName} — jakość i precyzja wykonania` } : undefined}
        imagePosition="right"
        imageRatio="landscape"
        background="default"
      />

      <TestimonialsSection />
      <QuoteSection />
    </>
  )
}
