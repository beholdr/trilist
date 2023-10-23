export const extendElement = (ceConstructor: any) =>
  class extends ceConstructor {
    async connectedCallback() {
      await super.connectedCallback()
      this.dispatchEvent(new CustomEvent('connect', { detail: { el: this } }))
    }
  }

export const dispatch = (component: HTMLElement, type: string, detail: any) => {
  if (component.parentNode && 'host' in component.parentNode) {
    const host = component.parentNode.host as HTMLElement
    host.dispatchEvent(new CustomEvent(type, { detail }))
  }
}
