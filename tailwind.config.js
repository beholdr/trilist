const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'trilist-primary':
          'var(--trilist-color-primary, ' + colors.blue[600] + ')',
        'trilist-secondary':
          'var(--trilist-color-secondary, ' + colors.gray[200] + ')',
        'trilist-input': 'var(--trilist-color-input, ' + colors.white + ')',
        'trilist-modal': 'var(--trilist-color-modal, ' + colors.white + ')',
        'trilist-gray': 'var(--trilist-color-gray, ' + colors.gray[400] + ')',
        'trilist-gray-alt':
          'var(--trilist-color-gray-alt, ' + colors.gray[500] + ')'
      },
      borderRadius: {
        DEFAULT:
          'var(--trilist-border-radius, ' + defaultTheme.borderRadius.md + ')'
      },
      fontSize: {
        base: 'var(--trilist-text-base, 16px)',
        sm: 'var(--trilist-text-sm, 14px)'
      }
    }
  },

  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')]
}
