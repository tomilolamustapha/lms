/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./views/**/*.{pug, html}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      'primary': '#6237A0',
      'light': '#DEACF5',
      'medium': '#9754CB',
      'dark': '#28104E',
    },
    extend: {},
  },
  plugins: [],
}

