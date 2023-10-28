import { get } from 'svelte/store'

import { TrilistEvents, type TrilistChangeEvent } from './events'

import { createStateStore } from '../stores/state'
import { createValueStore } from '../stores/value'

export type TreeItemKey = string | number

type TreeItemHook = (item: TreeItem) => string

interface OptionItem {
  id: TreeItemKey
  label: string
  children?: OptionItem[]
}

export interface TrilistOptions {
  items: OptionItem[]
  selected?: TreeItemKey[]
  expanded?: TreeItemKey[]
  labelHook?: TreeItemHook
}

export interface TreeItem extends OptionItem {
  key: TreeItemKey
  children?: TreeItem[]
}

export class Trilist {
  el: HTMLElement | undefined
  items: TreeItem[] = []
  multiselect = false
  leafs = false
  labelHook: TreeItemHook | undefined

  readonly expanded = createStateStore()
  readonly hidden = createStateStore()
  readonly indeterminate = createStateStore()
  readonly selected = createStateStore()
  readonly value = createValueStore(this)

  init(
    options: TrilistOptions,
    el: HTMLElement,
    multiselect = false,
    leafs = false
  ) {
    this.items = options.items.map((item) => this.processData(item))

    this.el = el
    this.multiselect = multiselect
    this.leafs = leafs
    this.labelHook = options.labelHook

    if (options.selected) {
      this.setValue(options.selected)
    }

    this.expanded.set(options.expanded)

    return this.items
  }

  toggleSelected(item: TreeItem, value = true) {
    if (this.multiselect) {
      this.setSelectedDeep(item, value)
    } else {
      if (value) {
        this.selected.set([item.id])
      } else {
        this.selected.clear()
      }
    }

    this.items.forEach((item) => this.setIndeterminateDeep(item))
  }

  toggleExpanded(item: TreeItem, value = true) {
    this.expanded.setValue(item.key, value)
  }

  expandAll() {
    this.items.forEach((item) => this.setExpandDeep(item, true))
  }

  collapseAll() {
    this.expanded.clear()
  }

  filter(query: string) {
    this.hidden.clear()

    if (!query || query.length < 2) {
      return
    }

    this.items.forEach((item) => this.filterDeep(item, query.toLowerCase()))
  }

  findItemById(id: TreeItemKey, item?: TreeItem): TreeItem | null {
    if (item && item.id === id) {
      return item
    }

    const elements = !item ? this.items : item.children ?? []

    for (const el of elements) {
      const result = this.findItemById(id, el)
      if (result) {
        return result
      }
    }

    return null
  }

  getLabel(item: TreeItem) {
    return this.labelHook ? this.labelHook(item) : item.label
  }

  getValue() {
    return get(this.value)
  }

  setValue(value: TreeItemKey[]) {
    this.selected.clear()
    this.indeterminate.clear()

    const ids = this.multiselect ? value : value.slice(0, 1)

    ids.forEach((id) => {
      const item = this.findItemById(id)
      this.toggleSelected(item!)
    })
  }

  dispatchChangeEvent() {
    this.findHost(this.el!)?.dispatchEvent(
      new CustomEvent(TrilistEvents.change, {
        detail: this.getValue()
      }) satisfies TrilistChangeEvent
    )
  }

  protected filterDeep(item: TreeItem, query: string) {
    const matchLabel = item.label.toLowerCase().includes(query)
    const matchDeep = this.getChildrenDeep(item, true).some((item) =>
      item.label.toLowerCase().includes(query)
    )

    if (!matchLabel && !matchDeep) {
      this.hidden.setValue(item.key)
    }

    // expand category matched by children
    if (matchDeep) {
      this.expanded.setValue(item.key)
    }

    // don't filter out children if category matched by label
    if (!matchLabel && item.children?.length) {
      item.children?.forEach((child) => this.filterDeep(child, query))
    }
  }

  protected recursiveDeepCopy(obj: any): any {
    return Object.keys(obj).reduce(
      (v, d) =>
        Object.assign(v, {
          [d]:
            obj[d].constructor === Object
              ? this.recursiveDeepCopy(obj[d])
              : obj[d]
        }),
      {}
    )
  }

  protected findHost(el: Element | ShadowRoot): Element | null {
    if ('host' in el) {
      return el.host
    }

    return el.parentNode ? this.findHost(el.parentNode as Element) : null
  }

  protected processData(item: OptionItem, key = '') {
    const result = this.recursiveDeepCopy(item)
    result.key = key ? key + '-' + result.id : result.id.toString()

    if (result.children) {
      result.children = result.children.map((child: TreeItem) =>
        this.processData(child, result.key)
      )
    }

    return result
  }

  protected setExpandDeep(item: TreeItem, value = true) {
    if (item.children) {
      this.expanded.setValue(item.key, value)
    }

    item.children?.forEach((child) => this.setExpandDeep(child, value))
  }

  protected setSelectedDeep(item: TreeItem, value = true) {
    this.selected.setValue(item.id, value)

    item.children?.forEach((child) => this.setSelectedDeep(child, value))
  }

  protected getChildrenDeep(item: TreeItem, withParents = false) {
    if (!item.children) return []

    let result = withParents
      ? item.children.map((item) => ({
          id: item.id,
          key: item.key,
          label: item.label
        }))
      : item.children.filter((child) => !child.children?.length)

    item.children.forEach((child) => {
      result = [...result, ...this.getChildrenDeep(child, withParents)]
    })

    return result
  }

  protected setIndeterminateDeep(item: TreeItem) {
    if (!item.children) return

    const selectedStore = get(this.selected)
    const children = this.getChildrenDeep(item)
    const selected = children.filter((el) => selectedStore.has(el.id)).length

    if (!selected) {
      // to correct cleanup of previous selected parent on single selection mode
      if (this.multiselect) {
        this.selected.setValue(item.id, false)
      }
      this.indeterminate.setValue(item.key, false)
    } else if (children.length > selected) {
      this.selected.setValue(item.id, false)
      this.indeterminate.setValue(item.key, true)
    } else if (children.length === selected) {
      if (this.multiselect) {
        this.selected.setValue(item.id, true)
        this.indeterminate.setValue(item.key, false)
      } else {
        this.selected.setValue(item.id, false)
        this.indeterminate.setValue(item.key, true)
      }
    }

    item.children?.forEach((child) => this.setIndeterminateDeep(child))
  }
}
