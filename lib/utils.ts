import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
}

// Numer z CMS bywa zapisany ze spacjami, myślnikami albo z prefiksem +48.
// Link `tel:` musi być znormalizowany, inaczej część telefonów go nie wybierze.
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('48')) return `tel:+${digits}`
  return `tel:+48${digits}`
}

export function mailHref(email: string): string {
  return `mailto:${email.trim()}`
}

// Podstawia {klucz} wartościami — pozwala klientowi wpleść dane firmy
// w dowolny tekst z CMS bez dotykania kodu.
export function fillTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  )
}

// Tekst z pola wieloliniowego → akapity. Pusta linia rozdziela akapity.
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
