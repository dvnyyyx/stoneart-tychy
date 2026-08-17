import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { PolitykaPrywatnosciContent } from '@/components/pages/PolitykaPrywatnosciContent'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const cms = await contentApi.getPrivacyPageContent()
  return {
    title: cms.metaTitle || cms.pageTitle,
    description: cms.metaDescription || cms.pageLead,
    alternates: { canonical: `${SITE_URL}/polityka-prywatnosci` },
    robots: { index: false },
  }
}

export default function Page() {
  return <PolitykaPrywatnosciContent />
}
