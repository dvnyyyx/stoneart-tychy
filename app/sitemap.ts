import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getServices } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                 lastModified: now, changeFrequency: 'monthly', priority: 1    },
    { url: `${SITE_URL}/uslugi`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9  },
    { url: `${SITE_URL}/realizacje`, lastModified: now, changeFrequency: 'monthly', priority: 0.8  },
    { url: `${SITE_URL}/o-nas`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.7  },
    { url: `${SITE_URL}/opinie`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6  },
    { url: `${SITE_URL}/wycena`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.8  },
    { url: `${SITE_URL}/kontakt`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.7  },
  ]

  // Usługi wyłącznie z CMS — lista hardkodowana potrafiła wypuścić do sitemapy
  // slug, którego już nie ma, czyli adres kończący się 404.
  const services = await getServices()
  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/uslugi/${service.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.85,
  }))

  return [...staticRoutes, ...serviceRoutes]
}
