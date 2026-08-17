'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedFile {
  id: string
  file: File
  preview: string
  name: string
  size: number
}

interface ImageUploadProps {
  value: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
  /** Napis w ramce upuszczania — edytowalny w CMS. */
  dropText?: string
  error?: string
  className?: string
}

const MAX_FILES    = 5
const MAX_SIZE_MB  = 10
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = MAX_FILES,
  maxSizeMB = MAX_SIZE_MB,
  dropText = 'Dodaj zdjęcia nagrobka',
  error,
  className,
}: ImageUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Podglądy to blob: URL — trzeba je zwolnić, inaczej wyciekają przy odmontowaniu.
  const filesRef = useRef<UploadedFile[]>([])
  filesRef.current = files
  useEffect(() => () => {
    filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview))
  }, [])

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    setLocalError(null)

    const arr = Array.from(newFiles)
    const remaining = maxFiles - files.length

    if (remaining <= 0) {
      setLocalError(`Możesz dodać maksymalnie ${maxFiles} zdjęć.`)
      return
    }

    const toAdd: UploadedFile[] = []

    for (const file of arr.slice(0, remaining)) {
      if (!ACCEPT_TYPES.includes(file.type)) {
        setLocalError('Dozwolone formaty: JPG, PNG, WebP, HEIC.')
        continue
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setLocalError(`Plik "${file.name}" jest za duży. Max ${maxSizeMB} MB.`)
        continue
      }
      toAdd.push({
        id:      `${file.name}-${file.lastModified}`,
        file,
        preview: URL.createObjectURL(file),
        name:    file.name,
        size:    file.size,
      })
    }

    const updated = [...files, ...toAdd]
    setFiles(updated)
    onChange(updated.map((f) => f.file))
  }, [files, maxFiles, maxSizeMB, onChange])

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id)
    // Revoke object URL
    const removed = files.find((f) => f.id === id)
    if (removed) URL.revokeObjectURL(removed.preview)
    setFiles(updated)
    onChange(updated.map((f) => f.file))
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    e.target.value = '' // reset input
  }

  const canAddMore = files.length < maxFiles

  return (
    <div className={cn('flex flex-col gap-3', className)}>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Dodaj zdjęcia — kliknij lub przeciągnij pliki"
        onClick={() => canAddMore && inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && canAddMore && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3',
          'border transition-all duration-200',
          'py-8 px-6 text-center',
          canAddMore ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
          dragOver
            ? 'border-gold bg-gold/5'
            : 'border-dashed border-stone-border hover:border-gold/60'
        )}
      >
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(196,184,122,0.12)' }}
        >
          <Upload
            size={18}
            strokeWidth={1.5}
            style={{ color: 'var(--color-gold-dark)' }}
          />
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--color-text)',
              marginBottom: '4px',
            }}
          >
            {dragOver ? 'Upuść pliki tutaj' : dropText}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'var(--color-text-3)',
            }}
          >
            JPG, PNG, WebP, HEIC · do {maxFiles} plików · max {maxSizeMB} MB łącznie
          </p>
          {files.length > 0 && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                color: 'var(--color-gold-dark)',
                marginTop: '4px',
                letterSpacing: '0.06em',
              }}
            >
              {files.length}/{maxFiles} zdjęć
            </p>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_TYPES.join(',')}
        multiple
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Podglądy */}
      {files.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="relative group"
              style={{ aspectRatio: '1' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.preview}
                alt={f.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay z rozmiarem */}
              <div className="absolute inset-0 bg-stone-dark/0 group-hover:bg-stone-dark/50 transition-colors duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-7 h-7 bg-white/90 flex items-center justify-center rounded-full"
                  aria-label={`Usuń zdjęcie ${f.name}`}
                >
                  <X size={12} strokeWidth={2} style={{ color: '#1E1E1E' }} />
                </button>
              </div>
              {/* Rozmiar pliku */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-stone-dark/60 px-1 py-0.5"
                style={{ fontSize: '8px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}
              >
                {formatSize(f.size)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Błędy */}
      {(localError || error) && (
        <p
          className="form-error"
          role="alert"
        >
          {localError || error}
        </p>
      )}
    </div>
  )
}
