// StoneArt — dane firmy
export const SITE = {
  name:        'StoneArt',
  fullName:    'StoneArt Usługi Kamieniarsko-Liternicze',
  owner:       'Adam Wytrykus',
  phone:       '734 130 388',
  phoneHref:   'tel:+48734130388',
  email:       'kontakt.stoneart@gmail.com',
  address:     'Różana 41, Tychy',
  city:        'Tychy',
  region:      'Śląskie',
  postcode:    '43-100',
  country:     'PL',
  url:         'https://www.stoneart-tychy.pl',
  description: 'Liternictwo nagrobne i renowacja nagrobków w Tychach. Dopiski liter i dat, piaskowanie napisów, odnawianie tablic granitowych. Klienci i zakłady kamieniarskie.',
  hours:       'Pon.–Pt. 9:00–17:00',
} as const

export const NAV_LINKS = [
  { label: 'Usługi',     href: '/uslugi' },
  { label: 'Realizacje', href: '/realizacje' },
  { label: 'O nas',      href: '/o-nas' },
  { label: 'Opinie',     href: '/opinie' },
  { label: 'Kontakt',    href: '/kontakt' },
] as const

export const SERVICES = [
  {
    slug:        'liternictwo',
    title:       'Dopiski i liternictwo',
    shortTitle:  'Dopiski',
    category:    'Główna specjalizacja',
    description: 'Wykonujemy nowe napisy, dopiski liter i dat oraz odświeżamy istniejące inskrypcje. Pracujemy na różnych rodzajach kamienia naturalnego, dbając o odpowiedni dobór techniki oraz zachowanie czytelności i stylu napisów.',
    features: [
      'Dopiski liter i dat metodą piaskowania',
      'Nowe napisy na istniejących nagrobkach',
      'Odświeżanie i poprawa widoczności liter',
      'Zachowanie stylu i układu oryginalnych napisów',
      'Złocenie i malowanie liter',
    ],
    featured: true,
  },
  {
    slug:        'renowacja-nagrobkow',
    title:       'Renowacja nagrobków',
    shortTitle:  'Renowacja',
    category:    'Renowacja',
    description: 'Odnawiamy nagrobki i tablice granitowe — czyścimy kamień, odtwarzamy napisy i przygotowujemy nagrobki do nowych inskrypcji. Każde zlecenie realizujemy indywidualnie, z dbałością o estetykę i trwałość.',
    features: [
      'Czyszczenie i impregnacja kamienia naturalnego',
      'Odtwarzanie i odświeżanie istniejących napisów',
      'Naprawa pęknięć i ubytków',
      'Przygotowanie nagrobka do nowych inskrypcji',
      'Wymiana uszkodzonych elementów',
    ],
    featured: false,
  },
  {
    slug:        'montaz-tablic',
    title:       'Montaż i demontaż tablic',
    shortTitle:  'Montaż',
    category:    'Usługi dodatkowe',
    description: 'Montaż i demontaż tablic nagrobnych, wymiana uszkodzonych elementów oraz przygotowanie nagrobka do kolejnych prac. Wykonujemy usługi zarówno dla klientów indywidualnych, jak i zakładów kamieniarskich.',
    features: [
      'Montaż nowych tablic nagrobnych',
      'Demontaż i wymiana uszkodzonych tablic',
      'Przygotowanie nagrobka do nowych inskrypcji',
      'Obramowania grobów',
      'Ławki i elementy ozdobne',
    ],
    featured: false,
  },
] as const

export const TESTIMONIALS = [
  {
    id: 1,
    quote: 'Nagrobek mojego ojca wygląda jak nowy. Napisy zostały odtworzone dokładnie tak jak chciałam. Kontakt szybki, wycena rzetelna.',
    author: 'Anna K.',
    location: 'Tychy',
  },
  {
    id: 2,
    quote: 'Pan Adam podszedł do zlecenia z troską i profesjonalizmem. Renowacja nagrobka dziadków — efekt przeszedł moje oczekiwania.',
    author: 'Marek W.',
    location: 'Katowice',
  },
  {
    id: 3,
    quote: 'Cenię szczególnie podejście — bez presji, bez sprzedawania na siłę. Prosta rozmowa, uczciwa cena, dobra robota.',
    author: 'Ewa M.',
    location: 'Bieruń',
  },
  {
    id: 4,
    quote: 'Dopiski na pomniku rodziców wykonane starannie, widać różnicę w jakości. Polecam każdemu, kto szuka kogoś solidnego.',
    author: 'Józef S.',
    location: 'Mysłowice',
  },
] as const

export const WORK_TYPES = [
  'Dopiski liter i dat',
  'Odtworzenie / odświeżenie napisów',
  'Złocenie napisów',
  'Piaskowanie napisów',
  'Nowy nagrobek granitowy',
  'Nowy nagrobek granitowy dwuczęściowy',
  'Czyszczenie i impregnacja',
  'Montaż / demontaż tablicy',
  'Obramowanie grobu',
  'Inne prace kamieniarskie',
] as const
