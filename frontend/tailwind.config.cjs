/* eslint-disable unicorn/prefer-module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{html, css, js}',
    './src/docs/milestone-1/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        'color-light': 'var(--color-light)',
        'color-dark': 'var(--color-dark)',
        'accent-primary': 'var(--accent-primary)',
        'accent-primary-state': 'var(--accent-primary-state)'
      }
    }
  }
};
