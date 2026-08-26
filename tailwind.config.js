/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155'
        },
        risk: {
          low: '#22C55E', // Green
          medium: '#EAB308', // Yellow
          high: '#F97316', // Orange
          critical: '#EF4444' // Red
        }
      }
    },
  },
  plugins: [],
}
