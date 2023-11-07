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
        'trilist-input': `var(--trilist-colors-input, ${colors.gray[400]})`,
        'trilist-icon': `var(--trilist-colors-icon, ${colors.gray[400]})`,
        'trilist-hover': `var(--trilist-colors-hover, ${colors.gray[500]})`,
        'trilist-focus': `var(--trilist-colors-focus, ${colors.blue[600]})`,
        'trilist-fone': `var(--trilist-colors-fone, ${colors.white})`
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
