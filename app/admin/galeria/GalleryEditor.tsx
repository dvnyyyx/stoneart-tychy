'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { GalleryItem } from '@/app/api/admin/gallery/route'
// ↑ tylko typ — nie bundluje server-side kodu

const CATEGORY_LABELS: Record<string, string> = {
  liternictwo: 'Liternictwo',
  renowacja: 'Renowacja',
  montaz: 'Montaż tablic',
  inne: 'Inne',
}

const CATEGORY_COLORS: Record<string, string> = {
  liternictwo: 'bg-blue-100 text-blue-800',
  renowacja: 'bg-amber-100 text-amber-800',
  montaz: 'bg-green-100 text-green-800',
  inne: 'bg-gray-100 text-gray-700',
}

// Buduje URL do podglądu zdjęcia z GitHub raw
function githubRawUrl(imagePath: string): string {
  const clean = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `https://raw.githubusercontent.com/dvnyyyx/stoneart-tychy/main/public/${clean}`
}

interface UploadPreview {
  file: File
  previewUrl: string
  alt: string
  category: string
  featured: boolean
}

interface Props {
  adminSecret: string
}

export function GalleryEditor({ adminSecret }: Props) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  // Drag state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const dragCounter = useRef(0)

  // Upload state
  const [uploadPreviews, setUploadPreviews] = useState<UploadPreview[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMsg, setUploadMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const authHeader = { 'x-admin-secret': adminSecret }

  // ─── Ładowanie danych ───────────────────────────────────────────────────────

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/gallery', { headers: authHeader })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setItems(data.items ?? [])
      setHasChanges(false)
    } catch (e) {
      setError(`Błąd ładowania: ${e}`)
    } finally {
      setLoading(false)
    }
  }, [adminSecret])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  // ─── Drag-and-drop ──────────────────────────────────────────────────────────

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    // Lekkie opóźnienie żeby przeglądarka zdążyła zrobić ghost image
    setTimeout(() => {
      const el = e.currentTarget as HTMLElement
      el.style.opacity = '0.5'
    }, 0)
  }

  function handleDragEnd(e: React.DragEvent) {
    const el = e.currentTarget as HTMLElement
    el.style.opacity = '1'
    setDraggedIdx(null)
    setDragOverIdx(null)
    dragCounter.current = 0
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedIdx !== null && draggedIdx !== index) {
      setDragOverIdx(index)
    }
  }

  function handleDragLeave() {
    dragCounter.current--
    if (dragCounter.current <= 0) {
      setDragOverIdx(null)
    }
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current++
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === dropIndex) {
      setDraggedIdx(null)
      setDragOverIdx(null)
      return
    }

    const newItems = [...items]
    const [removed] = newItems.splice(draggedIdx, 1)
    newItems.splice(dropIndex, 0, removed)
    setItems(newItems)
    setHasChanges(true)
    setDraggedIdx(null)
    setDragOverIdx(null)
    dragCounter.current = 0
  }

  // ─── Zapisz kolejność ────────────────────────────────────────────────────────

  async function saveOrder() {
    setSaving(true)
    setSaveMsg(null)
    try {
      const slugs = items.map((i) => i.slug)
      const res = await fetch('/api/admin/gallery/order', {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setHasChanges(false)
      setSaveMsg('Kolejność zapisana! Strona zaktualizuje się po deployu (~1 min).')
    } catch (e) {
      setSaveMsg(`Błąd zapisu: ${e}`)
    } finally {
      setSaving(false)
    }
  }

  // ─── Usuwanie ────────────────────────────────────────────────────────────────

  async function deleteItem(slug: string) {
    if (!confirm('Usunąć to zdjęcie z galerii?')) return

    try {
      const res = await fetch(`/api/admin/gallery/${slug}`, {
        method: 'DELETE',
        headers: authHeader,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setItems((prev) => prev.filter((i) => i.slug !== slug))
      setSaveMsg('Zdjęcie usunięte.')
    } catch (e) {
      alert(`Błąd usuwania: ${e}`)
    }
  }

  // ─── Toggle featured ────────────────────────────────────────────────────────

  function toggleFeatured(slug: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, featured: !item.featured } : item
      )
    )
    setHasChanges(true)
  }

  // ─── Upload ─────────────────────────────────────────────────────────────────

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    const previews: UploadPreview[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      category: 'liternictwo',
      featured: false,
    }))
    setUploadPreviews((prev) => [...prev, ...previews])

    // Resetuj input żeby można było wybrać te same pliki ponownie
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function updatePreview(index: number, field: keyof UploadPreview, value: string | boolean) {
    setUploadPreviews((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    )
  }

  function removePreview(index: number) {
    setUploadPreviews((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function uploadAll() {
    if (uploadPreviews.length === 0) return
    setUploading(true)
    setUploadProgress(0)
    setUploadMsg(null)

    const total = uploadPreviews.length
    let done = 0
    const errors: string[] = []

    for (const preview of uploadPreviews) {
      const fd = new FormData()
      fd.append('files', preview.file)
      fd.append('alts', preview.alt)
      fd.append('categories', preview.category)
      fd.append('featured', String(preview.featured))

      try {
        const res = await fetch('/api/admin/gallery/upload', {
          method: 'POST',
          headers: authHeader,
          body: fd,
        })
        const data = await res.json()
        if (!res.ok || data.results?.[0]?.success === false) {
          errors.push(`${preview.file.name}: ${data.results?.[0]?.error ?? data.error ?? 'błąd'}`)
        }
      } catch (e) {
        errors.push(`${preview.file.name}: ${e}`)
      }

      done++
      setUploadProgress(Math.round((done / total) * 100))
    }

    // Wyczyść podglądy i odśwież listę
    uploadPreviews.forEach((p) => URL.revokeObjectURL(p.previewUrl))
    setUploadPreviews([])

    if (errors.length > 0) {
      setUploadMsg(`Błędy: ${errors.join(', ')}`)
    } else {
      setUploadMsg(`Wgrano ${total} zdjęcie(cia). Strona zaktualizuje się po deployu.`)
    }

    await loadItems()
    setUploading(false)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Nagłówek */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Galeria — edytor</h1>
          <p className="text-sm text-gray-500 mt-1">
            Przeciągaj zdjęcia żeby zmienić kolejność. Zmiany wchodzą po deployu (~1 min).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/keystatic"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← Keystatic
          </a>
          <button
            onClick={saveOrder}
            disabled={!hasChanges || saving}
            className="px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-stone-700 transition-colors"
          >
            {saving ? 'Zapisuję…' : 'Zapisz kolejność'}
          </button>
        </div>
      </div>

      {/* Komunikat */}
      {saveMsg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          saveMsg.startsWith('Błąd') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
        }`}>
          {saveMsg}
          <button onClick={() => setSaveMsg(null)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Lista zdjęć */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Ładowanie galerii z GitHub…</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          Brak zdjęć w galerii. Dodaj pierwsze poniżej.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.slug}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              className={`flex items-center gap-3 p-3 bg-white border rounded-xl transition-all cursor-grab active:cursor-grabbing ${
                dragOverIdx === idx
                  ? 'border-stone-400 bg-stone-50 scale-[1.01]'
                  : 'border-gray-200 hover:border-gray-300'
              } ${draggedIdx === idx ? 'shadow-lg' : 'shadow-sm'}`}
            >
              {/* Drag handle */}
              <div className="text-gray-300 hover:text-gray-500 select-none px-1 flex-shrink-0">
                <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor">
                  <circle cx="4" cy="4" r="2"/><circle cx="10" cy="4" r="2"/>
                  <circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/>
                  <circle cx="4" cy="16" r="2"/><circle cx="10" cy="16" r="2"/>
                </svg>
              </div>

              {/* Numer kolejności */}
              <span className="text-xs text-gray-400 w-5 text-right flex-shrink-0">{idx + 1}</span>

              {/* Miniaturka */}
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={githubRawUrl(item.image)}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">brak</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.alt || item.slug}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.inne}`}>
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </span>
                </div>
              </div>

              {/* Featured toggle */}
              <button
                onClick={() => toggleFeatured(item.slug)}
                title={item.featured ? 'Na stronie głównej — kliknij żeby ukryć' : 'Ukryte — kliknij żeby pokazać na stronie głównej'}
                className={`flex-shrink-0 text-xs px-2 py-1 rounded-full border transition-colors ${
                  item.featured
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                }`}
              >
                ★ Główna
              </button>

              {/* Usuń */}
              <button
                onClick={() => deleteItem(item.slug)}
                title="Usuń zdjęcie"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ─── Sekcja uploadu ─────────────────────────────────────────────────── */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Dodaj zdjęcia</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            + Wybierz pliki
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Podglądy wybranych plików */}
        {uploadPreviews.length > 0 && (
          <div className="space-y-3 mb-4">
            {uploadPreviews.map((preview, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                {/* Miniaturka */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.previewUrl} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Alt text */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs text-gray-500 mb-1">Opis (alt)</label>
                  <input
                    type="text"
                    value={preview.alt}
                    onChange={(e) => updatePreview(idx, 'alt', e.target.value)}
                    placeholder="np. Napis nagrobny na granicie"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
                  />
                </div>

                {/* Kategoria */}
                <div className="flex-shrink-0">
                  <label className="block text-xs text-gray-500 mb-1">Kategoria</label>
                  <select
                    value={preview.category}
                    onChange={(e) => updatePreview(idx, 'category', e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-stone-300"
                  >
                    <option value="liternictwo">Liternictwo</option>
                    <option value="renowacja">Renowacja</option>
                    <option value="montaz">Montaż tablic</option>
                    <option value="inne">Inne</option>
                  </select>
                </div>

                {/* Featured */}
                <div className="flex-shrink-0 text-center">
                  <label className="block text-xs text-gray-500 mb-1">Główna</label>
                  <input
                    type="checkbox"
                    checked={preview.featured}
                    onChange={(e) => updatePreview(idx, 'featured', e.target.checked)}
                    className="w-4 h-4 accent-stone-700"
                  />
                </div>

                {/* Usuń z listy */}
                <button
                  onClick={() => removePreview(idx)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4l8 8M12 4l-8 8"/>
                  </svg>
                </button>
              </div>
            ))}

            {/* Pasek postępu + przycisk wgrania */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={uploadAll}
                disabled={uploading}
                className="px-5 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 hover:bg-stone-700 transition-colors"
              >
                {uploading ? `Wgrywam… ${uploadProgress}%` : `Wgraj ${uploadPreviews.length} zdjęcie(cia)`}
              </button>
              <button
                onClick={() => {
                  uploadPreviews.forEach((p) => URL.revokeObjectURL(p.previewUrl))
                  setUploadPreviews([])
                }}
                disabled={uploading}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}

        {/* Komunikat uploadu */}
        {uploadMsg && (
          <div className={`mt-3 px-4 py-3 rounded-lg text-sm ${
            uploadMsg.startsWith('Błędy') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
          }`}>
            {uploadMsg}
            <button onClick={() => setUploadMsg(null)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Strefa drag-and-drop */}
        {uploadPreviews.length === 0 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const files = Array.from(e.dataTransfer.files).filter((f) =>
                f.type.startsWith('image/')
              )
              if (files.length === 0) return
              const previews: UploadPreview[] = files.map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
                alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
                category: 'liternictwo',
                featured: false,
              }))
              setUploadPreviews(previews)
            }}
            className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-stone-300 hover:bg-stone-50 transition-colors"
          >
            <div className="text-4xl mb-3">📸</div>
            <p className="text-gray-500 text-sm">
              Przeciągnij zdjęcia tutaj lub kliknij żeby wybrać
            </p>
            <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP — można wgrać kilka naraz</p>
          </div>
        )}
      </div>

      {/* Info o deployu */}
      <div className="mt-8 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
        <strong>Jak to działa:</strong> Zmiany (kolejność, nowe zdjęcia, usuwanie) zapisywane są do
        repozytorium GitHub. Vercel automatycznie przebudowuje stronę po każdej zmianie — zajmuje to
        ok. 1–2 minut.
      </div>
    </div>
  )
}
