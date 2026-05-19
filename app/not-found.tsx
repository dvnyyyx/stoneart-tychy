import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-bg flex items-center justify-center px-6">
      <div className="text-center max-w-[440px]">
        <p
          className="font-display text-[80px] leading-none text-stone-border mb-0"
          style={{ fontWeight: 400 }}
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="font-display text-[28px] text-ink mb-4 leading-[1.2]" style={{ fontWeight: 400 }}>
          Strona nie istnieje.
        </h1>
        <p className="text-[15px] text-ink-secondary mb-8 leading-[1.75]">
          Strona, której szukasz, nie została znaleziona. Wróć na stronę główną.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Strona główna
          </Link>
          <Link href="/kontakt" className="btn-ghost">
            Kontakt
          </Link>
        </div>
        <div className="bar-motif justify-center mt-10">
          <div className="bar-motif__dark" />
          <div className="bar-motif__gold" />
        </div>
      </div>
    </div>
  )
}
