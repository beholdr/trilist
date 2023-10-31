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
        'trilist-primary-text':
          'var(--trilist-color-primary-text, ' + colors.white + ')',
        'trilist-secondary':
          'var(--trilist-color-secondary, ' + colors.gray[200] + ')',
        'trilist-input-border':
          'var(--trilist-color-input-border, ' + colors.gray[400] + ')',
        'trilist-input-focus':
          'var(--trilist-color-input-focus, ' + colors.blue[600] + ')',
        'trilist-input-fone':
          'var(--trilist-color-input-fone, ' + colors.white + ')',
        'trilist-modal-fone':
          'var(--trilist-color-modal-fone, ' + colors.white + ')',
        'trilist-icon': 'var(--trilist-color-icon, ' + colors.gray[400] + ')',
        'trilist-icon-hover':
          'var(--trilist-color-icon-hover, ' + colors.gray[500] + ')'
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

  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('tailwindcss-animate')
  ]
}
