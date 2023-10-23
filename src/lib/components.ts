export enum EventName {
  connect = 'connect',
  select = 'select'
}

export const extendElement = (ceConstructor: any) =>
  class extends ceConstructor {
    async connectedCallback() {
      await super.connectedCallback()
      this.dispatchEvent(
        new CustomEvent(EventName.connect, { detail: { el: this } })
      )
    }
  }

const findHost = (el: Element | ShadowRoot): Element | null => {
  if ('host' in el) {
    return el.host
  }

  return el.parentNode ? findHost(el.parentNode as Element) : null
}

export const dispatch = (el: HTMLElement, type: EventName, detail: any) => {
  findHost(el)?.dispatchEvent(new CustomEvent(type, { detail }))
}
