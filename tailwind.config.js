/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef1f6',
          100: '#d6dde9',
          200: '#adbbd3',
          300: '#8499bd',
          400: '#5b77a7',
          500: '#3a5687',
          600: '#24406e',
          700: '#182e52',
          800: '#101f3a',
          900: '#0b1730',
          950: '#070f1f',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faeec9',
          200: '#f4dc98',
          300: '#edc561',
          400: '#e6af38',
          500: '#d99a22',
          600: '#b87a1a',
          700: '#935c18',
          800: '#78491a',
          900: '#663d1a',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(11 23 48 / 0.06), 0 1px 3px 0 rgb(11 23 48 / 0.08)',
        panel: '0 4px 16px -4px rgb(11 23 48 / 0.12), 0 2px 6px -2px rgb(11 23 48 / 0.08)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
