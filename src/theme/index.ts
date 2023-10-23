import styles from './app.postcss?inline'

// TODO: add customization via vars

const prepareStyles = (styles: string, root: string) => {
  return styles
    .replaceAll(/html ?{/g, ':host{')
    .replaceAll(/body ?{/g, `${root}{`)
}

export const getStyles = (root = 'main') =>
  `<style>${prepareStyles(styles, root)}</style>`
