export enum TrilistEvents {
  cancel = 'cancel',
  connect = 'connect',
  select = 'select'
}

export const extendElement = (ceConstructor: any) =>
  class extends ceConstructor {
    async connectedCallback() {
      await super.connectedCallback()
      this.dispatchEvent(
        new CustomEvent(TrilistEvents.connect, { detail: { el: this } })
      )
    }
  }

const findHost = (el: Element | ShadowRoot): Element | null => {
  if ('host' in el) {
    return el.host
  }

  return el.parentNode ? findHost(el.parentNode as Element) : null
}

export const dispatchOut = (el: HTMLElement, event: CustomEvent) => {
  findHost(el)?.dispatchEvent(event)
}
