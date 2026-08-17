import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { HomePageContent } from '@/components/pages/HomePageContent'

export const revalidate = false // strona statyczna — przebudowa przy każdym deployu

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([contentApi.getHomepageContent(), contentApi.getSiteSettings()])
  return {
    title: { absolute: home.metaTitle },
    description: home.metaDescription || site.description,
    alternates: { canonical: SITE_URL },
  }
}

export default function Page() {
  return <HomePageContent />
}
