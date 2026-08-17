import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { RealizacjePageContent } from '@/components/pages/RealizacjePageContent'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const cms = await contentApi.getRealizacjePageContent()
  return {
    title: cms.metaTitle || cms.pageTitle,
    description: cms.metaDescription || cms.pageLead,
    alternates: { canonical: `${SITE_URL}/realizacje` },
  }
}

export default function Page() {
  return <RealizacjePageContent />
}
