// ─────────────────────────────────────────────────────────────
//  KONFIGURACJA ZDJĘĆ
//  Zdjęcia leżą w /public/images/prace/
//  DNG i MOV pomijamy — przeglądarka ich nie obsłuży.
//  Jeśli masz nowe zdjęcia, dorzuć je do tablicy PHOTOS.
// ─────────────────────────────────────────────────────────────

export interface Photo {
  file: string
  alt:  string
  category?: string
}

export const PHOTOS: Photo[] = [
  { file: 'IMG_0413.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_0593.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_0594.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_0596.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_0658.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3238.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3239.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3240.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3241.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3242.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3361.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3363.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3364.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
  { file: 'IMG_3365.jpeg', alt: 'Prace kamieniarsko-liternicze StoneArt — Tychy' },
]

// Zdjęcie tła hero
export const HERO_PHOTO = 'granit-impala.png'

// Zdjęcie do sekcji edytorialnych
export const EDITORIAL_PHOTO = PHOTOS[1]?.file ?? ''

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

export const PRACE_DIR = '/images/prace'

export function photoSrc(file: string) {
  return `${PRACE_DIR}/${file}`
}

export function homepagePhotos(n = 6): Photo[] {
  return PHOTOS.slice(0, n)
}
