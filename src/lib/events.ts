export const dispatch = (component: HTMLElement, type: string, detail: any) => {
  if (component.parentNode && 'host' in component.parentNode) {
    const host = component.parentNode.host as HTMLElement
    host.dispatchEvent(new CustomEvent(type, { detail }))
  }
}
