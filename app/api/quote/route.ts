import { NextRequest, NextResponse } from 'next/server'
import { quoteFormSchema } from '@/lib/validations'
import { SITE } from '@/lib/constants'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Wyciągnij pola tekstowe
    const raw = {
      name:        formData.get('name')        as string,
      contact:     formData.get('contact')     as string,
      cemetery:    formData.get('cemetery')    as string,
      workType:    formData.get('workType')    as string,
      description: formData.get('description') as string,
    }

    // Walidacja Zod
    const parsed = quoteFormSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const photos = formData.getAll('photos') as File[]

    // ========================================================
    // Email via nodemailer — uzupełnij dane SMTP w .env.local:
    // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
    // ========================================================

    const emailBody = `
Nowe zapytanie o wycenę — StoneArt

Imię i nazwisko: ${data.name}
Kontakt:         ${data.contact}
Miasto/Cmentarz: ${data.cemetery}
Rodzaj pracy:    ${data.workType}

Opis:
${data.description}

Liczba załączonych zdjęć: ${photos.length}

---
Wysłano ze strony stoneart.tychy.pl
    `.trim()

    // Próba wysłania emaila — jeśli env jest skonfigurowane
    if (process.env.SMTP_HOST) {
      const nodemailer = await import('nodemailer')

      const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      // Przygotuj załączniki ze zdjęciami
      const attachments = await Promise.all(
        photos.map(async (photo) => ({
          filename: photo.name,
          content:  Buffer.from(await photo.arrayBuffer()),
          contentType: photo.type,
        }))
      )

      await transporter.sendMail({
        from:        process.env.SMTP_FROM || SITE.email,
        to:          SITE.email,
        replyTo:     data.contact.includes('@') ? data.contact : undefined,
        subject:     `Wycena: ${data.workType} — ${data.name}`,
        text:        emailBody,
        attachments,
      })
    } else {
      // Dev fallback — log do konsoli
      console.log('[QUOTE FORM] New request:', data)
      console.log('[QUOTE FORM] Photos:', photos.length)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[QUOTE FORM] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
