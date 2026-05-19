import { MetadataRoute } from 'next'
import { SITE, SERVICES } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url,                      lastModified: now, changeFrequency: 'monthly', priority: 1    },
    { url: `${SITE.url}/uslugi`,          lastModified: now, changeFrequency: 'monthly', priority: 0.9  },
    { url: `${SITE.url}/realizacje`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8  },
    { url: `${SITE.url}/o-nas`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.7  },
    { url: `${SITE.url}/opinie`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6  },
    { url: `${SITE.url}/wycena`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.8  },
    { url: `${SITE.url}/kontakt`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.7  },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${SITE.url}/uslugi/${service.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.85,
  }))

  return [...staticRoutes, ...serviceRoutes]
}
