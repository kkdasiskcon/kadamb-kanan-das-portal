/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#EA580C',
          600: '#D97706',
          700: '#C2410C',
        },
        navy: {
          800: '#1E293B',
          900: '#0F172A',
          950: '#090D16',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        signature: ['Alex Brush', 'cursive']
      }
    },
  },
  plugins: [],
}
