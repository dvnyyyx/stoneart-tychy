import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { ONasPageContent } from '@/components/pages/ONasPageContent'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const cms = await contentApi.getONasContent()
  return {
    title: cms.metaTitle || cms.pageTitle,
    description: cms.metaDescription || cms.pageLead,
    alternates: { canonical: `${SITE_URL}/o-nas` },
  }
}

export default function Page() {
  return <ONasPageContent />
}
