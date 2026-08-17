// ─────────────────────────────────────────────────────────────────────────────
//  Wartości domyślne treści — jedyna siatka bezpieczeństwa, gdy reader Keystatica
//  nie zdoła odczytać pliku (brak pliku po świeżym klonie, uszkodzony JSON,
//  literówka w polu). Strony NIE powtarzają już fallbacków u siebie: pobierają
//  gotowy, kompletny obiekt z lib/content.ts.
//
//  Te wartości są lustrem plików w content/settings/*.json. Edycje klienta idą
//  do JSON-ów przez CMS — tutaj nic nie trzeba zmieniać.
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteSettings {
  companyName: string
  companyFullName: string
  owner: string
  phone: string
  email: string
  address: string
  street: string
  postcode: string
  city: string
  region: string
  hours: string
  opensAt: string
  closesAt: string
  serviceArea: string
  latitude: string
  longitude: string
  googleMapsUrl: string | null
  facebookUrl: string | null
  googleProfileUrl: string | null
  description: string
}

export const SITE_DEFAULTS: SiteSettings = {
  companyName: 'StoneArt',
  companyFullName: 'StoneArt Usługi Kamieniarsko-Liternicze',
  owner: 'Adam Wytrykus',
  phone: '734 130 388',
  email: 'kontakt.stoneart@gmail.com',
  address: 'Różana 41, Tychy',
  street: 'Różana 41',
  postcode: '43-100',
  city: 'Tychy',
  region: 'Śląskie',
  hours: 'Pon.–Pt. 9:00–17:00',
  opensAt: '09:00',
  closesAt: '17:00',
  serviceArea: 'Tychy, Katowice, Mysłowice, Bieruń, Lędziny, Oświęcim i okolice',
  latitude: '50.1276',
  longitude: '18.9765',
  googleMapsUrl: null,
  facebookUrl: 'https://www.facebook.com/profile.php?id=61578436661238',
  googleProfileUrl: 'https://share.google/aAioXdh7wENSno8WP',
  description:
    'Liternictwo nagrobne i renowacja nagrobków w Tychach. Dopiski liter i dat, piaskowanie napisów, odnawianie tablic granitowych. Klienci i zakłady kamieniarskie.',
}

export interface NavigationContent {
  links: readonly { label: string; href: string }[]
  ctaLabel: string
  ctaHref: string
  tagline: string
}

