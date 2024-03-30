/* eslint-disable unicorn/prefer-module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/ts/*.ts',
    './src/**/*.{html, css, js, ts}',
    './src/docs/milestone-1/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'custom-green-title': 'hsla(74, 32%, 76%, 1)',
        'custom-green-white-accent': 'hsla(67, 50%, 86%, 1)',
        'custom-background-color': 'hsla(52, 94%, 94%, 1)',
        'custom-cream-accent': 'hsla(43, 82%, 89%, 1)',
        'custom-brown-heading': 'hsla(30, 53%, 64%, 1)'
      }
    }
  }
};
