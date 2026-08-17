import { NextRequest, NextResponse } from 'next/server'
import { quoteFormSchema } from '@/lib/validations'
import { validatePhotos } from '@/lib/upload'
import { getSiteSettings } from '@/lib/content'

// Trasa musi działać w środowisku Node (nodemailer nie działa na edge).
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Honeypot: pole "company" jest ukryte w formularzu — wypełnia je tylko bot.
    // Zwracamy sukces bez wysyłki, żeby nie ujawniać mechanizmu.
    const honeypot = formData.get('company')
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    const raw = {
      name:        formData.get('name'),
      contact:     formData.get('contact'),
      cemetery:    formData.get('cemetery'),
      workType:    formData.get('workType'),
      description: formData.get('description'),
    }

    const parsed = quoteFormSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const photos = formData.getAll('photos').filter((v): v is File => v instanceof File)

    // Walidacja załączników po stronie serwera (magic bytes + limity).
    // Kontrole klienta da się ominąć wysyłając POST bezpośrednio tutaj.
    const photoCheck = await validatePhotos(photos)
    if (!photoCheck.ok) {
      return NextResponse.json({ error: photoCheck.error }, { status: 400 })
    }

    // Adres odbiorcy: SMTP_TO (już używane w konfiguracji hostingu) ma
    // pierwszeństwo, w przeciwnym razie e-mail z CMS. Dzięki temu zmiana adresu
    // kontaktowego w panelu przekierowuje też zapytania z formularza.
    const site = await getSiteSettings()
    const recipient = process.env.SMTP_TO || site.email

    const attachedCount = photos.filter((p) => p.size > 0).length
    const emailBody = [
      `Nowe zapytanie o wycenę — ${site.companyName}`,
      '',
      `Imię i nazwisko: ${data.name}`,
      `Kontakt:         ${data.contact}`,
      `Miasto/Cmentarz: ${data.cemetery}`,
      `Rodzaj pracy:    ${data.workType}`,
      '',
      'Opis:',
      data.description,
      '',
      `Liczba załączonych zdjęć: ${attachedCount}`,
      '',
      '---',
      'Wysłano z formularza na stronie stoneart-tychy.pl',
    ].join('\n')

    if (process.env.SMTP_HOST) {
      const nodemailer = await import('nodemailer')

      const port = Number.parseInt(process.env.SMTP_PORT || '587', 10)
      // SMTP_SECURE pozwala wymusić TLS na niestandardowym porcie; domyślnie
      // decyduje port (465 = implicit TLS).
      const secure = process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === 'true'
        : port === 465
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const attachments = await Promise.all(
        photos
          .filter((p) => p.size > 0)
          .map(async (photo) => ({
            filename: photo.name,
            content: Buffer.from(await photo.arrayBuffer()),
            contentType: photo.type || 'application/octet-stream',
          }))
      )

      await transporter.sendMail({
        from: process.env.SMTP_FROM || recipient,
        to: recipient,
        replyTo: data.contact.includes('@') ? data.contact : undefined,
        subject: `Wycena: ${data.workType} — ${data.name}`,
        text: emailBody,
        attachments,
      })
    } else {
      // Brak SMTP — w dev logujemy, na produkcji to błąd konfiguracji, o którym
      // trzeba wiedzieć, a nie cicha "udana" wysyłka donikąd.
      if (process.env.NODE_ENV === 'production') {
        console.error('[QUOTE FORM] Brak SMTP_HOST — zapytanie NIE zostało wysłane:', data)
        return NextResponse.json(
          { error: 'Wysyłka e-mail nie jest skonfigurowana.' },
          { status: 500 }
        )
      }
      console.log('[QUOTE FORM] Nowe zapytanie (dev, bez SMTP):', data)
      console.log('[QUOTE FORM] Zdjęcia:', attachedCount)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[QUOTE FORM] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
