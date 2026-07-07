'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { quoteFormSchema, type QuoteFormData } from '@/lib/validations'
import { WORK_TYPES } from '@/lib/constants'
import { ImageUpload } from './ImageUpload'

interface QuoteFormProps {
  className?: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function QuoteForm({ className }: QuoteFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  // Honeypot — pole-pułapka niewidoczne dla ludzi; boty je wypełniają.
  const honeypotRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
  })

  const onSubmit = async (data: QuoteFormData) => {
    setSubmitState('submitting')

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, val]) => formData.append(key, val))
      uploadedFiles.forEach((file) => formData.append('photos', file))
      formData.append('company', honeypotRef.current?.value ?? '')

      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Server error')

      setSubmitState('success')
      reset()
      setUploadedFiles([])
    } catch {
      setSubmitState('error')
    }
  }

  if (submitState === 'success') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4 py-16 text-center',
          className
        )}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(196,184,122,0.15)', border: '1px solid var(--color-gold)' }}
        >
          <Check size={22} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
        </div>
        <div>
          <h3 className="font-display text-[22px] text-ink mb-2" style={{ fontWeight: 400 }}>
            Zapytanie wysłane.
          </h3>
          <p className="text-[14px] text-ink-secondary max-w-[300px] leading-[1.75]">
            Skontaktujemy się w ciągu 24 godzin — telefonicznie lub e-mailem.
          </p>
        </div>
        <button
          onClick={() => setSubmitState('idle')}
          className="link-stone mt-2"
        >
          Wyślij kolejne zapytanie →
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-5', className)}
      noValidate
      aria-label="Formularz zapytania o wycenę"
    >
      {/* Honeypot — ukryty przed użytkownikami; jeśli wypełniony, serwer odrzuca zgłoszenie jako spam. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="quote-company">Nie wypełniaj tego pola</label>
        <input
          id="quote-company"
          type="text"
          name="company"
          ref={honeypotRef}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Imię i nazwisko */}
      <div>
        <label htmlFor="quote-name" className="form-label">
          Imię i nazwisko <span aria-hidden="true" style={{ color: 'var(--color-gold-dark)' }}>*</span>
        </label>
        <input
          id="quote-name"
          type="text"
          autoComplete="name"
          className={cn('form-field', errors.name && 'border-[#B85C5C]')}
          placeholder="Jan Kowalski"
          {...register('name')}
        />
        {errors.name && (
          <span className="form-error" role="alert">{errors.name.message}</span>
        )}
      </div>

      {/* Telefon / email */}
      <div>
        <label htmlFor="quote-contact" className="form-label">
          Telefon lub e-mail <span aria-hidden="true" style={{ color: 'var(--color-gold-dark)' }}>*</span>
        </label>
        <input
          id="quote-contact"
          type="text"
          autoComplete="tel email"
          className={cn('form-field', errors.contact && 'border-[#B85C5C]')}
          placeholder="734 000 000 lub jan@email.pl"
          {...register('contact')}
        />
        {errors.contact && (
          <span className="form-error" role="alert">{errors.contact.message}</span>
        )}
      </div>

      {/* Miasto / cmentarz */}
      <div>
        <label htmlFor="quote-cemetery" className="form-label">
          Miasto / cmentarz <span aria-hidden="true" style={{ color: 'var(--color-gold-dark)' }}>*</span>
        </label>
        <input
          id="quote-cemetery"
          type="text"
          className={cn('form-field', errors.cemetery && 'border-[#B85C5C]')}
          placeholder="np. Tychy, cmentarz przy ul. Edukacji"
          {...register('cemetery')}
        />
        {errors.cemetery && (
          <span className="form-error" role="alert">{errors.cemetery.message}</span>
        )}
      </div>

      {/* Typ pracy */}
      <div>
        <label htmlFor="quote-work-type" className="form-label">
          Rodzaj pracy <span aria-hidden="true" style={{ color: 'var(--color-gold-dark)' }}>*</span>
        </label>
        <select
          id="quote-work-type"
          className={cn('form-field', errors.workType && 'border-[#B85C5C]')}
          {...register('workType')}
          defaultValue=""
        >
          <option value="" disabled>Wybierz rodzaj pracy…</option>
          {WORK_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.workType && (
          <span className="form-error" role="alert">{errors.workType.message}</span>
        )}
      </div>

      {/* Opis */}
      <div>
        <label htmlFor="quote-description" className="form-label">
          Opis prac <span aria-hidden="true" style={{ color: 'var(--color-gold-dark)' }}>*</span>
        </label>
        <textarea
          id="quote-description"
          rows={5}
          className={cn('form-field resize-y min-h-[120px]', errors.description && 'border-[#B85C5C]')}
          placeholder="Opisz co wymaga zrobienia, jaki materiał, ewentualnie rozmiary…"
          {...register('description')}
        />
        {errors.description && (
          <span className="form-error" role="alert">{errors.description.message}</span>
        )}
      </div>

      {/* Upload zdjęć */}
      <div>
        <label className="form-label">
          Zdjęcia <span style={{ color: 'var(--color-text-3)', textTransform: 'none', letterSpacing: 0 }}>(opcjonalnie)</span>
        </label>
        <ImageUpload
          value={uploadedFiles}
          onChange={setUploadedFiles}
        />
      </div>

      {/* Błąd serwera */}
      {submitState === 'error' && (
        <div
          className="p-4 border"
          style={{ borderColor: '#B85C5C', background: 'rgba(184,92,92,0.05)' }}
          role="alert"
        >
          <p className="text-[13px]" style={{ color: '#B85C5C' }}>
            Nie udało się wysłać zapytania. Prosimy spróbować ponownie lub zadzwonić: 734 130 388.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitState === 'submitting'}
        className={cn(
          'btn-primary flex items-center justify-center gap-3 mt-1',
          submitState === 'submitting' && 'opacity-70 cursor-not-allowed'
        )}
      >
        {submitState === 'submitting' ? (
          <>
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            Wysyłanie…
          </>
        ) : (
          'Wyślij zapytanie'
        )}
      </button>

      <p className="text-[11px] text-ink-secondary leading-[1.7]">
        Odpiszemy lub oddzwonimy w ciągu 24 godzin. Wycena jest bezpłatna i bez zobowiązań.
      </p>
    </form>
  )
}
