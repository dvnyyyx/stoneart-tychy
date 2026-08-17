import { contentApi } from '@/lib/content'
import { PodgladPanel } from '@/components/preview/PodgladPanel'

// Widok dzielony: po lewej panel CMS, po prawej strona renderowana z treści
// pobranej wprost z gałęzi GitHuba. Trasa musi być dynamiczna, żeby lista
// podstron w selektorze zawsze odpowiadała aktualnym usługom w CMS.
export const dynamic = 'force-dynamic'

export default async function PodgladPage() {
  const services = await contentApi.getServices()

  const strony = [
    { href: '/', label: 'Strona główna' },
    { href: '/o-nas', label: 'O pracowni' },
    { href: '/uslugi', label: 'Usługi' },
    ...services.map((s) => ({ href: `/uslugi/${s.slug}`, label: `Usługa: ${s.title}` })),
    { href: '/realizacje', label: 'Realizacje' },
    { href: '/opinie', label: 'Opinie' },
    { href: '/wycena', label: 'Wycena' },
    { href: '/kontakt', label: 'Kontakt' },
    { href: '/polityka-prywatnosci', label: 'Polityka prywatności' },
  ]

  return <PodgladPanel strony={strony} />
}
