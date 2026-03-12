import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#E29B45',
          light: '#F0B56A',
          dark: '#C47B27',
          50: '#FFF8EE',
          100: '#FCEFD9',
          200: '#F7D9AE',
          300: '#F0B56A',
          400: '#E7A457',
          500: '#E29B45',
          600: '#CC8733',
          700: '#A96A25',
          800: '#7F4D1D',
          900: '#5B3615',
        },
        accent: {
          DEFAULT: '#F6F2EA',
          light: '#FFFDF8',
          dark: '#D6C7AD',
        },
        dark: {
          0: '#0C0F10',
          1: '#121618',
          2: '#1C2225',
          3: '#333A3F',
        },
        light: {
          0: '#FFFCF7',
          1: '#F4EFE6',
          2: '#E8E0D2',
          3: '#C8BFAA',
        },
      },
      borderRadius: {
        '2xl': '18px',
        'xl': '14px',
        'lg': '10px',
      },
      boxShadow: {
        'glow-sm': '0 18px 45px rgba(226, 155, 69, 0.18)',
        glow: '0 28px 80px rgba(226, 155, 69, 0.24)',
        'glow-lg': '0 48px 120px rgba(226, 155, 69, 0.22)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 80px rgba(5,8,9,0.42)',
        'glass-light': '0 18px 40px rgba(39, 28, 12, 0.12)',
      },
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(135deg, #C97D2E 0%, #E29B45 45%, #F4D4AA 100%)',
        'gradient-primary-hover':
          'linear-gradient(135deg, #A56424 0%, #CC8733 48%, #EBC38F 100%)',
        'mesh-dark':
          'radial-gradient(1200px 720px at 12% -8%, rgba(226,155,69,0.18), transparent 58%), radial-gradient(900px 540px at 100% 0%, rgba(255,255,255,0.06), transparent 62%), linear-gradient(180deg, #0c0f10 0%, #121618 100%)',
        'mesh-light':
          'radial-gradient(1200px 720px at 12% -8%, rgba(226,155,69,0.10), transparent 58%), radial-gradient(900px 540px at 100% 0%, rgba(201,125,46,0.08), transparent 62%), linear-gradient(180deg, #fffdf8 0%, #f4efe6 100%)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px rgba(226, 155, 69, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(226, 155, 69, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
