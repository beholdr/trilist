const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'tri-primary': 'var(--trilist-color-primary, ' + colors.blue[600] + ')',
        'tri-text': 'var(--trilist-color-text, ' + colors.gray[800] + ')',
        'tri-gray': 'var(--trilist-color-lines, ' + colors.gray[400] + ')',
        'tri-gray-darker':
          'var(--trilist-color-lines-darker, ' + colors.gray[500] + ')'
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
