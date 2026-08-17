import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { previewContentApi } from '@/lib/content-preview'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomePageContent } from '@/components/pages/HomePageContent'
import { ONasPageContent } from '@/components/pages/ONasPageContent'
import { UslugiPageContent } from '@/components/pages/UslugiPageContent'
import { ServicePageContent } from '@/components/pages/ServicePageContent'
import { RealizacjePageContent } from '@/components/pages/RealizacjePageContent'
import { OpiniePageContent } from '@/components/pages/OpiniePageContent'
import { KontaktPageContent } from '@/components/pages/KontaktPageContent'
import { WycenaPageContent } from '@/components/pages/WycenaPageContent'
import { PolitykaPrywatnosciContent } from '@/components/pages/PolitykaPrywatnosciContent'

// Podgląd renderuje te same komponenty co strona publiczna, ale karmione
// treścią z gałęzi GitHuba — czyli stanem, który Keystatic zapisał chwilę
// wcześniej. Trasa jest dynamiczna i nigdy nie trafia do cache, więc każde
// wejście pokazuje aktualny stan repozytorium.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Podgląd',
  robots: { index: false, follow: false },
}

const api = previewContentApi

function renderPage(path: string) {
  switch (path) {
    case '/':                      return <HomePageContent api={api} />
    case '/o-nas':                 return <ONasPageContent api={api} />
    case '/uslugi':                return <UslugiPageContent api={api} />
    case '/realizacje':            return <RealizacjePageContent api={api} />
    case '/opinie':                return <OpiniePageContent api={api} />
    case '/kontakt':               return <KontaktPageContent api={api} />
    case '/wycena':                return <WycenaPageContent api={api} />
    case '/polityka-prywatnosci':  return <PolitykaPrywatnosciContent api={api} />
  }

  const service = path.match(/^\/uslugi\/([^/]+)$/)
  if (service) return <ServicePageContent slug={service[1]} api={api} />

  return null
}

export default async function PreviewPage({
  params,
}: {
  params: { sciezka?: string[] }
}) {
  const path = '/' + (params.sciezka ?? []).join('/')
  const normalized = path === '/' ? '/' : path.replace(/\/$/, '')
  const page = renderPage(normalized)
  if (!page) notFound()

  return (
    <>
      <Header api={api} />
      <main className="min-h-screen">{page}</main>
      <Footer api={api} />
    </>
  )
}
