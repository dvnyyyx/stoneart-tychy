import { redirect } from 'next/navigation'
import { GalleryEditor } from './GalleryEditor'

interface Props {
  searchParams: { k?: string }
}

export const metadata = {
  title: 'Galeria — edytor',
  robots: { index: false, follow: false },
}

export default function GaleriaAdminPage({ searchParams }: Props) {
  const secret = process.env.ADMIN_SECRET
  const provided = searchParams.k

  // Blokuj dostęp jeśli ADMIN_SECRET nie jest skonfigurowany
  // lub podany klucz jest nieprawidłowy
  if (!secret || provided !== secret) {
    redirect('/keystatic')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GalleryEditor adminSecret={secret} />
    </div>
  )
}
