/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9fd',
          100: '#e0f2f9',
          200: '#bae2f2',
          300: '#7cc9e6',
          400: '#36add5',
          500: '#1491bc',
          600: '#0078a1',
          700: '#006085',
          800: '#004b79', // Dark Blue from logo
          900: '#033f67',
        },
        secondary: {
          50: '#f0fcfc',
          100: '#daf8f8',
          200: '#b8eff0',
          300: '#83e2e4',
          400: '#45d1d3', // Teal from logo
          500: '#27b6b9',
          600: '#1d9398',
          700: '#1a767b',
          800: '#195e63',
          900: '#174e53',
        }
      },
    },
  },
  plugins: [],
};
