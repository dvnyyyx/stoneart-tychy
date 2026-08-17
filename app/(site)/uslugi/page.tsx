import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { UslugiPageContent } from '@/components/pages/UslugiPageContent'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const cms = await contentApi.getUslugiPageContent()
  return {
    title: cms.metaTitle || cms.pageTitle,
    description: cms.metaDescription || cms.pageLead,
    alternates: { canonical: `${SITE_URL}/uslugi` },
  }
}

export default function Page() {
  return <UslugiPageContent />
}
