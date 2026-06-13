import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { PHOTOS, photoSrc } from '@/lib/photos'
import { getHomepageContent, resolveImage } from '@/lib/content'
import { Hero }                from '@/components/sections/Hero'
import { EditorialSection }    from '@/components/sections/EditorialSection'
import { ServiceGrid }         from '@/components/sections/ServiceGrid'
import { RealizationGallery }  from '@/components/sections/RealizationGallery'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { QuoteSection }        from '@/components/sections/QuoteSection'
import { LocalBusinessSchema, WebSiteSchema } from '@/lib/schema'

export const revalidate = false // strona statyczna — rebuild przy każdym deployu

export const metadata: Metadata = {
  title: { absolute: 'StoneArt Tychy — Liternictwo nagrobne i renowacja nagrobków' },
  description: SITE.description,
  alternates: { canonical: SITE.url },
}

export default async function HomePage() {
  let editorial1: { src: string; alt: string } | undefined
  let editorial2: { src: string; alt: string } | undefined
  let aboutLabel = 'O pracowni'
  let aboutTitle = 'Precyzja i dbałość o szczegóły.'
  let aboutText1 = 'Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów oraz renowacji nagrobków i tablic granitowych. Działamy na terenie Tychów i okolicznych miejscowości, wykonując usługi zarówno dla klientów indywidualnych, jak i zakładów kamieniarskich.'
  let aboutText2 = 'Rozumiemy, że nagrobek jest miejscem pamięci bliskich osób. Do każdego zlecenia podchodzimy z należytą starannością i szacunkiem.'
  let qualityLabel = 'Jak pracujemy'
  let qualityTitle = 'Solidnie, estetycznie, trwale.'
  let qualityText1 = 'Każde zlecenie realizujemy indywidualnie, zwracając uwagę na estetykę, trwałość i dokładność wykonania. Pracujemy na różnych rodzajach kamienia naturalnego, dobierając odpowiednią technikę do każdego przypadku.'
  let qualityText2 = 'W wielu przypadkach do wstępnej wyceny wystarczą zdjęcia przesłane telefonicznie. Napisz lub zadzwoń — bezpośredni kontakt na każdym etapie zlecenia, wycena bezpłatna.'

  try {
    const cms = await getHomepageContent()
    if (cms?.aboutLabel) aboutLabel = cms.aboutLabel
    if (cms?.aboutTitle) aboutTitle = cms.aboutTitle
    if (cms?.aboutText1) aboutText1 = cms.aboutText1
    if (cms?.aboutText2) aboutText2 = cms.aboutText2
    if (cms?.qualityLabel) qualityLabel = cms.qualityLabel
    if (cms?.qualityTitle) qualityTitle = cms.qualityTitle
    if (cms?.qualityText1) qualityText1 = cms.qualityText1
    if (cms?.qualityText2) qualityText2 = cms.qualityText2
    editorial1 = cms?.editorialImage1
      ? { src: resolveImage(cms.editorialImage1), alt: 'StoneArt — pracownia kamieniarsko-liternicza' }
      : PHOTOS[2] ? { src: photoSrc(PHOTOS[2].file), alt: PHOTOS[2].alt } : undefined
    editorial2 = cms?.editorialImage2
      ? { src: resolveImage(cms.editorialImage2), alt: 'StoneArt — jakość i precyzja wykonania' }
      : PHOTOS[3] ? { src: photoSrc(PHOTOS[3].file), alt: PHOTOS[3].alt } : undefined
  } catch {
    editorial1 = PHOTOS[2] ? { src: photoSrc(PHOTOS[2].file), alt: PHOTOS[2].alt } : undefined
    editorial2 = PHOTOS[3] ? { src: photoSrc(PHOTOS[3].file), alt: PHOTOS[3].alt } : undefined
  }

  return (
    <>
      <LocalBusinessSchema />
      <WebSiteSchema />
      <Hero />

      <EditorialSection
        label={aboutLabel}
        title={aboutTitle}
        body={
          <>
            <p>{aboutText1}</p>
            <p style={{ marginTop: '16px' }}>{aboutText2}</p>
          </>
        }
        linkLabel="O pracowni"
        linkHref="/o-nas"
        image={editorial1}
        imagePosition="left"
        imageRatio="landscape"
        background="light"
      />

      <ServiceGrid />
      <RealizationGallery />

      <EditorialSection
        label={qualityLabel}
        title={qualityTitle}
        body={
          <>
            <p>{qualityText1}</p>
            <p style={{ marginTop: '16px' }}>{qualityText2}</p>
          </>
        }
        linkLabel="Zapytaj o wycenę"
        linkHref="/wycena"
        image={editorial2}
        imagePosition="right"
        imageRatio="landscape"
        background="default"
      />

      <TestimonialsSection />
      <QuoteSection />
    </>
  )
}
