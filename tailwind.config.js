/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: '#F7F7F7', // Off-white instead of pure white
        black: '#0B0B0D', // Near-black instead of pure black
        gray: {
          50: '#F7F7F7',
          100: '#EFEFEF',
          200: '#E2E2E2',
          300: '#D1D1D1',
          400: '#B0B0B0',
          500: '#8F8F8F',
          600: '#6E6E6E',
          700: '#4D4D4D',
          800: '#2C2C2C',
          900: '#0B0B0D',
        },
      },
      fontSize: {
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
      },
      lineHeight: {
        relaxed: '1.75',
        loose: '2',
      },
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },
    },
  },
  plugins: [],
};
