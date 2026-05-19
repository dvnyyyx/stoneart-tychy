import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { PageHeader }       from '@/components/shared/PageHeader'
import { EditorialSection } from '@/components/sections/EditorialSection'
import { QuoteSection }     from '@/components/sections/QuoteSection'
import { BreadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'O pracowni — Adam Wytrykus, Tychy',
  description: 'Liternictwo nagrobne, piaskowanie napisów i renowacja nagrobków — StoneArt Tychy. Klienci indywidualni i zakłady kamieniarskie.',
  alternates: { canonical: `${SITE.url}/o-nas` },
}

export default function ONasPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'O pracowni', href: '/o-nas' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label="O pracowni"
          title="StoneArt — Tychy."
          lead="Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów oraz renowacji nagrobków i tablic granitowych. Działamy na terenie Tychów i okolicznych miejscowości."
        />
      </div>

      <EditorialSection
        label="Czym się zajmujemy"
        title="Liternictwo, dopiski i renowacja nagrobków."
        body={
          <>
            <p>
              Zajmujemy się wykonywaniem nowych napisów, dopisków liter i dat,
              odświeżaniem istniejących inskrypcji oraz pracami związanymi
              z odnawianiem nagrobków. Pracujemy na różnych rodzajach kamienia
              naturalnego, dbając o odpowiedni dobór techniki oraz zachowanie
              czytelności i stylu napisów.
            </p>
            <p style={{ marginTop: '16px' }}>
              Wykonujemy usługi zarówno dla klientów indywidualnych,
              jak i zakładów kamieniarskich.
            </p>
          </>
        }
        imagePosition="right"
        imageRatio="portrait"
        background="light"
      />

      <EditorialSection
        label="Podejście do pracy"
        title="Szacunek do każdego zlecenia."
        body={
          <>
            <p>
              Rozumiemy, że nagrobek jest miejscem pamięci bliskich osób,
              dlatego do każdego zlecenia podchodzimy z należytą starannością
              i szacunkiem. W naszej pracy liczy się przede wszystkim precyzja
              i dbałość o szczegóły.
            </p>
            <p style={{ marginTop: '16px' }}>
              Stawiamy na uczciwe podejście, terminowość oraz bezpośredni
              kontakt z klientem na każdym etapie realizacji zlecenia.
              Naszym celem jest świadczenie usług solidnych, estetycznych
              i trwałych — tak, aby efekty naszej pracy służyły przez długie lata.
            </p>
          </>
        }
        imagePosition="left"
        imageRatio="landscape"
        background="default"
      />

      <EditorialSection
        label="Wycena"
        title="Zdjęcia wystarczą."
        body={
          <>
            <p>
              W wielu przypadkach do wstępnej wyceny wystarczą zdjęcia przesłane
              telefonicznie, co pozwala szybko określić zakres prac oraz termin
              realizacji.
            </p>
            <p style={{ marginTop: '16px' }}>
              Napisz lub zadzwoń — bezpośredni kontakt na każdym etapie,
              wycena bezpłatna.
            </p>
          </>
        }
        linkLabel="Zapytaj o wycenę"
        linkHref="/wycena"
        imagePosition="right"
        imageRatio="square"
        background="light"
      />

      <QuoteSection />
    </>
  )
}
