import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { WycenaPageContent } from '@/components/pages/WycenaPageContent'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const cms = await contentApi.getWycenaPageContent()
  return {
    title: cms.metaTitle || cms.pageTitle,
    description: cms.metaDescription || cms.pageLead,
    alternates: { canonical: `${SITE_URL}/wycena` },
  }
}

export default function Page() {
  return <WycenaPageContent />
}
