const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'trilist-primary': `var(--trilist-colors-primary, ${colors.blue[600]})`,
        'trilist-secondary': `var(--trilist-colors-secondary, ${colors.gray[200]})`,
        'trilist-input-border': `var(--trilist-colors-input-border, ${colors.gray[400]})`,
        'trilist-input-focus': `var(--trilist-colors-input-focus, ${colors.blue[600]})`,
        'trilist-input-fone': `var(--trilist-colors-input-fone, ${colors.white})`,
        'trilist-modal-fone': `var(--trilist-colors-modal-fone, ${colors.white})`,
        'trilist-icon': `var(--trilist-colors-icon, ${colors.gray[400]})`,
        'trilist-icon-hover': `var(--trilist-colors-icon-hover, ${colors.gray[500]})`
      },
      borderRadius: {
        DEFAULT: `var(--trilist-border-radius, ${defaultTheme.borderRadius.md})`
      },
      fontSize: {
        base: `var(--trilist-text-base, 16px)`,
        sm: `var(--trilist-text-sm, 14px)`
      }
    }
  },

  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('tailwindcss-animate')
  ]
}
