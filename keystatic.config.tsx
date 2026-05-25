import { config, collection, singleton, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'dvnyyyx',
      name: 'stoneart-tychy',
    },
  },

  ui: {
    brand: { name: 'StoneArt CMS' },
    navigation: {
      Galeria: ['galleryData'],
      Opinie: ['testimonials'],
      'Strona główna': ['hero', 'homepage'],
      Usługi: ['services'],
      Firma: ['siteSettings'],
    },
  },

  collections: {
    testimonials: collection({
      label: 'Opinie klientów',
      slugField: 'author',
      path: 'content/testimonials/*',
      format: { data: 'json' },
      previewUrl: '/opinie',
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
      },
    }),

    services: collection({
      label: 'Usługi',
      slugField: 'title',
      path: 'content/services/*',
      format: { data: 'json' },
      previewUrl: '/uslugi',
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
        features: fields.array(
          fields.text({ label: 'Punkt' }),
          {
            label: 'Lista cech / zakresu prac',
            itemLabel: (props) => props.value || 'Punkt',
          }
        ),
        featured: fields.checkbox({
          label: 'Główna usługa (wyróżniona na stronie głównej)',
          defaultValue: false,
        }),
        order: fields.integer({
          label: 'Kolejność wyświetlania (1 = pierwsza)',
          defaultValue: 1,
        }),
      },
    }),
  },

  singletons: {
    hero: singleton({
      label: 'Strona główna — Hero (nagłówek)',
      path: 'content/settings/hero',
      format: { data: 'json' },
      previewUrl: '/',
      schema: {
        label: fields.text({
          label: 'Etykieta nad tytułem',
          description: 'Małe litery nad głównym nagłówkiem',
          defaultValue: 'Pracownia rzemieślnicza — Tychy, Śląskie',
        }),
        titleLine1: fields.text({
          label: 'Tytuł — linia 1',
          defaultValue: 'Usługi',
          validation: { isRequired: true },
        }),
        titleLine2: fields.text({
          label: 'Tytuł — linia 2',
          defaultValue: 'kamieniarsko-',
          validation: { isRequired: true },
        }),
        titleLine3: fields.text({
          label: 'Tytuł — linia 3 (kursywa, przyciemniona)',
          defaultValue: 'liternicze.',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Opis pod tytułem',
          multiline: true,
          defaultValue: 'Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów oraz renowacji nagrobków i tablic granitowych. Tychy i okolice — do wyceny wystarczą zdjęcia.',
          validation: { isRequired: true },
        }),
        ctaPrimary: fields.text({
          label: 'Przycisk główny',
          defaultValue: 'Zapytaj o wycenę',
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: 'Zdjęcie tła hero',
          description: 'Duże zdjęcie w tle na stronie głównej. Najlepiej poziome, min. 1920×1080px.',
          directory: 'public/images/prace',
          publicPath: '/images/prace/',
        }),
      },
    }),

    homepage: singleton({
      label: 'Strona główna — sekcje',
      path: 'content/settings/homepage',
      format: { data: 'json' },
      previewUrl: '/',
      schema: {
        aboutLabel: fields.text({
          label: 'Sekcja "O pracowni" — etykieta',
          defaultValue: 'O pracowni',
        }),
        aboutTitle: fields.text({
          label: 'Sekcja "O pracowni" — tytuł',
          defaultValue: 'Precyzja i dbałość o szczegóły.',
          validation: { isRequired: true },
        }),
        aboutText1: fields.text({
          label: 'Sekcja "O pracowni" — akapit 1',
          multiline: true,
          defaultValue: 'Specjalizujemy się w liternictwie nagrobnym, piaskowaniu napisów oraz renowacji nagrobków i tablic granitowych. Działamy na terenie Tychów i okolicznych miejscowości, wykonując usługi zarówno dla klientów indywidualnych, jak i zakładów kamieniarskich.',
          validation: { isRequired: true },
        }),
        aboutText2: fields.text({
          label: 'Sekcja "O pracowni" — akapit 2',
          multiline: true,
          defaultValue: 'Rozumiemy, że nagrobek jest miejscem pamięci bliskich osób. Do każdego zlecenia podchodzimy z należytą starannością i szacunkiem.',
          validation: { isRequired: true },
        }),
        qualityLabel: fields.text({
          label: 'Sekcja "Jak pracujemy" — etykieta',
          defaultValue: 'Jak pracujemy',
        }),
        qualityTitle: fields.text({
          label: 'Sekcja "Jak pracujemy" — tytuł',
          defaultValue: 'Solidnie, estetycznie, trwale.',
          validation: { isRequired: true },
        }),
        qualityText1: fields.text({
          label: 'Sekcja "Jak pracujemy" — akapit 1',
          multiline: true,
          defaultValue: 'Każde zlecenie realizujemy indywidualnie, zwracając uwagę na estetykę, trwałość i dokładność wykonania. Pracujemy na różnych rodzajach kamienia naturalnego, dobierając odpowiednią technikę do każdego przypadku.',
          validation: { isRequired: true },
        }),
        qualityText2: fields.text({
          label: 'Sekcja "Jak pracujemy" — akapit 2',
          multiline: true,
          defaultValue: 'W wielu przypadkach do wstępnej wyceny wystarczą zdjęcia przesłane telefonicznie. Napisz lub zadzwoń — bezpośredni kontakt na każdym etapie zlecenia, wycena bezpłatna.',
          validation: { isRequired: true },
        }),
        testimonialsTitle: fields.text({
          label: 'Sekcja opinii — tytuł',
          defaultValue: 'Co mówią nasi klienci.',
          validation: { isRequired: true },
        }),
        editorialImage1: fields.image({
          label: 'Zdjęcie przy sekcji "O pracowni"',
          description: 'Zdjęcie po lewej stronie tekstu "Precyzja i dbałość o szczegóły".',
          directory: 'public/images/prace',
          publicPath: '/images/prace/',
        }),
        editorialImage2: fields.image({
          label: 'Zdjęcie przy sekcji "Jak pracujemy"',
          description: 'Zdjęcie po prawej stronie tekstu "Solidnie, estetycznie, trwale".',
          directory: 'public/images/prace',
          publicPath: '/images/prace/',
        }),
      },
    }),

    galleryData: singleton({
      label: 'Galeria realizacji',
      path: 'content/settings/gallery',
      format: { data: 'json' },
      previewUrl: '/realizacje',
      schema: {
        items: fields.array(
          fields.object({
            image: fields.image({
              label: 'Zdjęcie',
              description: 'Wgraj zdjęcie realizacji. Zalecane: JPG, min. 800×600px.',
              directory: 'public/images/prace',
              publicPath: '/images/prace/',
            }),
            alt: fields.text({
              label: 'Opis zdjęcia',
              description: 'Krótki opis co jest na zdjęciu — ważne dla SEO i dostępności',
              defaultValue: 'Prace kamieniarsko-liternicze StoneArt — Tychy',
              validation: { isRequired: true },
            }),
            category: fields.select({
              label: 'Kategoria',
              defaultValue: 'liternictwo',
              options: [
                { label: 'Liternictwo i dopiski', value: 'liternictwo' },
                { label: 'Renowacja nagrobków', value: 'renowacja' },
                { label: 'Montaż tablic', value: 'montaz' },
                { label: 'Inne', value: 'inne' },
              ],
            }),
            featured: fields.checkbox({
              label: 'Pokazuj na stronie głównej',
              description: 'Zaznacz, żeby zdjęcie pojawiło się w galerii na stronie głównej (max. 6 zdjęć)',
              defaultValue: false,
            }),
          }),
          {
            label: 'Zdjęcia w galerii',
            description: 'Przeciągnij zdjęcia, aby zmienić kolejność. Kolejność na liście = kolejność wyświetlania na stronie.',
            itemLabel: (props) => props.fields.alt.value || 'Zdjęcie',
          }
        ),
      },
    }),

    siteSettings: singleton({
      label: 'Dane firmy i kontakt',
      path: 'content/settings/site',
      format: { data: 'json' },
      schema: {
        phone: fields.text({
          label: 'Telefon',
          description: 'Wyświetlany na stronie, w stopce i w nagłówku',
          validation: { isRequired: true },
        }),
        email: fields.text({
          label: 'Email kontaktowy',
          validation: { isRequired: true },
        }),
        address: fields.text({
          label: 'Adres',
          description: 'np. Różana 41, Tychy',
          validation: { isRequired: true },
        }),
        postcode: fields.text({
          label: 'Kod pocztowy',
          defaultValue: '43-100',
        }),
        city: fields.text({
          label: 'Miasto',
          defaultValue: 'Tychy',
        }),
        hours: fields.text({
          label: 'Godziny pracy',
          description: 'np. Pon.–Pt. 9:00–17:00',
          validation: { isRequired: true },
        }),
        serviceArea: fields.text({
          label: 'Obszar obsługi',
          description: 'Wyświetlany w stopce i na stronie kontaktowej',
          defaultValue: 'Tychy, Katowice, Mysłowice, Bieruń, Lędziny i okolice',
        }),
        googleMapsUrl: fields.url({
          label: 'Link do Google Maps',
          description: 'Link do lokalizacji firmy na Google Maps',
        }),
      },
    }),
  },
})
