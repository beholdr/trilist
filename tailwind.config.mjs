const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'trilist-color-accent': `var(--trilist-color-accent, ${colors.blue[600]})`,
        'trilist-color-bg-primary': `var(--trilist-color-bg-primary, ${colors.white})`,
        'trilist-color-bg-secondary': `var(--trilist-color-bg-secondary, ${colors.gray[100]})`,
        'trilist-color-border-primary': `var(--trilist-color-border-primary, ${colors.gray[300]})`,
        'trilist-color-border-secondary': `var(--trilist-color-border-secondary, ${colors.gray[200]})`,
        'trilist-color-text-primary': `var(--trilist-color-text-primary, ${colors.black})`,
        'trilist-color-text-secondary': `var(--trilist-color-text-secondary, ${colors.gray[500]})`,
        'trilist-color-text-tertiary': `var(--trilist-color-text-tertiary, ${colors.gray[400]})`,
        'trilist-color-text-inversed': `var(--trilist-color-text-inversed, ${colors.white})`,
      },
      borderRadius: {
        DEFAULT: `var(--trilist-border-radius, ${defaultTheme.borderRadius.md})`,
        sm: `var(--trilist-border-radius-sm, ${defaultTheme.borderRadius.sm})`,
      },
      fontSize: {
        base: `var(--trilist-text-base, 16px)`,
        sm: `var(--trilist-text-sm, 14px)`,
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('tailwindcss-animate'),
  ],
}
