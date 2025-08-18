<script lang="ts">
  import { onMount, tick } from 'svelte'
  import css from '../theme/app.css?inline'

  export let host: HTMLElement

  const addShadowStyles = (styles: CSSStyleSheet) => {
    const parent = host.parentNode
    if (parent && parent instanceof ShadowRoot) {
      parent.adoptedStyleSheets = [styles]
    }
  }

  const addGlobalProperties = (styles: CSSStyleSheet) => {
    const globalStyles = new CSSStyleSheet()

    for (let rule of styles.cssRules) {
      if (rule instanceof CSSPropertyRule) {
        globalStyles.insertRule(rule.cssText)
      }
    }

    document.adoptedStyleSheets = [globalStyles]
  }

  onMount(async () => {
    await tick()

    const styles = new CSSStyleSheet()
    styles.replaceSync(css)

    addShadowStyles(styles)
    addGlobalProperties(styles)
  })
</script>
