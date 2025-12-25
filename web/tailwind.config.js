/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: '#0E7C86',
        yellow: '#F4C430',
        red: '#E84A4A',
        blue: '#2176FF',
        primary: '#0E7C86',
        secondary: '#F4C430',
        accent: '#2176FF',
      },
    },
  },
  plugins: [],
}

