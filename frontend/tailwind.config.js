/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255,255,255,0.2)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.24)',
      },
    },
  },
  plugins: [],
};
