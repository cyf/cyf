/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/*.pug'],
  prefix: '',
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
