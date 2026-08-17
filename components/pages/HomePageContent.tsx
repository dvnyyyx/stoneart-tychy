import { contentApi, type ContentApi } from '@/lib/content'
import { Hero }                from '@/components/sections/Hero'
import { EditorialSection }    from '@/components/sections/EditorialSection'
import { ServiceGrid }         from '@/components/sections/ServiceGrid'
import { RealizationGallery }  from '@/components/sections/RealizationGallery'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { QuoteSection }        from '@/components/sections/QuoteSection'
import { LocalBusinessSchema, WebSiteSchema } from '@/lib/schema'

export async function HomePageContent({ api = contentApi }: { api?: ContentApi } = {}) {
  const [home, site] = await Promise.all([api.getHomepageContent(), api.getSiteSettings()])

  const editorial1 = api.image(home.editorialImage1)
  const editorial2 = api.image(home.editorialImage2)

  return (
    <>
      <LocalBusinessSchema api={api} />
      <WebSiteSchema api={api} />
      <Hero api={api} />

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

      <ServiceGrid api={api} />
      <RealizationGallery api={api} />

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

      <TestimonialsSection api={api} />
      <QuoteSection api={api} />
    </>
  )
}
