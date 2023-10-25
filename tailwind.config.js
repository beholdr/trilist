const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        primary: 'var(--trilist-color-primary, ' + colors.blue[600] + ')',
        linecolor: 'var(--trilist-color-linecolor, ' + colors.gray[400] + ')',
        linecolor2: 'var(--trilist-color-linecolor2, ' + colors.gray[500] + ')'
      },
      borderRadius: {
        DEFAULT:
          'var(--trilist-border-radius, ' +
          defaultTheme.borderRadius.DEFAULT +
          ')'
      }
    }
  },

  plugins: [require('@tailwindcss/forms')]
}
