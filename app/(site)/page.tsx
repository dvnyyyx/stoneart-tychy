import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { PHOTOS, photoSrc } from '@/lib/photos'
import { Hero }                from '@/components/sections/Hero'
import { EditorialSection }    from '@/components/sections/EditorialSection'
import { ServiceGrid }         from '@/components/sections/ServiceGrid'
import { RealizationGallery }  from '@/components/sections/RealizationGallery'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { QuoteSection }        from '@/components/sections/QuoteSection'
import { LocalBusinessSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'StoneArt — Piaskowanie napisów, dopiski i renowacja nagrobków, Tychy',
  description: SITE.description,
  alternates: { canonical: SITE.url },
}

export default function HomePage() {
  const editorial1 = PHOTOS[2] ? { src: photoSrc(PHOTOS[2].file), alt: PHOTOS[2].alt } : undefined
  const editorial2 = PHOTOS[3] ? { src: photoSrc(PHOTOS[3].file), alt: PHOTOS[3].alt } : undefined

  return (
    <>
      {/* Schema.org LocalBusiness */}
      <LocalBusinessSchema />

      {/* 1. Hero — pełny ekran, dark */}
      <Hero />

      {/* 2. Editorial intro — o pracowni */}
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

      {/* 3. Grid usług */}
      <ServiceGrid />

      {/* 4. Galeria realizacji */}
      <RealizationGallery />

      {/* 5. Drugi blok editorial — proces i jakość */}
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

      {/* 6. Opinie */}
      <TestimonialsSection />

      {/* 7. Formularz wyceny */}
      <QuoteSection />
    </>
  )
}
