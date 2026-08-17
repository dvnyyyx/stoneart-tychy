'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2 } from 'lucide-react'
import { cn, fillTemplate } from '@/lib/utils'
import { quoteFormSchema, type QuoteFormData } from '@/lib/validations'
import type { QuoteFormContent } from '@/lib/defaults'
import { ImageUpload } from './ImageUpload'

interface QuoteFormProps {
  /** Teksty formularza z Keystatica — etykiety, podpowiedzi, komunikaty. */
  content: QuoteFormContent
  /** Telefon z danych firmy — używany w komunikacie o błędzie wysyłki. */
  phone: string
  className?: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function QuoteForm({ content, phone, className }: QuoteFormProps) {
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

      const res = await fetch('/api/quote', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Server error')

      setSubmitState('success')
      reset()
      setUploadedFiles([])
    } catch {
      setSubmitState('error')
    }
  }

  const required = <span aria-hidden="true" style={{ color: 'var(--color-gold-dark)' }}>*</span>

  if (submitState === 'success') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}
        role="status"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(196,184,122,0.15)', border: '1px solid var(--color-gold)' }}
        >
          <Check size={22} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display text-[22px] text-ink mb-2" style={{ fontWeight: 400 }}>
            {content.successTitle}
          </h3>
          <p className="text-[14px] text-ink-secondary max-w-[300px] leading-[1.75]">
            {content.successText}
          </p>
        </div>
        <button type="button" onClick={() => setSubmitState('idle')} className="link-stone mt-2">
          {content.successAgain}
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
        <input id="quote-company" type="text" name="company" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="quote-name" className="form-label">
          {content.nameLabel} {required}
        </label>
        <input
          id="quote-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          className={cn('form-field', errors.name && 'border-[#B85C5C]')}
          placeholder={content.namePlaceholder}
          {...register('name')}
        />
        {errors.name && <span className="form-error" role="alert">{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="quote-contact" className="form-label">
          {content.contactLabel} {required}
        </label>
        <input
          id="quote-contact"
          type="text"
          autoComplete="tel email"
          aria-invalid={errors.contact ? true : undefined}
          className={cn('form-field', errors.contact && 'border-[#B85C5C]')}
          placeholder={content.contactPlaceholder}
          {...register('contact')}
        />
        {errors.contact && <span className="form-error" role="alert">{errors.contact.message}</span>}
      </div>

      <div>
        <label htmlFor="quote-cemetery" className="form-label">
          {content.cemeteryLabel} {required}
        </label>
        <input
          id="quote-cemetery"
          type="text"
          aria-invalid={errors.cemetery ? true : undefined}
          className={cn('form-field', errors.cemetery && 'border-[#B85C5C]')}
          placeholder={content.cemeteryPlaceholder}
          {...register('cemetery')}
        />
        {errors.cemetery && <span className="form-error" role="alert">{errors.cemetery.message}</span>}
      </div>

      <div>
        <label htmlFor="quote-work-type" className="form-label">
          {content.workTypeLabel} {required}
        </label>
        <select
          id="quote-work-type"
          aria-invalid={errors.workType ? true : undefined}
          className={cn('form-field', errors.workType && 'border-[#B85C5C]')}
          defaultValue=""
          {...register('workType')}
        >
          <option value="" disabled>{content.workTypePlaceholder}</option>
          {content.workTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.workType && <span className="form-error" role="alert">{errors.workType.message}</span>}
      </div>

      <div>
        <label htmlFor="quote-description" className="form-label">
          {content.descriptionLabel} {required}
        </label>
        <textarea
          id="quote-description"
          rows={5}
          aria-invalid={errors.description ? true : undefined}
          className={cn('form-field resize-y min-h-[120px]', errors.description && 'border-[#B85C5C]')}
          placeholder={content.descriptionPlaceholder}
          {...register('description')}
        />
        {errors.description && <span className="form-error" role="alert">{errors.description.message}</span>}
      </div>

      <div>
        <span className="form-label">
          {content.photosLabel}{' '}
          <span style={{ color: 'var(--color-text-3)', textTransform: 'none', letterSpacing: 0 }}>
            {content.photosHint}
          </span>
        </span>
        <ImageUpload
          value={uploadedFiles}
          onChange={setUploadedFiles}
          dropText={content.photosDropText}
        />
      </div>

      {submitState === 'error' && (
        <div
          className="p-4 border"
          style={{ borderColor: '#B85C5C', background: 'rgba(184,92,92,0.05)' }}
          role="alert"
        >
          <p className="text-[13px]" style={{ color: '#B85C5C' }}>
            {fillTemplate(content.errorText, { telefon: phone })}
          </p>
        </div>
      )}

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
            {content.submittingLabel}
          </>
        ) : (
          content.submitLabel
        )}
      </button>

      <p className="text-[11px] text-ink-secondary leading-[1.7]">
        {content.footnote}
      </p>
    </form>
  )
}
