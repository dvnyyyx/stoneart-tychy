import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { OpiniePageContent } from '@/components/pages/OpiniePageContent'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const cms = await contentApi.getOpiniePageContent()
  return {
    title: cms.metaTitle || cms.pageTitle,
    description: cms.metaDescription || cms.pageLead,
    alternates: { canonical: `${SITE_URL}/opinie` },
  }
}

export default function Page() {
  return <OpiniePageContent />
}
