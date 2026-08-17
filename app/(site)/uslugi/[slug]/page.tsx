import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { contentApi } from '@/lib/content'
import { ServicePageContent } from '@/components/pages/ServicePageContent'

export const revalidate = false
// Slug spoza CMS → 404 zamiast prób renderowania w runtime.
export const dynamicParams = false

export async function generateStaticParams() {
  const services = await contentApi.getServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const service = await contentApi.getService(params.slug)
  if (!service) return {}

  const title = service.metaTitle || `${service.title} — Tychy i Śląsk`
  const description = service.metaDescription || service.description

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/uslugi/${service.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/uslugi/${service.slug}`,
    },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ServicePageContent slug={params.slug} />
}