export const NAVIGATION_DEFAULTS: NavigationContent = {
  links: [
    { label: 'Usługi', href: '/uslugi' },
    { label: 'Realizacje', href: '/realizacje' },
    { label: 'O nas', href: '/o-nas' },
    { label: 'Opinie', href: '/opinie' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  ctaLabel: 'Zapytaj o wycenę',
  ctaHref: '/wycena',
  tagline: 'Usługi Kamieniarsko-Liternicze',
}

export interface FooterContent {
  about: string
  servicesHeading: string
  companyHeading: string
  companyLinks: readonly { label: string; href: string }[]
  ctaHeading: string
  ctaText: string
  ctaButton: string
  ctaHref: string
  privacyLabel: string
}

export const FOOTER_DEFAULTS: FooterContent = {
  about: 'Liternictwo nagrobne, dopiski i renowacja nagrobków — Tychy i okolice.',
  servicesHeading: 'Usługi',
  companyHeading: 'Firma',
  companyLinks: [
    { label: 'O pracowni', href: '/o-nas' },
    { label: 'Realizacje', href: '/realizacje' },
    { label: 'Opinie', href: '/opinie' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  ctaHeading: 'Wycena',
  ctaText: 'Bezpłatna wycena. Odpiszemy lub oddzwonimy w ciągu 24 godzin.',
  ctaButton: 'Zapytaj o wycenę',
  ctaHref: '/wycena',
  privacyLabel: 'Polityka Prywatności',
}

export interface HeroContent {
  label: string
  titleLine1: string
  titleLine2: string
  titleLine3: string
  description: string
  ctaPrimary: string
  ctaPrimaryHref: string
  heroImage: string | null
  heroImageAlt: string
  scrollLabel: string
}

export const HERO_DEFAULTS: HeroContent = {
  label: 'Pracownia rzemieślnicza — Tychy, Śląskie',
  titleLine1: 'Usługi',
  titleLine2: 'kamieniarsko-',
  titleLine3: 'liternicze.',
  description:
    'Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów oraz renowacji nagrobków i tablic granitowych. Tychy i okolice — do wyceny wystarczą zdjęcia.',
  ctaPrimary: 'Zapytaj o wycenę',
  ctaPrimaryHref: '/wycena',
  heroImage: '/images/prace/hero-pracownia-stoneart.jpg',
  heroImageAlt: 'Pracownia StoneArt — detal kamienia',
  scrollLabel: 'Scroll',
}

export interface HomepageContent {
  aboutLabel: string
  aboutTitle: string
  aboutText1: string
  aboutText2: string
  aboutLinkLabel: string
  aboutLinkHref: string
  editorialImage1: string | null
  servicesLabel: string
  servicesTitle: string
  servicesLinkLabel: string
  servicesCtaText: string
  servicesCtaLink: string
  servicesCtaHref: string
  serviceCardCta: string
  galleryLabel: string
  galleryTitle: string
  galleryLinkLabel: string
  galleryNote: string
  galleryLimit: number
  qualityLabel: string
  qualityTitle: string
  qualityText1: string
  qualityText2: string
  qualityLinkLabel: string
  qualityLinkHref: string
  editorialImage2: string | null
  testimonialsLabel: string
  testimonialsTitle: string
  testimonialsLinkLabel: string
  metaTitle: string
  metaDescription: string
}

export const HOMEPAGE_DEFAULTS: HomepageContent = {
  aboutLabel: 'O pracowni',
  aboutTitle: 'Precyzja i dbałość o szczegóły.',
  aboutText1:
    'Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów oraz renowacji nagrobków i tablic granitowych. Działamy na terenie Tychów i okolicznych miejscowości, wykonując usługi zarówno dla klientów indywidualnych, jak i zakładów kamieniarskich.',
  aboutText2:
    'Rozumiemy, że nagrobek jest miejscem pamięci bliskich osób. Do każdego zlecenia podchodzimy z należytą starannością i szacunkiem.',
  aboutLinkLabel: 'O pracowni',
  aboutLinkHref: '/o-nas',
  editorialImage1: '/images/prace/pracownia-stoneart-detal.jpg',
  servicesLabel: 'Usługi',
  servicesTitle: 'Zakres prac.',
  servicesLinkLabel: 'Wszystkie usługi →',
  servicesCtaText: 'Nie znalazłeś tego, czego szukasz?',
  servicesCtaLink: 'Napisz do nas, wycenimy każdą pracę →',
  servicesCtaHref: '/kontakt',
  serviceCardCta: 'Zapytaj o wycenę →',
  galleryLabel: 'Realizacje',
  galleryTitle: 'Wybrane prace.',
  galleryLinkLabel: 'Wszystkie realizacje →',
  galleryNote: 'Pracujemy na cmentarzach w Tychach i całym regionie śląskim.',
  galleryLimit: 6,
  qualityLabel: 'Jak pracujemy',
  qualityTitle: 'Solidnie, estetycznie, trwale.',
  qualityText1:
    'Każde zlecenie realizujemy indywidualnie, zwracając uwagę na estetykę, trwałość i dokładność wykonania. Pracujemy na różnych rodzajach kamienia naturalnego, dobierając odpowiednią technikę do każdego przypadku.',
  qualityText2:
    'W wielu przypadkach do wstępnej wyceny wystarczą zdjęcia przesłane telefonicznie. Napisz lub zadzwoń — bezpośredni kontakt na każdym etapie zlecenia, wycena bezpłatna.',
  qualityLinkLabel: 'Zapytaj o wycenę',
  qualityLinkHref: '/wycena',
  editorialImage2: '/images/prace/jakosc-i-precyzja-wykonania.jpg',
  testimonialsLabel: 'Opinie klientów',
  testimonialsTitle: 'Co mówią nasi klienci.',
  testimonialsLinkLabel: 'Wszystkie opinie →',
  metaTitle: 'StoneArt Tychy — Liternictwo nagrobne i renowacja nagrobków',
  metaDescription:
    'Liternictwo nagrobne i renowacja nagrobków w Tychach. Dopiski liter i dat, piaskowanie napisów, odnawianie tablic granitowych. Bezpłatna wycena.',
}

export interface ONasContent {
  pageLabel: string
  pageTitle: string
  pageLead: string
  s1Label: string
  s1Title: string
  s1Text1: string
  s1Text2: string
  s1Image: string | null
  s2Label: string
  s2Title: string
  s2Text1: string
  s2Text2: string
  s2Image: string | null
  s3Label: string
  s3Title: string
  s3Text1: string
  s3Text2: string
  s3Image: string | null
  s3LinkLabel: string
  s3LinkHref: string
  metaTitle: string
  metaDescription: string
}

export const O_NAS_DEFAULTS: ONasContent = {
  pageLabel: 'O pracowni',
  pageTitle: 'StoneArt — Tychy.',
  pageLead:
    'Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów oraz renowacji nagrobków i tablic granitowych. Działamy na terenie Tychów i okolicznych miejscowości.',
  s1Label: 'Czym się zajmujemy',
  s1Title: 'Liternictwo, dopiski i renowacja nagrobków.',
  s1Text1:
    'Zajmujemy się wykonywaniem nowych napisów, dopisków liter i dat, odświeżaniem istniejących inskrypcji oraz pracami związanymi z odnawianiem nagrobków.',
  s1Text2: 'Wykonujemy usługi zarówno dla klientów indywidualnych, jak i zakładów kamieniarskich.',
  s1Image: null,
  s2Label: 'Podejście do pracy',
  s2Title: 'Szacunek do każdego zlecenia.',
  s2Text1:
    'Rozumiemy, że nagrobek jest miejscem pamięci bliskich osób, dlatego do każdego zlecenia podchodzimy z należytą starannością i szacunkiem.',
  s2Text2:
    'Stawiamy na uczciwe podejście, terminowość oraz bezpośredni kontakt z klientem na każdym etapie realizacji zlecenia.',
  s2Image: null,
  s3Label: 'Wycena',
  s3Title: 'Zdjęcia wystarczą.',
  s3Text1:
    'W wielu przypadkach do wstępnej wyceny wystarczą zdjęcia przesłane telefonicznie, co pozwala szybko określić zakres prac oraz termin realizacji.',
  s3Text2: 'Napisz lub zadzwoń — bezpośredni kontakt na każdym etapie, wycena bezpłatna.',
  s3Image: null,
  s3LinkLabel: 'Zapytaj o wycenę',
  s3LinkHref: '/wycena',
  metaTitle: 'O pracowni — Adam Wytrykus',
  metaDescription:
    'Liternictwo nagrobne, piaskowanie napisów i renowacja nagrobków — StoneArt Tychy. Klienci indywidualni i zakłady kamieniarskie.',
}

export interface UslugiPageContent {
  pageLabel: string
  pageTitle: string
  pageLead: string
  featuredBadge: string
  moreLabel: string
  ctaText: string
  ctaButton: string
  ctaHref: string
  detailScopeLabel: string
  detailRelatedLabel: string
  detailCtaButton: string
  metaTitle: string
  metaDescription: string
}

export const USLUGI_PAGE_DEFAULTS: UslugiPageContent = {
  pageLabel: 'Usługi',
  pageTitle: 'Zakres prac.',
  pageLead:
    'Wykonujemy nowe napisy, dopiski liter i dat oraz odnawiamy nagrobki i tablice granitowe. Klienci indywidualni i zakłady kamieniarskie — Tychy i okolice.',
  featuredBadge: 'Specjalizacja',
  moreLabel: 'Więcej →',
  ctaText: 'Nie znalazłeś tego, czego szukasz?',
  ctaButton: 'Napisz do nas →',
  ctaHref: '/kontakt',
  detailScopeLabel: 'Zakres prac',
  detailRelatedLabel: 'Inne usługi',
  detailCtaButton: 'Zapytaj o wycenę',
  metaTitle: 'Usługi kamieniarsko-liternicze',
  metaDescription:
    'Liternictwo nagrobne, dopiski liter i dat, piaskowanie napisów, renowacja nagrobków i montaż tablic. Klienci i zakłady kamieniarskie — Tychy i okolice.',
}

export interface RealizacjePageContent {
  pageLabel: string
  pageTitle: string
  pageLead: string
  galleryLabel: string
  allFilterLabel: string
  emptyTitle: string
  emptyText: string
  ctaButton: string
  metaTitle: string
  metaDescription: string
}

export const REALIZACJE_PAGE_DEFAULTS: RealizacjePageContent = {
  pageLabel: 'Realizacje',
  pageTitle: 'Wybrane prace.',
  pageLead: 'Dokumentacja naszych zleceń — dopiski, renowacje, prace kamieniarskie.',
  galleryLabel: 'Galeria prac',
  allFilterLabel: 'Wszystkie',
  emptyTitle: 'Galeria w przygotowaniu.',
  emptyText:
    'Zdjęcia realizacji będą dostępne wkrótce. Zapraszamy do kontaktu — chętnie opowiemy o zakresie naszych prac.',
  ctaButton: 'Zadzwoń po bezpłatną wycenę →',
  metaTitle: 'Realizacje — liternictwo i renowacja',
  metaDescription:
    'Galeria prac StoneArt — liternictwo nagrobne, renowacja nagrobków i piaskowanie napisów w Tychach i na Śląsku.',
}

export interface OpiniePageContent {
  pageLabel: string
  pageTitle: string
  pageLead: string
  reviewCtaText: string
  reviewCtaButton: string
  reviewCtaUrl: string | null
  bottomText: string
  bottomButton: string
  bottomHref: string
  metaTitle: string
  metaDescription: string
}

export const OPINIE_PAGE_DEFAULTS: OpiniePageContent = {
  pageLabel: 'Opinie klientów',
  pageTitle: 'Co mówią nasi klienci.',
  pageLead: 'Każda opinia pochodzi od prawdziwego klienta. Pracujemy z polecenia i na zaufaniu.',
  reviewCtaText: 'Masz doświadczenie z naszą pracownią?',
  reviewCtaButton: 'Napisz opinię →',
  reviewCtaUrl: 'https://g.page/r/CV0zVsr-ocNpEBM/review',
  bottomText: 'Chcesz dołączyć do naszych klientów?',
  bottomButton: 'Zapytaj o wycenę →',
  bottomHref: '/wycena',
  metaTitle: 'Opinie klientów',
  metaDescription:
    'Opinie klientów StoneArt — renowacja nagrobków i prace kamieniarskie w Tychach i na Śląsku.',
}

export interface KontaktPageContent {
  pageLabel: string
  pageTitle: string
  pageLead: string
  phoneLabel: string
  phoneNote: string
  phoneCta: string
  emailLabel: string
  emailNote: string
  emailCta: string
  addressLabel: string
  addressCta: string
  bottomText: string
  bottomButton: string
  bottomHref: string
  metaTitle: string
  metaDescription: string
}

export const KONTAKT_PAGE_DEFAULTS: KontaktPageContent = {
  pageLabel: 'Kontakt',
  pageTitle: 'Skontaktuj się z nami.',
  pageLead:
    'Pracujemy od poniedziałku do piątku, {godziny}. Odpiszemy lub oddzwonimy najszybciej jak to możliwe.',
  phoneLabel: 'Telefon',
  phoneNote: '',
  phoneCta: 'Zadzwoń teraz',
  emailLabel: 'E-mail',
  emailNote: 'Odpiszemy w ciągu 24 godzin',
  emailCta: 'Napisz wiadomość',
  addressLabel: 'Adres',
  addressCta: 'Pokaż na mapie',
  bottomText: 'Wolisz wypełnić formularz?',
  bottomButton: 'Zapytaj o wycenę →',
  bottomHref: '/wycena',
  metaTitle: 'Kontakt — pracownia w Tychach',
  metaDescription:
    'Skontaktuj się z pracownią StoneArt w Tychach. Liternictwo nagrobne, dopiski i renowacja nagrobków. Bezpłatna wycena.',
}

export interface WycenaPageContent {
  pageLabel: string
  pageTitle: string
  pageLead: string
  contactTitle: string
  phoneLabel: string
  emailLabel: string
  emailNote: string
  addressLabel: string
  formTitle: string
  metaTitle: string
  metaDescription: string
}

export const WYCENA_PAGE_DEFAULTS: WycenaPageContent = {
  pageLabel: 'Wycena',
  pageTitle: 'Zapytaj o wycenę.',
  pageLead:
    'Opisz zakres prac i podaj lokalizację. Wycena jest bezpłatna i bez zobowiązań — odpiszemy lub oddzwonimy w ciągu 24 godzin.',
  contactTitle: 'Kontakt bezpośredni',
  phoneLabel: 'Telefon',
  emailLabel: 'E-mail',
  emailNote: 'Odpiszemy do 24h',
  addressLabel: 'Adres',
  formTitle: 'Formularz wyceny',
  metaTitle: 'Wycena — bezpłatne zapytanie',
  metaDescription:
    'Zapytaj o bezpłatną wycenę renowacji nagrobka, liternictwa lub innych prac kamieniarskich. Odpiszemy w ciągu 24 godzin.',
}

export interface PrivacySection {
  heading: string
  body: string
  bullets: readonly string[]
}

export interface PrivacyPageContent {
  pageLabel: string
  pageTitle: string
  pageLead: string
  sections: readonly PrivacySection[]
  updatedAt: string
  metaTitle: string
  metaDescription: string
}

export const PRIVACY_PAGE_DEFAULTS: PrivacyPageContent = {
  pageLabel: 'Informacje prawne',
  pageTitle: 'Polityka Prywatności.',
  pageLead: 'Dowiedz się, jakie dane zbieramy, w jakim celu i jakie przysługują Ci prawa.',
  sections: [],
  updatedAt: '',
  metaTitle: 'Polityka Prywatności',
  metaDescription:
    'Informacje o przetwarzaniu danych osobowych przez StoneArt Adam Wytrykus zgodnie z RODO.',
}

export interface QuoteFormContent {
  sectionLabel: string
  sectionTitle: string
  sectionText: string
  emailNote: string
  workTypes: readonly string[]
  nameLabel: string
  namePlaceholder: string
  contactLabel: string
  contactPlaceholder: string
  cemeteryLabel: string
  cemeteryPlaceholder: string
  workTypeLabel: string
  workTypePlaceholder: string
  descriptionLabel: string
  descriptionPlaceholder: string
  photosLabel: string
  photosHint: string
  photosDropText: string
  submitLabel: string
  submittingLabel: string
  footnote: string
  successTitle: string
  successText: string
  successAgain: string
  errorText: string
}

export const QUOTE_FORM_DEFAULTS: QuoteFormContent = {
  sectionLabel: 'Wycena',
  sectionTitle: 'Napisz do nas.\nWycena jest\nbezpłatna.',
  sectionText:
    'Opisz zakres prac — liternictwo i dopiski, piaskowanie napisów, renowacja nagrobków — i podaj lokalizację cmentarza. Możesz dołączyć zdjęcia, wycenimy szybko i bez zobowiązań.',
  emailNote: 'Odpiszemy w ciągu 24h',
  workTypes: [
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
  ],
  nameLabel: 'Imię i nazwisko',
  namePlaceholder: 'Jan Kowalski',
  contactLabel: 'Telefon lub e-mail',
  contactPlaceholder: '734 000 000 lub jan@email.pl',
  cemeteryLabel: 'Miasto / cmentarz',
  cemeteryPlaceholder: 'np. Tychy, cmentarz przy ul. Edukacji',
  workTypeLabel: 'Rodzaj pracy',
  workTypePlaceholder: 'Wybierz rodzaj pracy…',
  descriptionLabel: 'Opis prac',
  descriptionPlaceholder: 'Opisz co wymaga zrobienia, jaki materiał, ewentualnie rozmiary…',
  photosLabel: 'Zdjęcia',
  photosHint: '(opcjonalnie)',
  photosDropText: 'Dodaj zdjęcia nagrobka',
  submitLabel: 'Wyślij zapytanie',
  submittingLabel: 'Wysyłanie…',
  footnote: 'Odpiszemy lub oddzwonimy w ciągu 24 godzin. Wycena jest bezpłatna i bez zobowiązań.',
  successTitle: 'Zapytanie wysłane.',
  successText: 'Skontaktujemy się w ciągu 24 godzin — telefonicznie lub e-mailem.',
  successAgain: 'Wyślij kolejne zapytanie →',
  errorText: 'Nie udało się wysłać zapytania. Prosimy spróbować ponownie lub zadzwonić: {telefon}.',
}
