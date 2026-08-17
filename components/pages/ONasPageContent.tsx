import { contentApi, type ContentApi } from '@/lib/content'
import { PageHeader }       from '@/components/shared/PageHeader'
import { EditorialSection } from '@/components/sections/EditorialSection'
import { QuoteSection }     from '@/components/sections/QuoteSection'
import { BreadcrumbSchema } from '@/lib/schema'

export async function ONasPageContent({ api = contentApi }: { api?: ContentApi } = {}) {
  const cms = await api.getONasContent()

  const s1Image = api.image(cms.s1Image)
  const s2Image = api.image(cms.s2Image)
  const s3Image = api.image(cms.s3Image)

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'O pracowni', href: '/o-nas' }]} />

      <div className="bg-stone-light border-b border-stone-border">
        <PageHeader
          label={cms.pageLabel}
          title={cms.pageTitle}
          lead={cms.pageLead}
        />
      </div>

      <EditorialSection
        label={cms.s1Label}
        title={cms.s1Title}
        body={
          <>
            <p>{cms.s1Text1}</p>
            {cms.s1Text2 && <p style={{ marginTop: '16px' }}>{cms.s1Text2}</p>}
          </>
        }
        image={s1Image ? { src: s1Image, alt: cms.s1Title } : undefined}
        imagePosition="right"
        imageRatio="portrait"
        background="light"
      />

      <EditorialSection
        label={cms.s2Label}
        title={cms.s2Title}
        body={
          <>
            <p>{cms.s2Text1}</p>
            {cms.s2Text2 && <p style={{ marginTop: '16px' }}>{cms.s2Text2}</p>}
          </>
        }
        image={s2Image ? { src: s2Image, alt: cms.s2Title } : undefined}
        imagePosition="left"
        imageRatio="landscape"
        background="default"
      />

      <EditorialSection
        label={cms.s3Label}
        title={cms.s3Title}
        body={
          <>
            <p>{cms.s3Text1}</p>
            {cms.s3Text2 && <p style={{ marginTop: '16px' }}>{cms.s3Text2}</p>}
          </>
        }
        linkLabel={cms.s3LinkLabel}
        linkHref={cms.s3LinkHref}
        image={s3Image ? { src: s3Image, alt: cms.s3Title } : undefined}
        imagePosition="right"
        imageRatio="square"
        background="light"
      />

      <QuoteSection api={api} />
    </>
  )
}
