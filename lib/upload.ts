// Walidacja przesyłanych zdjęć PO STRONIE SERWERA.
// Klient (components/ui/ImageUpload.tsx) sprawdza typ/rozmiar/liczbę, ale te kontrole
// da się ominąć wysyłając POST bezpośrednio na /api/quote — dlatego serwer musi
// walidować niezależnie: liczbę plików, rozmiar oraz PRAWDZIWY typ (magic bytes),
// a nie deklarowany MIME/rozszerzenie.

export const MAX_FILES = 5
export const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB / plik
export const MAX_TOTAL_BYTES = 25 * 1024 * 1024 // 25 MB łącznie

// Rozpoznanie formatu po sygnaturze (magic bytes) pierwszych bajtów pliku.
// Zwraca true tylko dla realnych obrazów JPEG/PNG/WebP/HEIC/HEIF.
function sniffImageType(bytes: Uint8Array): boolean {
  // JPEG: FF D8 FF
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return true
  }
  // WebP: "RIFF" .... "WEBP"
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return true
  }
  // HEIC/HEIF: bajty 4–7 = "ftyp", marka pod offsetem 8 z listy znanych brandów.
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70
  ) {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
    const heifBrands = ['heic', 'heix', 'heim', 'heis', 'hevc', 'hevx', 'mif1', 'msf1']
    if (heifBrands.includes(brand)) return true
  }
  return false
}

export interface UploadValidationResult {
  ok: boolean
  error?: string
}

// Sprawdza kolekcję plików z formularza. Puste wejście jest dozwolone
// (zdjęcia są opcjonalne). Zwraca pierwszy napotkany błąd.
export async function validatePhotos(photos: File[]): Promise<UploadValidationResult> {
  // Odfiltruj puste wpisy (np. pole file bez wyboru zwraca pusty File).
  const files = photos.filter((f) => f && f.size > 0)

  if (files.length === 0) return { ok: true }

  if (files.length > MAX_FILES) {
    return { ok: false, error: `Maksymalnie ${MAX_FILES} zdjęć.` }
  }

  let total = 0
  for (const file of files) {
    if (file.size > MAX_SIZE_BYTES) {
      return { ok: false, error: `Plik "${file.name}" przekracza ${MAX_SIZE_BYTES / 1024 / 1024} MB.` }
    }
    total += file.size
    if (total > MAX_TOTAL_BYTES) {
      return { ok: false, error: `Łączny rozmiar zdjęć przekracza ${MAX_TOTAL_BYTES / 1024 / 1024} MB.` }
    }

    // Sprawdź realny typ po pierwszych 16 bajtach (nie ufaj file.type/rozszerzeniu).
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())
    if (!sniffImageType(header)) {
      return { ok: false, error: `Plik "${file.name}" nie jest obrazem (JPG, PNG, WebP, HEIC).` }
    }
  }

  return { ok: true }
}
