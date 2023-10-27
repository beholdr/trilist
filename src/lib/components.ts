export enum TrilistEvents {
  cancel = 'cancel',
  select = 'select'
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
