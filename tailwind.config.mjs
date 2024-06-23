const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'trilist-accent': `var(--trilist-colors-accent, ${colors.blue[600]})`,
        'trilist-tag': `var(--trilist-colors-tag, ${colors.gray[100]})`,
        'trilist-tag-border': `var(--trilist-colors-tag-border, ${colors.gray[200]})`,
        'trilist-tag-text': `var(--trilist-colors-tag-text, ${colors.blue[600]})`,
        'trilist-input': `var(--trilist-colors-input, ${colors.gray[400]})`,
        'trilist-icon': `var(--trilist-colors-icon, ${colors.gray[400]})`,
        'trilist-hover': `var(--trilist-colors-hover, ${colors.gray[500]})`,
        'trilist-text': `var(--trilist-colors-text, ${colors.black})`,
        'trilist-fone': `var(--trilist-colors-fone, ${colors.white})`
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
