import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { KontaktPageContent } from '@/components/pages/KontaktPageContent'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const [cms, site] = await Promise.all([contentApi.getKontaktPageContent(), contentApi.getSiteSettings()])
  return {
    title: cms.metaTitle || cms.pageTitle,
    description:
      cms.metaDescription ||
      `Skontaktuj się z ${site.companyName}. Tel: ${site.phone}, e-mail: ${site.email}. ${site.address}.`,
    alternates: { canonical: `${SITE_URL}/kontakt` },
  }
}

export default function Page() {
  return <KontaktPageContent />
}
