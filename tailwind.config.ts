import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // StoneArt brand palette
        stone: {
          bg:      '#EDEAE3',   // główne tło — ciepły kamień
          light:   '#F4F1EB',   // karty, sekcje
          white:   '#FAF8F4',   // inputy, treść
          dark:    '#2D2D2D',   // hero, footer — charcoal
          darker:  '#1A1A1A',   // footer bottom bar
          border:  '#D8D4C8',   // obramowania
        },
        gold: {
          DEFAULT: '#C4B87A',   // złoty akcent — wizytówka
          dark:    '#A89B58',   // hover, labels
          muted:   '#E8E0C4',   // tło akcentu
        },
        ink: {
          DEFAULT: '#1E1E1E',   // tekst główny
          secondary: '#5A5A5A', // tekst drugorzędny
          light:   '#8A8A8A',   // tekst trzeciorzędny
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        body:    ['var(--font-inter)',    'Inter', 'system-ui', 'sans-serif'],
        quote:   ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(48px, 6vw, 80px)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(36px, 4.5vw, 60px)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(28px, 3.5vw, 44px)', { lineHeight: '1.12' }],
        'display-sm': ['clamp(22px, 2.5vw, 30px)', { lineHeight: '1.2' }],
        'body-lg':    ['18px', { lineHeight: '1.75' }],
        'body-md':    ['17px', { lineHeight: '1.75' }],
        'body-sm':    ['15px', { lineHeight: '1.7' }],
        'label':      ['10px', { lineHeight: '1.4', letterSpacing: '0.16em' }],
        'label-sm':   ['9px',  { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },
      spacing: {
        'section-sm':  '80px',
        'section-md':  '120px',
        'section-lg':  '160px',
        'prose-max':   '680px',
        'container':   '1280px',
      },
      maxWidth: {
        'prose-stone': '680px',
        'container':   '1280px',
        'narrow':      '480px',
      },
      transitionTimingFunction: {
        'stone': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        'slow': '600ms',
        'slower': '900ms',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) both',
        'fade-in':    'fadeIn 0.5s ease both',
        'slide-right':'slideRight 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) both',
      },
      backgroundImage: {
        // Subtelna faktura kamienna jako SVG noise
        'stone-grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
