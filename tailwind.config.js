/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cad: {
          red: '#D20A0B',
          redHover: '#B50809',
          navy: '#15304C',
          navyDark: '#0F2038',
          blue: '#15304C',
          blueHover: '#0F2038',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          cardAlt: '#F1F5F9',
          border: '#E2E8F0',
          borderDark: '#CBD5E1',
          text: '#0F172A',
          textMuted: '#64748B',
          textDim: '#94A3B8',
          accent: '#D20A0B',
          emerald: '#00873D',
          amber: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Arial', 'Verdana', 'sans-serif'],
        mono: ['Arial', 'Verdana', 'sans-serif'],
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.85)', opacity: '0.6' },
          '100%': { transform: 'scale(1.45)', opacity: '0' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        ripple: 'ripple 3s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        heartbeat: 'heartbeat 4s ease-in-out infinite',
        rotateSlow: 'rotateSlow 30s linear infinite',
      },
    },
  },
  plugins: [],
}
