/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nacre-light': '#FDFBF7', // Crema muy claro
        'nacre-gold': '#D4AF37',  // Dorado
        'nacre-dark': '#2C2C2C',  // Gris oscuro casi negro
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}