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
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#EA580C',
          light: '#F97316',
          dark: '#C2410C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        accent: {
          DEFAULT: '#FACC15',
          light: '#FDE68A',
          dark: '#EAB308',
        },
        dark: {
          0: '#020617',
          1: '#0f172a',
          2: '#1e293b',
          3: '#334155',
        },
        light: {
          0: '#ffffff',
          1: '#f8fafc',
          2: '#f1f5f9',
          3: '#e2e8f0',
        },
      },
      borderRadius: {
        '2xl': '16px',
        'xl': '12px',
        'lg': '8px',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(234, 88, 12, 0.2)',
        'glow': '0 0 30px rgba(234, 88, 12, 0.3)',
        'glow-lg': '0 0 60px rgba(234, 88, 12, 0.2)',
        'glass': 'inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 38px rgba(2,6,23,0.42)',
        'glass-light': '0 1px 10px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #EA580C, #F97316, #FACC15)',
        'gradient-primary-hover': 'linear-gradient(135deg, #C2410C, #EA580C, #EAB308)',
        'mesh-dark': 'radial-gradient(1100px 600px at 15% -10%, rgba(234,88,12,0.18), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(249,115,22,0.12), transparent 65%)',
        'mesh-light': 'radial-gradient(1100px 600px at 15% -10%, rgba(234,88,12,0.06), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(249,115,22,0.04), transparent 65%)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(234, 88, 12, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
