import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { getONasContent } from '@/lib/content'
import { PageHeader }       from '@/components/shared/PageHeader'
import { EditorialSection } from '@/components/sections/EditorialSection'
import { QuoteSection }     from '@/components/sections/QuoteSection'
import { BreadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'O pracowni — Adam Wytrykus, Tychy',
  description: 'Liternictwo nagrobne, piaskowanie napisów i renowacja nagrobków — StoneArt Tychy. Klienci indywidualni i zakłady kamieniarskie.',
  alternates: { canonical: `${SITE.url}/o-nas` },
}

export default async function ONasPage() {
  let cms: Awaited<ReturnType<typeof getONasContent>> = null
  try { cms = await getONasContent() } catch {}

  const pageTitle = cms?.pageTitle || 'StoneArt — Tychy.'
  const pageLead  = cms?.pageLead  || 'Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów oraz renowacji nagrobków i tablic granitowych. Działamy na terenie Tychów i okolicznych miejscowości.'
  const s1Label   = cms?.s1Label   || 'Czym się zajmujemy'
  const s1Title   = cms?.s1Title   || 'Liternictwo, dopiski i renowacja nagrobków.'
  const s1Text1   = cms?.s1Text1   || 'Zajmujemy się wykonywaniem nowych napisów, dopisków liter i dat, odświeżaniem istniejących inskrypcji oraz pracami związanymi z odnawianiem nagrobków. Pracujemy na różnych rodzajach kamienia naturalnego, dbając o odpowiedni dobór techniki oraz zachowanie czytelności i stylu napisów.'
  const s1Text2   = cms?.s1Text2   || 'Wykonujemy usługi zarówno dla klientów indywidualnych, jak i zakładów kamieniarskich.'
  const s2Label   = cms?.s2Label   || 'Podejście do pracy'
  const s2Title   = cms?.s2Title   || 'Szacunek do każdego zlecenia.'
  const s2Text1   = cms?.s2Text1   || 'Rozumiemy, że nagrobek jest miejscem pamięci bliskich osób, dlatego do każdego zlecenia podchodzimy z należytą starannością i szacunkiem. W naszej pracy liczy się przede wszystkim precyzja i dbałość o szczegóły.'
  const s2Text2   = cms?.s2Text2   || 'Stawiamy na uczciwe podejście, terminowość oraz bezpośredni kontakt z klientem na każdym etapie realizacji zlecenia. Naszym celem jest świadczenie usług solidnych, estetycznych i trwałych — tak, aby efekty naszej pracy służyły przez długie lata.'
  const s3Label   = cms?.s3Label   || 'Wycena'
  const s3Title   = cms?.s3Title   || 'Zdjęcia wystarczą.'
  const s3Text1   = cms?.s3Text1   || 'W wielu przypadkach do wstępnej wyceny wystarczą zdjęcia przesłane telefonicznie, co pozwala szybko określić zakres prac oraz termin realizacji.'
  const s3Text2   = cms?.s3Text2   || 'Napisz lub zadzwoń — bezpośredni kontakt na każdym etapie, wycena bezpłatna.'

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'O pracowni', href: '/o-nas' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label="O pracowni"
          title={pageTitle}
          lead={pageLead}
        />
      </div>

      <EditorialSection
        label={s1Label}
        title={s1Title}
        body={
          <>
            <p>{s1Text1}</p>
            {s1Text2 && <p style={{ marginTop: '16px' }}>{s1Text2}</p>}
          </>
        }
        imagePosition="right"
        imageRatio="portrait"
        background="light"
      />

      <EditorialSection
        label={s2Label}
        title={s2Title}
        body={
          <>
            <p>{s2Text1}</p>
            {s2Text2 && <p style={{ marginTop: '16px' }}>{s2Text2}</p>}
          </>
        }
        imagePosition="left"
        imageRatio="landscape"
        background="default"
      />

      <EditorialSection
        label={s3Label}
        title={s3Title}
        body={
          <>
            <p>{s3Text1}</p>
            {s3Text2 && <p style={{ marginTop: '16px' }}>{s3Text2}</p>}
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
