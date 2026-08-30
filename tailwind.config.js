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
          DEFAULT: '#1A1F2B',
          dark: '#11151E',
          light: '#252C3D',
          border: '#2E374D',
        },
        cream: {
          DEFAULT: '#FBF9F5',
          dark: '#F3EFE6',
          card: '#FFFFFF',
          border: '#E8E2D5',
        },
        brand: {
          yellow: '#F5B719',
          green: '#20AC69',
          red: '#F0534C',
          blue: '#3C6EE6',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'book-3d': '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04), -5px 0 15px -3px rgba(0,0,0,0.1)',
        'floating': '0 30px 60px -12px rgba(26, 31, 43, 0.25)',
      }
    },
  },
  plugins: [],
}
