import { config, collection, singleton, fields } from '@keystatic/core'

// Lokalnie (npm run dev) CMS zapisuje prosto na dysk — bez OAuth, bez commitów,
// bez wyścigu z GitHubem. Na produkcji zapisuje commitem do repo (Vercel przebuduje).
// To eliminuje sytuację "raz zapisze, raz nie": w dev nie ma już zdalnego stanu,
// z którym lokalne pliki mogłyby się rozjechać.
const isDev = process.env.NODE_ENV === 'development'

// Wspólna definicja pola zdjęcia — jeden katalog i jedna ścieżka publiczna
// dla całego CMS-u, żeby nie powstawały dwa formaty ścieżek w JSON-ach.
const imageField = (label: string, description: string, required = false) =>
  required
    ? fields.image({
        label,
        description,
        directory: 'public/images/prace',
        publicPath: '/images/prace/',
        validation: { isRequired: true },
      })
    : fields.image({
        label,
        description,
        directory: 'public/images/prace',
        publicPath: '/images/prace/',
      })

// Powtarzalna para pól SEO — każda podstrona ma identyczny zestaw.
const seoFields = {
  metaTitle: fields.text({
    label: 'SEO — tytuł w Google',
    description: 'Zostaw puste, żeby użyć tytułu strony. Optymalnie 50–60 znaków.',
  }),
  metaDescription: fields.text({
    label: 'SEO — opis w Google',
    multiline: true,
    description: 'Zostaw puste, żeby użyć leadu. Optymalnie 120–155 znaków.',
  }),
}

