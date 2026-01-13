/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'SF Pro Text', 'Inter', 'sans-serif']
      },
      colors: {
        primary: {
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3'
        },
        accent: {
          500: '#06b6d4',
          600: '#0891b2'
        },
        surface: {
          light: '#ffffff',
          dark: '#020617'
        }
      }
    }
  },
  plugins: []
};


