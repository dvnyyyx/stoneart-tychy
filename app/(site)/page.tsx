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
import { LocalBusinessSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'StoneArt — Piaskowanie napisów, dopiski i renowacja nagrobków, Tychy',
  description: SITE.description,
  alternates: { canonical: SITE.url },
}

export default async function HomePage() {
  // Zdjęcia edytorialne z Keystatic (fallback na photos.ts)
  let editorial1: { src: string; alt: string } | undefined
  let editorial2: { src: string; alt: string } | undefined
  try {
    const cms = await getHomepageContent()
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
      <Hero />

      <EditorialSection
        label="O pracowni"
        title="Precyzja i dbałość o szczegóły."
        body={
          <>
            <p>
              Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów
              oraz renowacji nagrobków i tablic granitowych. Działamy na terenie
              Tychów i okolicznych miejscowości, wykonując usługi zarówno dla
              klientów indywidualnych, jak i zakładów kamieniarskich.
            </p>
            <p style={{ marginTop: '16px' }}>
              Rozumiemy, że nagrobek jest miejscem pamięci bliskich osób.
              Do każdego zlecenia podchodzimy z należytą starannością i szacunkiem.
            </p>
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
        label="Jak pracujemy"
        title="Solidnie, estetycznie, trwale."
        body={
          <>
            <p>
              Każde zlecenie realizujemy indywidualnie, zwracając uwagę na
              estetykę, trwałość i dokładność wykonania. Pracujemy na różnych
              rodzajach kamienia naturalnego, dobierając odpowiednią technikę
              do każdego przypadku.
            </p>
            <p style={{ marginTop: '16px' }}>
              W wielu przypadkach do wstępnej wyceny wystarczą zdjęcia przesłane
              telefonicznie. Napisz lub zadzwoń — bezpośredni kontakt na każdym
              etapie zlecenia, wycena bezpłatna.
            </p>
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
