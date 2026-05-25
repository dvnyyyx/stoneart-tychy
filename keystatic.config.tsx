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
      Treść: ['testimonials'],
      Ustawienia: ['siteSettings', 'homepage'],
    },
  },

  collections: {
    testimonials: collection({
      label: 'Opinie klientów',
      slugField: 'author',
      path: 'content/testimonials/*',
      format: { data: 'json' },
      schema: {
        author: fields.slug({
          name: {
            label: 'Imię i inicjał (np. Anna K.)',
            validation: { isRequired: true },
          },
        }),
        location: fields.text({
          label: 'Miasto',
          validation: { isRequired: true },
        }),
        quote: fields.text({
          label: 'Treść opinii',
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },

  singletons: {
    siteSettings: singleton({
      label: 'Dane firmy',
      path: 'content/settings/site',
      format: { data: 'json' },
      schema: {
        phone: fields.text({
          label: 'Telefon',
          description: 'Wyświetlany na stronie i w stopce',
          validation: { isRequired: true },
        }),
        email: fields.text({
          label: 'Email',
          validation: { isRequired: true },
        }),
        address: fields.text({
          label: 'Adres',
          description: 'np. Różana 41, Tychy',
          validation: { isRequired: true },
        }),
        hours: fields.text({
          label: 'Godziny pracy',
          description: 'np. Pon.–Pt. 9:00–17:00',
          validation: { isRequired: true },
        }),
      },
    }),

    homepage: singleton({
      label: 'Strona główna — teksty',
      path: 'content/settings/homepage',
      format: { data: 'json' },
      schema: {
        heroTitle: fields.text({
          label: 'Hero — tytuł (linia 1)',
          description: 'Duży nagłówek na górze strony',
          validation: { isRequired: true },
        }),
        heroSubtitle: fields.text({
          label: 'Hero — tytuł (linia 2)',
          validation: { isRequired: true },
        }),
        heroDescription: fields.text({
          label: 'Hero — opis pod tytułem',
          multiline: true,
          validation: { isRequired: true },
        }),
        ctaPrimary: fields.text({
          label: 'Przycisk główny — tekst',
          validation: { isRequired: true },
        }),
        ctaSecondary: fields.text({
          label: 'Przycisk drugorzędny — tekst',
          validation: { isRequired: true },
        }),
        aboutTitle: fields.text({
          label: 'Sekcja "O nas" — tytuł',
          validation: { isRequired: true },
        }),
        aboutText: fields.text({
          label: 'Sekcja "O nas" — tekst',
          multiline: true,
          validation: { isRequired: true },
        }),
        testimonialsTitle: fields.text({
          label: 'Sekcja opinii — tytuł',
          validation: { isRequired: true },
        }),
        ctaTitle: fields.text({
          label: 'Sekcja CTA — tytuł',
          validation: { isRequired: true },
        }),
        ctaText: fields.text({
          label: 'Sekcja CTA — opis',
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },
})