export default config({
  storage: isDev
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: {
          owner: 'dvnyyyx',
          name: 'stoneart-tychy',
        },
      },

  ui: {
    brand: { name: 'StoneArt CMS' },
    navigation: {
      'Strona główna': ['hero', 'homepage'],
      'Galeria realizacji': ['gallery', 'categories', 'realizacjePage'],
      'Usługi': ['services', 'uslugiPage'],
      'Opinie': ['testimonials', 'opiniePage'],
      'Pozostałe podstrony': ['oNas', 'kontaktPage', 'wycenaPage', 'privacyPage'],
      'Formularz wyceny': ['quoteForm'],
      'Firma, menu i stopka': ['siteSettings', 'navigation', 'footer'],
    },
  },

  collections: {
    // ───────────────────────────────────────────────────────────────
    // Kategorie galerii — klient dodaje własne, bez zmian w kodzie.
    // ───────────────────────────────────────────────────────────────
    categories: collection({
      label: 'Kategorie galerii',
      slugField: 'name',
      path: 'content/categories/*',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/realizacje',
      columns: ['name', 'order'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Nazwa kategorii',
            description: 'np. Liternictwo i dopiski. Pokaże się jako filtr na stronie Realizacje.',
            validation: { isRequired: true },
          },
        }),
        order: fields.integer({
          label: 'Kolejność (1 = pierwsza)',
          defaultValue: 1,
        }),
      },
    }),

    // ───────────────────────────────────────────────────────────────
    // Galeria jako kolekcja: jedno zdjęcie = jeden plik.
    // Dzięki temu dodanie zdjęcia nie przepisuje całej listy i nie
    // kasuje wpisów dodanych równolegle (to psuło galerię wcześniej).
    // ───────────────────────────────────────────────────────────────
    gallery: collection({
      label: 'Zdjęcia realizacji',
      slugField: 'alt',
      path: 'content/gallery/*',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/realizacje',
      columns: ['alt', 'order'],
      schema: {
        alt: fields.slug({
          name: {
            label: 'Opis zdjęcia (alt)',
            description: 'Krótko, co widać na zdjęciu — Google czyta to jako opis obrazka.',
            validation: { isRequired: true },
          },
        }),
        image: imageField('Zdjęcie', 'Zalecane: JPG, min. 1200 px szerokości.', true),
        category: fields.relationship({
          label: 'Kategoria',
          description: 'Wybierz z listy. Nowe kategorie dodasz w zakładce „Kategorie galerii”.',
          collection: 'categories',
        }),
        featured: fields.checkbox({
          label: 'Pokaż na stronie głównej',
          defaultValue: false,
        }),
        order: fields.integer({
          label: 'Kolejność (1 = pierwsze)',
          defaultValue: 1,
        }),
      },
    }),

    testimonials: collection({
      label: 'Opinie klientów',
      slugField: 'author',
      path: 'content/testimonials/*',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/opinie',
      columns: ['author', 'location'],
      schema: {
        author: fields.slug({
          name: {
            label: 'Imię i nazwisko / inicjał',
            description: 'np. Anna K. albo Marek Wiśniewski',
            validation: { isRequired: true },
          },
        }),
        location: fields.text({
          label: 'Miasto',
          validation: { isRequired: true },
        }),
        rating: fields.integer({
          label: 'Ocena (1–5 gwiazdek)',
          defaultValue: 5,
          validation: { isRequired: true, min: 1, max: 5 },
        }),
        source: fields.select({
          label: 'Źródło opinii',
          defaultValue: 'google',
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Bezpośrednio', value: 'direct' },
            { label: 'Polecenie', value: 'referral' },
          ],
        }),
        quote: fields.text({
          label: 'Treść opinii',
          multiline: true,
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({
          label: 'Wyróżniona (pokazuj na stronie głównej)',
          defaultValue: true,
        }),
        order: fields.integer({
          label: 'Kolejność (1 = pierwsza)',
          defaultValue: 1,
        }),
      },
    }),

    services: collection({
      label: 'Usługi',
      slugField: 'title',
      path: 'content/services/*',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/uslugi/{slug}',
      columns: ['title', 'category'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Nazwa usługi',
            validation: { isRequired: true },
          },
        }),
        shortTitle: fields.text({
          label: 'Krótka nazwa (w menu, kartach)',
          validation: { isRequired: true },
        }),
        category: fields.text({
          label: 'Kategoria',
          description: 'np. Główna specjalizacja / Renowacja / Usługi dodatkowe',
        }),
        description: fields.text({
          label: 'Opis usługi',
          multiline: true,
          validation: { isRequired: true },
        }),
        features: fields.array(fields.text({ label: 'Punkt' }), {
          label: 'Lista cech / zakresu prac',
          itemLabel: (props) => props.value || 'Punkt',
        }),
        image: imageField('Zdjęcie usługi', 'Zdjęcie na podstronie usługi. Zalecane: JPG, min. 1200 px szerokości.'),
        featured: fields.checkbox({
          label: 'Główna usługa (wyróżniona na stronie głównej)',
          defaultValue: false,
        }),
        order: fields.integer({
          label: 'Kolejność wyświetlania (1 = pierwsza)',
          defaultValue: 1,
        }),
        ...seoFields,
      },
    }),
  },

  singletons: {
    // ───────────────────────────────────────────────────────────────
    // STRONA GŁÓWNA
    // ───────────────────────────────────────────────────────────────
    hero: singleton({
      label: 'Strona główna — Hero (nagłówek)',
      path: 'content/settings/hero',
      format: { data: 'json' },
      previewUrl: '/podglad/strona',
      schema: {
        label: fields.text({
          label: 'Etykieta nad tytułem',
          defaultValue: 'Pracownia rzemieślnicza — Tychy, Śląskie',
        }),
        titleLine1: fields.text({ label: 'Tytuł — linia 1', defaultValue: 'Usługi', validation: { isRequired: true } }),
        titleLine2: fields.text({ label: 'Tytuł — linia 2', defaultValue: 'kamieniarsko-', validation: { isRequired: true } }),
        titleLine3: fields.text({ label: 'Tytuł — linia 3 (kursywa)', defaultValue: 'liternicze.', validation: { isRequired: true } }),
        description: fields.text({
          label: 'Opis pod tytułem',
          multiline: true,
          validation: { isRequired: true },
        }),
        ctaPrimary: fields.text({ label: 'Przycisk główny — napis', defaultValue: 'Zapytaj o wycenę', validation: { isRequired: true } }),
        ctaPrimaryHref: fields.text({ label: 'Przycisk główny — adres', defaultValue: '/wycena' }),
        heroImage: imageField('Zdjęcie tła hero', 'Poziome, min. 1920 px szerokości.'),
        heroImageAlt: fields.text({ label: 'Opis zdjęcia tła (alt)', defaultValue: 'Pracownia StoneArt — detal kamienia' }),
        scrollLabel: fields.text({ label: 'Pionowy napis na dole', defaultValue: 'Scroll' }),
      },
    }),

    homepage: singleton({
      label: 'Strona główna — sekcje',
      path: 'content/settings/homepage',
      format: { data: 'json' },
      previewUrl: '/podglad/strona',
      schema: {
        aboutLabel: fields.text({ label: 'Sekcja „O pracowni” — etykieta', defaultValue: 'O pracowni' }),
        aboutTitle: fields.text({ label: 'Sekcja „O pracowni” — tytuł', defaultValue: 'Precyzja i dbałość o szczegóły.', validation: { isRequired: true } }),
        aboutText1: fields.text({ label: 'Sekcja „O pracowni” — akapit 1', multiline: true, validation: { isRequired: true } }),
        aboutText2: fields.text({ label: 'Sekcja „O pracowni” — akapit 2', multiline: true }),
        aboutLinkLabel: fields.text({ label: 'Sekcja „O pracowni” — napis odnośnika', defaultValue: 'O pracowni' }),
        aboutLinkHref: fields.text({ label: 'Sekcja „O pracowni” — adres odnośnika', defaultValue: '/o-nas' }),
        editorialImage1: imageField('Sekcja „O pracowni” — zdjęcie', 'Poziome wygląda najlepiej.'),

        servicesLabel: fields.text({ label: 'Sekcja usług — etykieta', defaultValue: 'Usługi' }),
        servicesTitle: fields.text({ label: 'Sekcja usług — tytuł', defaultValue: 'Zakres prac.' }),
        servicesLinkLabel: fields.text({ label: 'Sekcja usług — odnośnik w nagłówku', defaultValue: 'Wszystkie usługi →' }),
        servicesCtaText: fields.text({ label: 'Sekcja usług — tekst pod kafelkami', defaultValue: 'Nie znalazłeś tego, czego szukasz?' }),
        servicesCtaLink: fields.text({ label: 'Sekcja usług — napis odnośnika pod kafelkami', defaultValue: 'Napisz do nas, wycenimy każdą pracę →' }),
        servicesCtaHref: fields.text({ label: 'Sekcja usług — adres odnośnika pod kafelkami', defaultValue: '/kontakt' }),
        serviceCardCta: fields.text({ label: 'Napis na wyróżnionej karcie usługi', defaultValue: 'Zapytaj o wycenę →' }),

        galleryLabel: fields.text({ label: 'Sekcja realizacji — etykieta', defaultValue: 'Realizacje' }),
        galleryTitle: fields.text({ label: 'Sekcja realizacji — tytuł', defaultValue: 'Wybrane prace.' }),
        galleryLinkLabel: fields.text({ label: 'Sekcja realizacji — odnośnik w nagłówku', defaultValue: 'Wszystkie realizacje →' }),
        galleryNote: fields.text({ label: 'Sekcja realizacji — podpis pod galerią', defaultValue: 'Pracujemy na cmentarzach w Tychach i całym regionie śląskim.' }),
        galleryLimit: fields.integer({ label: 'Ile zdjęć pokazać na stronie głównej', defaultValue: 6 }),

        qualityLabel: fields.text({ label: 'Sekcja „Jak pracujemy” — etykieta', defaultValue: 'Jak pracujemy' }),
        qualityTitle: fields.text({ label: 'Sekcja „Jak pracujemy” — tytuł', defaultValue: 'Solidnie, estetycznie, trwale.', validation: { isRequired: true } }),
        qualityText1: fields.text({ label: 'Sekcja „Jak pracujemy” — akapit 1', multiline: true, validation: { isRequired: true } }),
        qualityText2: fields.text({ label: 'Sekcja „Jak pracujemy” — akapit 2', multiline: true }),
        qualityLinkLabel: fields.text({ label: 'Sekcja „Jak pracujemy” — napis odnośnika', defaultValue: 'Zapytaj o wycenę' }),
        qualityLinkHref: fields.text({ label: 'Sekcja „Jak pracujemy” — adres odnośnika', defaultValue: '/wycena' }),
        editorialImage2: imageField('Sekcja „Jak pracujemy” — zdjęcie', 'Poziome wygląda najlepiej.'),

        testimonialsLabel: fields.text({ label: 'Sekcja opinii — etykieta', defaultValue: 'Opinie klientów' }),
        testimonialsTitle: fields.text({ label: 'Sekcja opinii — tytuł', defaultValue: 'Co mówią nasi klienci.', validation: { isRequired: true } }),
        testimonialsLinkLabel: fields.text({ label: 'Sekcja opinii — odnośnik w nagłówku', defaultValue: 'Wszystkie opinie →' }),

        ...seoFields,
      },
    }),

    // ───────────────────────────────────────────────────────────────
    // PODSTRONY
    // ───────────────────────────────────────────────────────────────
    oNas: singleton({
      label: 'Strona — O pracowni',
      path: 'content/settings/o-nas',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/o-nas',
      schema: {
        pageLabel: fields.text({ label: 'Nagłówek — etykieta', defaultValue: 'O pracowni' }),
        pageTitle: fields.text({ label: 'Nagłówek — tytuł', defaultValue: 'StoneArt — Tychy.', validation: { isRequired: true } }),
        pageLead: fields.text({ label: 'Nagłówek — lead', multiline: true, validation: { isRequired: true } }),
        s1Label: fields.text({ label: 'Sekcja 1 — etykieta', defaultValue: 'Czym się zajmujemy' }),
        s1Title: fields.text({ label: 'Sekcja 1 — tytuł', validation: { isRequired: true } }),
        s1Text1: fields.text({ label: 'Sekcja 1 — akapit 1', multiline: true, validation: { isRequired: true } }),
        s1Text2: fields.text({ label: 'Sekcja 1 — akapit 2', multiline: true }),
        s1Image: imageField('Sekcja 1 — zdjęcie', 'Pionowe wygląda najlepiej.'),
        s2Label: fields.text({ label: 'Sekcja 2 — etykieta', defaultValue: 'Podejście do pracy' }),
        s2Title: fields.text({ label: 'Sekcja 2 — tytuł', validation: { isRequired: true } }),
        s2Text1: fields.text({ label: 'Sekcja 2 — akapit 1', multiline: true, validation: { isRequired: true } }),
        s2Text2: fields.text({ label: 'Sekcja 2 — akapit 2', multiline: true }),
        s2Image: imageField('Sekcja 2 — zdjęcie', 'Poziome wygląda najlepiej.'),
        s3Label: fields.text({ label: 'Sekcja 3 — etykieta', defaultValue: 'Wycena' }),
        s3Title: fields.text({ label: 'Sekcja 3 — tytuł', validation: { isRequired: true } }),
        s3Text1: fields.text({ label: 'Sekcja 3 — akapit 1', multiline: true, validation: { isRequired: true } }),
        s3Text2: fields.text({ label: 'Sekcja 3 — akapit 2', multiline: true }),
        s3Image: imageField('Sekcja 3 — zdjęcie', 'Kwadratowe wygląda najlepiej.'),
        s3LinkLabel: fields.text({ label: 'Sekcja 3 — napis odnośnika', defaultValue: 'Zapytaj o wycenę' }),
        s3LinkHref: fields.text({ label: 'Sekcja 3 — adres odnośnika', defaultValue: '/wycena' }),
        ...seoFields,
      },
    }),

    uslugiPage: singleton({
      label: 'Strona — Usługi (teksty)',
      path: 'content/settings/uslugi-page',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/uslugi',
      schema: {
        pageLabel: fields.text({ label: 'Nagłówek — etykieta', defaultValue: 'Usługi' }),
        pageTitle: fields.text({ label: 'Nagłówek — tytuł', defaultValue: 'Zakres prac.', validation: { isRequired: true } }),
        pageLead: fields.text({ label: 'Nagłówek — lead', multiline: true }),
        featuredBadge: fields.text({ label: 'Plakietka przy głównej usłudze', defaultValue: 'Specjalizacja' }),
        moreLabel: fields.text({ label: 'Napis „więcej” przy usłudze', defaultValue: 'Więcej →' }),
        ctaText: fields.text({ label: 'Tekst nad przyciskiem na dole', defaultValue: 'Nie znalazłeś tego, czego szukasz?' }),
        ctaButton: fields.text({ label: 'Przycisk na dole — napis', defaultValue: 'Napisz do nas →' }),
        ctaHref: fields.text({ label: 'Przycisk na dole — adres', defaultValue: '/kontakt' }),
        detailScopeLabel: fields.text({ label: 'Podstrona usługi — etykieta nad listą', defaultValue: 'Zakres prac' }),
        detailRelatedLabel: fields.text({ label: 'Podstrona usługi — etykieta „inne usługi”', defaultValue: 'Inne usługi' }),
        detailCtaButton: fields.text({ label: 'Podstrona usługi — przycisk', defaultValue: 'Zapytaj o wycenę' }),
        ...seoFields,
      },
    }),

    realizacjePage: singleton({
      label: 'Strona — Realizacje (teksty)',
      path: 'content/settings/realizacje-page',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/realizacje',
      schema: {
        pageLabel: fields.text({ label: 'Nagłówek — etykieta', defaultValue: 'Realizacje' }),
        pageTitle: fields.text({ label: 'Nagłówek — tytuł', defaultValue: 'Wybrane prace.', validation: { isRequired: true } }),
        pageLead: fields.text({ label: 'Nagłówek — lead', multiline: true }),
        galleryLabel: fields.text({ label: 'Etykieta nad galerią', defaultValue: 'Galeria prac' }),
        allFilterLabel: fields.text({ label: 'Nazwa filtra „wszystkie”', defaultValue: 'Wszystkie' }),
        emptyTitle: fields.text({ label: 'Gdy brak zdjęć — tytuł', defaultValue: 'Galeria w przygotowaniu.' }),
        emptyText: fields.text({ label: 'Gdy brak zdjęć — tekst', multiline: true }),
        ctaButton: fields.text({ label: 'Przycisk na dole — napis', defaultValue: 'Zadzwoń po bezpłatną wycenę →' }),
        ...seoFields,
      },
    }),

    opiniePage: singleton({
      label: 'Strona — Opinie (teksty)',
      path: 'content/settings/opinie-page',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/opinie',
      schema: {
        pageLabel: fields.text({ label: 'Nagłówek — etykieta', defaultValue: 'Opinie klientów' }),
        pageTitle: fields.text({ label: 'Nagłówek — tytuł', defaultValue: 'Co mówią nasi klienci.', validation: { isRequired: true } }),
        pageLead: fields.text({ label: 'Nagłówek — lead', multiline: true }),
        reviewCtaText: fields.text({ label: 'Tekst nad przyciskiem opinii', defaultValue: 'Masz doświadczenie z naszą pracownią?' }),
        reviewCtaButton: fields.text({ label: 'Przycisk „napisz opinię” — napis', defaultValue: 'Napisz opinię →' }),
        reviewCtaUrl: fields.url({ label: 'Link do wystawienia opinii w Google' }),
        bottomText: fields.text({ label: 'Tekst sekcji na dole', defaultValue: 'Chcesz dołączyć do naszych klientów?' }),
        bottomButton: fields.text({ label: 'Przycisk na dole — napis', defaultValue: 'Zapytaj o wycenę →' }),
        bottomHref: fields.text({ label: 'Przycisk na dole — adres', defaultValue: '/wycena' }),
        ...seoFields,
      },
    }),

    kontaktPage: singleton({
      label: 'Strona — Kontakt (teksty)',
      path: 'content/settings/kontakt-page',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/kontakt',
      schema: {
        pageLabel: fields.text({ label: 'Nagłówek — etykieta', defaultValue: 'Kontakt' }),
        pageTitle: fields.text({ label: 'Nagłówek — tytuł', defaultValue: 'Skontaktuj się z nami.', validation: { isRequired: true } }),
        pageLead: fields.text({
          label: 'Nagłówek — lead',
          multiline: true,
          description: 'Wpisz {godziny}, żeby wstawić godziny pracy z zakładki „Dane firmy i kontakt”.',
        }),
        phoneLabel: fields.text({ label: 'Kafelek telefonu — etykieta', defaultValue: 'Telefon' }),
        phoneNote: fields.text({ label: 'Kafelek telefonu — podpis', description: 'Puste = godziny pracy z danych firmy.' }),
        phoneCta: fields.text({ label: 'Kafelek telefonu — odnośnik', defaultValue: 'Zadzwoń teraz' }),
        emailLabel: fields.text({ label: 'Kafelek e-mail — etykieta', defaultValue: 'E-mail' }),
        emailNote: fields.text({ label: 'Kafelek e-mail — podpis', defaultValue: 'Odpiszemy w ciągu 24 godzin' }),
        emailCta: fields.text({ label: 'Kafelek e-mail — odnośnik', defaultValue: 'Napisz wiadomość' }),
        addressLabel: fields.text({ label: 'Kafelek adresu — etykieta', defaultValue: 'Adres' }),
        addressCta: fields.text({ label: 'Kafelek adresu — odnośnik', defaultValue: 'Pokaż na mapie' }),
        bottomText: fields.text({ label: 'Tekst sekcji na dole', defaultValue: 'Wolisz wypełnić formularz?' }),
        bottomButton: fields.text({ label: 'Przycisk na dole — napis', defaultValue: 'Zapytaj o wycenę →' }),
        bottomHref: fields.text({ label: 'Przycisk na dole — adres', defaultValue: '/wycena' }),
        ...seoFields,
      },
    }),

    wycenaPage: singleton({
      label: 'Strona — Wycena (teksty)',
      path: 'content/settings/wycena-page',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/wycena',
      schema: {
        pageLabel: fields.text({ label: 'Nagłówek — etykieta', defaultValue: 'Wycena' }),
        pageTitle: fields.text({ label: 'Nagłówek — tytuł', defaultValue: 'Zapytaj o wycenę.', validation: { isRequired: true } }),
        pageLead: fields.text({ label: 'Nagłówek — lead', multiline: true }),
        contactTitle: fields.text({ label: 'Tytuł kolumny kontaktowej', defaultValue: 'Kontakt bezpośredni' }),
        phoneLabel: fields.text({ label: 'Etykieta telefonu', defaultValue: 'Telefon' }),
        emailLabel: fields.text({ label: 'Etykieta e-maila', defaultValue: 'E-mail' }),
        emailNote: fields.text({ label: 'Podpis pod e-mailem', defaultValue: 'Odpiszemy do 24h' }),
        addressLabel: fields.text({ label: 'Etykieta adresu', defaultValue: 'Adres' }),
        formTitle: fields.text({ label: 'Tytuł nad formularzem', defaultValue: 'Formularz wyceny' }),
        ...seoFields,
      },
    }),

    privacyPage: singleton({
      label: 'Strona — Polityka prywatności',
      path: 'content/settings/privacy-page',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/polityka-prywatnosci',
      schema: {
        pageLabel: fields.text({ label: 'Nagłówek — etykieta', defaultValue: 'Informacje prawne' }),
        pageTitle: fields.text({ label: 'Nagłówek — tytuł', defaultValue: 'Polityka Prywatności.', validation: { isRequired: true } }),
        pageLead: fields.text({ label: 'Nagłówek — lead', multiline: true }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Nagłówek punktu', validation: { isRequired: true } }),
            body: fields.text({
              label: 'Treść punktu',
              multiline: true,
              description: 'Pusta linia rozdziela akapity. Znaczniki {firma}, {wlasciciel}, {telefon}, {email}, {adres}, {ulica}, {kod}, {miasto} wstawią dane z zakładki „Dane firmy i kontakt”.',
              validation: { isRequired: true },
            }),
            bullets: fields.array(fields.text({ label: 'Punkt listy' }), {
              label: 'Lista wypunktowana (opcjonalnie)',
              itemLabel: (props) => props.value || 'Punkt',
            }),
          }),
          {
            label: 'Punkty polityki',
            itemLabel: (props) => props.fields.heading.value || 'Punkt',
          }
        ),
        updatedAt: fields.text({ label: 'Data ostatniej aktualizacji', description: 'np. 17 sierpnia 2026' }),
        ...seoFields,
      },
    }),

    // ───────────────────────────────────────────────────────────────
    // FORMULARZ
    // ───────────────────────────────────────────────────────────────
    quoteForm: singleton({
      label: 'Formularz wyceny',
      path: 'content/settings/quote-form',
      format: { data: 'json' },
      previewUrl: '/podglad/strona/wycena',
      schema: {
        sectionLabel: fields.text({ label: 'Sekcja na podstronach — etykieta', defaultValue: 'Wycena' }),
        sectionTitle: fields.text({
          label: 'Sekcja na podstronach — tytuł',
          multiline: true,
          description: 'Każda nowa linia = osobny wiersz nagłówka.',
          defaultValue: 'Napisz do nas.\nWycena jest\nbezpłatna.',
        }),
        sectionText: fields.text({ label: 'Sekcja na podstronach — opis', multiline: true }),
        emailNote: fields.text({ label: 'Podpis pod e-mailem w sekcji', defaultValue: 'Odpiszemy w ciągu 24h' }),
        workTypes: fields.array(fields.text({ label: 'Rodzaj pracy' }), {
          label: 'Lista „Rodzaj pracy” w formularzu',
          description: 'Opcje w rozwijanej liście formularza. Dodawaj i usuwaj dowolnie.',
          itemLabel: (props) => props.value || 'Rodzaj pracy',
        }),
        nameLabel: fields.text({ label: 'Pole „imię” — etykieta', defaultValue: 'Imię i nazwisko' }),
        namePlaceholder: fields.text({ label: 'Pole „imię” — podpowiedź', defaultValue: 'Jan Kowalski' }),
        contactLabel: fields.text({ label: 'Pole „kontakt” — etykieta', defaultValue: 'Telefon lub e-mail' }),
        contactPlaceholder: fields.text({ label: 'Pole „kontakt” — podpowiedź', defaultValue: '734 000 000 lub jan@email.pl' }),
        cemeteryLabel: fields.text({ label: 'Pole „lokalizacja” — etykieta', defaultValue: 'Miasto / cmentarz' }),
        cemeteryPlaceholder: fields.text({ label: 'Pole „lokalizacja” — podpowiedź', defaultValue: 'np. Tychy, cmentarz przy ul. Edukacji' }),
        workTypeLabel: fields.text({ label: 'Pole „rodzaj pracy” — etykieta', defaultValue: 'Rodzaj pracy' }),
        workTypePlaceholder: fields.text({ label: 'Pole „rodzaj pracy” — podpowiedź', defaultValue: 'Wybierz rodzaj pracy…' }),
        descriptionLabel: fields.text({ label: 'Pole „opis” — etykieta', defaultValue: 'Opis prac' }),
        descriptionPlaceholder: fields.text({ label: 'Pole „opis” — podpowiedź', defaultValue: 'Opisz co wymaga zrobienia, jaki materiał, ewentualnie rozmiary…' }),
        photosLabel: fields.text({ label: 'Pole „zdjęcia” — etykieta', defaultValue: 'Zdjęcia' }),
        photosHint: fields.text({ label: 'Pole „zdjęcia” — dopisek', defaultValue: '(opcjonalnie)' }),
        photosDropText: fields.text({ label: 'Pole „zdjęcia” — napis w ramce', defaultValue: 'Dodaj zdjęcia nagrobka' }),
        submitLabel: fields.text({ label: 'Przycisk wysyłki — napis', defaultValue: 'Wyślij zapytanie' }),
        submittingLabel: fields.text({ label: 'Przycisk wysyłki — w trakcie', defaultValue: 'Wysyłanie…' }),
        footnote: fields.text({ label: 'Notka pod przyciskiem', multiline: true, defaultValue: 'Odpiszemy lub oddzwonimy w ciągu 24 godzin. Wycena jest bezpłatna i bez zobowiązań.' }),
        successTitle: fields.text({ label: 'Po wysłaniu — tytuł', defaultValue: 'Zapytanie wysłane.' }),
        successText: fields.text({ label: 'Po wysłaniu — tekst', multiline: true, defaultValue: 'Skontaktujemy się w ciągu 24 godzin — telefonicznie lub e-mailem.' }),
        successAgain: fields.text({ label: 'Po wysłaniu — odnośnik', defaultValue: 'Wyślij kolejne zapytanie →' }),
        errorText: fields.text({
          label: 'Komunikat błędu wysyłki',
          multiline: true,
          description: 'Wpisz {telefon}, żeby wstawić numer z danych firmy.',
          defaultValue: 'Nie udało się wysłać zapytania. Prosimy spróbować ponownie lub zadzwonić: {telefon}.',
        }),
      },
    }),

    // ───────────────────────────────────────────────────────────────
    // GLOBALNE: MENU, STOPKA, DANE FIRMY
    // ───────────────────────────────────────────────────────────────
    navigation: singleton({
      label: 'Menu górne',
      path: 'content/settings/navigation',
      format: { data: 'json' },
      previewUrl: '/podglad/strona',
      schema: {
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Nazwa', validation: { isRequired: true } }),
            href: fields.text({ label: 'Adres', description: 'np. /uslugi', validation: { isRequired: true } }),
          }),
          {
            label: 'Pozycje menu',
            description: 'Przeciągnij, żeby zmienić kolejność.',
            itemLabel: (props) => props.fields.label.value || 'Pozycja',
          }
        ),
        ctaLabel: fields.text({ label: 'Przycisk w menu — napis', defaultValue: 'Zapytaj o wycenę' }),
        ctaHref: fields.text({ label: 'Przycisk w menu — adres', defaultValue: '/wycena' }),
        tagline: fields.text({ label: 'Podpis pod logo', defaultValue: 'Usługi Kamieniarsko-Liternicze' }),
      },
    }),

    footer: singleton({
      label: 'Stopka',
      path: 'content/settings/footer',
      format: { data: 'json' },
      previewUrl: '/podglad/strona',
      schema: {
        about: fields.text({ label: 'Opis pod logo', multiline: true, defaultValue: 'Liternictwo nagrobne, dopiski i renowacja nagrobków — Tychy i okolice.' }),
        servicesHeading: fields.text({ label: 'Nagłówek kolumny usług', defaultValue: 'Usługi' }),
        companyHeading: fields.text({ label: 'Nagłówek kolumny firmowej', defaultValue: 'Firma' }),
        companyLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Nazwa', validation: { isRequired: true } }),
            href: fields.text({ label: 'Adres', validation: { isRequired: true } }),
          }),
          {
            label: 'Odnośniki w kolumnie firmowej',
            itemLabel: (props) => props.fields.label.value || 'Odnośnik',
          }
        ),
        ctaHeading: fields.text({ label: 'Nagłówek kolumny wyceny', defaultValue: 'Wycena' }),
        ctaText: fields.text({ label: 'Tekst kolumny wyceny', multiline: true, defaultValue: 'Bezpłatna wycena. Odpiszemy lub oddzwonimy w ciągu 24 godzin.' }),
        ctaButton: fields.text({ label: 'Przycisk w stopce — napis', defaultValue: 'Zapytaj o wycenę' }),
        ctaHref: fields.text({ label: 'Przycisk w stopce — adres', defaultValue: '/wycena' }),
        privacyLabel: fields.text({ label: 'Napis odnośnika polityki prywatności', defaultValue: 'Polityka Prywatności' }),
      },
    }),

    siteSettings: singleton({
      label: 'Dane firmy i kontakt',
      path: 'content/settings/site',
      format: { data: 'json' },
      schema: {
        companyName: fields.text({ label: 'Nazwa firmy', defaultValue: 'StoneArt' }),
        companyFullName: fields.text({ label: 'Pełna nazwa firmy', defaultValue: 'StoneArt Usługi Kamieniarsko-Liternicze' }),
        owner: fields.text({ label: 'Właściciel', defaultValue: 'Adam Wytrykus' }),
        phone: fields.text({ label: 'Telefon', description: 'Wyświetlany na stronie, w stopce i w nagłówku', validation: { isRequired: true } }),
        email: fields.text({ label: 'E-mail kontaktowy', validation: { isRequired: true } }),
        address: fields.text({ label: 'Adres', description: 'np. Różana 41, Tychy', validation: { isRequired: true } }),
        street: fields.text({ label: 'Sama ulica z numerem', description: 'Do danych strukturalnych Google. np. Różana 41', defaultValue: 'Różana 41' }),
        postcode: fields.text({ label: 'Kod pocztowy', defaultValue: '43-100' }),
        city: fields.text({ label: 'Miasto', defaultValue: 'Tychy' }),
        region: fields.text({ label: 'Województwo', defaultValue: 'Śląskie' }),
        hours: fields.text({ label: 'Godziny pracy', description: 'np. Pon.–Pt. 9:00–17:00', validation: { isRequired: true } }),
        opensAt: fields.text({ label: 'Godzina otwarcia (dla Google)', description: 'Format 24h, np. 09:00', defaultValue: '09:00' }),
        closesAt: fields.text({ label: 'Godzina zamknięcia (dla Google)', description: 'Format 24h, np. 17:00', defaultValue: '17:00' }),
        serviceArea: fields.text({ label: 'Obszar obsługi', defaultValue: 'Tychy, Katowice, Mysłowice, Bieruń, Lędziny i okolice' }),
        latitude: fields.text({ label: 'Szerokość geograficzna', description: 'Do wizytówki w Google. np. 50.1276', defaultValue: '50.1276' }),
        longitude: fields.text({ label: 'Długość geograficzna', description: 'np. 18.9765', defaultValue: '18.9765' }),
        googleMapsUrl: fields.url({ label: 'Link do Google Maps' }),
        facebookUrl: fields.url({ label: 'Link do Facebooka' }),
        googleProfileUrl: fields.url({ label: 'Link do wizytówki Google' }),
        description: fields.text({
          label: 'Opis firmy (SEO, domyślny dla całej strony)',
          multiline: true,
          defaultValue: 'Liternictwo nagrobne i renowacja nagrobków w Tychach. Dopiski liter i dat, piaskowanie napisów, odnawianie tablic granitowych. Klienci i zakłady kamieniarskie.',
        }),
      },
    }),
  },
})
