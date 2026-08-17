import { z } from 'zod'

export const quoteFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Imię i nazwisko musi mieć co najmniej 2 znaki')
    .max(100, 'Imię i nazwisko jest za długie'),

  contact: z
    .string()
    .min(5, 'Podaj numer telefonu lub adres e-mail')
    .max(100, 'Kontakt jest za długi')
    .refine(
      (val) => /^\+?[\d\s\-()]{9,}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: 'Podaj poprawny numer telefonu lub adres e-mail' }
    ),

  cemetery: z
    .string()
    .min(2, 'Podaj nazwę miasta lub cmentarza')
    .max(200, 'Opis lokalizacji jest za długi'),

  workType: z
    .string()
    .min(1, 'Wybierz rodzaj pracy'),

  description: z
    .string()
    .min(10, 'Opis powinien mieć co najmniej 10 znaków')
    .max(2000, 'Opis jest za długi (max 2000 znaków)'),
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Podaj imię i nazwisko'),
  email: z.string().email('Podaj poprawny adres e-mail'),
  message: z.string().min(10, 'Wiadomość jest za krótka'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
