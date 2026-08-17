import { contentApi, type ContentApi } from '@/lib/content'
import { telHref } from '@/lib/utils'
import { BreadcrumbSchema } from '@/lib/schema'
import { RealizacjeClient } from '@/components/sections/RealizacjeClient'

export async function RealizacjePageContent({ api = contentApi }: { api?: ContentApi } = {}) {
  const [photos, categories, cms, site] = await Promise.all([
    api.getGallery(),
    api.getCategories(),
    api.getRealizacjePageContent(),
    api.getSiteSettings(),
  ])

  // Pokazujemy tylko kategorie, które mają choć jedno zdjęcie —
  // pusty filtr prowadziłby donikąd.
  const used = new Set(photos.map((p) => p.category).filter(Boolean))
  const filters = categories
    .filter((c) => used.has(c.slug))
    .map((c) => ({ slug: c.slug, name: c.name }))

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Realizacje', href: '/realizacje' }]} />
      <RealizacjeClient
        photos={photos.map((p) => ({
          src: p.src,
          alt: p.alt,
          category: p.category,
          categoryName: p.categoryName,
        }))}
        filters={filters}
        phoneHref={telHref(site.phone)}
        content={{
          pageLabel: cms.pageLabel,
          pageTitle: cms.pageTitle,
          pageLead: cms.pageLead,
          galleryLabel: cms.galleryLabel,
          allFilterLabel: cms.allFilterLabel,
          emptyTitle: cms.emptyTitle,
          emptyText: cms.emptyText,
          ctaButton: cms.ctaButton,
        }}
      />
    </>
  )
}
