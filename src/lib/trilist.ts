import { get } from 'svelte/store'

import { TrilistEvents, type TrilistChangeEvent } from './events'
import { createStateStore } from '../stores/state'
import { createValueStore } from '../stores/value'

export type TreeItemId = string | number

export interface TreeItem {
  id: TreeItemId
  key: string
  label: string
  children?: TreeItem[]
}

type TreeItemHook = (item: TreeItem) => string

type InputItem = Record<string, any>

export interface TrilistOptions {
  items: InputItem[]
  value?: TreeItemId[] | TreeItemId
  expanded?: string[]
  labelHook?: TreeItemHook
  multiple?: boolean
  leafs?: boolean
  fieldId?: string
  fieldLabel?: string
  fieldChildren?: string
}

export class Trilist {
  items: TreeItem[] = []
  el?: HTMLElement
  labelHook?: TreeItemHook

  multiple = false
  leafs = false
  fieldId = 'id'
  fieldLabel = 'label'
  fieldChildren = 'children'

  readonly expanded = createStateStore<string>()
  readonly hidden = createStateStore<string>()
  readonly indeterminate = createStateStore<string>()
  readonly selected = createStateStore<TreeItemId>()
  readonly value = createValueStore(this)

  init(el: HTMLElement, options: TrilistOptions) {
    this.el = el

    this.multiple = options.multiple === true
    this.leafs = options.leafs === true
    this.labelHook = options.labelHook

    if (options.fieldId) this.fieldId = options.fieldId
    if (options.fieldLabel) this.fieldLabel = options.fieldLabel
    if (options.fieldChildren) this.fieldChildren = options.fieldChildren

    this.setItems(options.items)
    this.setValue(options.value)
    this.expanded.set(options.expanded)

    return this.items
  }

  setItems(items: InputItem[]) {
    this.items = items.map((item) => this.processInputItem(item))
  }

  getValue() {
    return get(this.value)
  }

  setValue(value: TreeItemId[] | TreeItemId | null = null) {
    if (value === null) return

    this.selected.clear()
    this.indeterminate.clear()

    const ids = typeof value === 'object' ? value : [value]

    ids.forEach((id) => {
      const item = this.findItemById(id)
      this.toggleSelected(item!)
    })
  }

  toggleSelected(item: TreeItem, value = true) {
    if (this.multiple) {
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

  findItemById(id: TreeItemId, item?: TreeItem): TreeItem | null {
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

  dispatchChangeEvent() {
    const value = this.getValue()

    this.findHost(this.el!)?.dispatchEvent(
      new CustomEvent(TrilistEvents.change, {
        detail: this.multiple ? value : value.slice(0, 1).shift() ?? null
      }) satisfies TrilistChangeEvent
    )
  }

  protected filterDeep(item: TreeItem, query: string) {
    const matchLabel = item.label.toLowerCase().includes(query)
    const matchDeep = this.getChildrenDeep(item).some((item) =>
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

  protected findHost(el: Element | ShadowRoot): Element | null {
    if ('host' in el) {
      return el.host
    }

    return el.parentNode ? this.findHost(el.parentNode as Element) : null
  }

  protected processInputItem(item: InputItem, key = ''): TreeItem {
    const result: TreeItem = {
      id: item[this.fieldId],
      key: key ? key + '-' + item[this.fieldId] : item[this.fieldId].toString(),
      label: item[this.fieldLabel]
    }

    if (item[this.fieldChildren]) {
      result.children = (item[this.fieldChildren] as InputItem[]).map((child) =>
        this.processInputItem(child, result.key)
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

  protected getChildrenDeep(item: TreeItem) {
    if (!item.children) return []

    let result = item.children.map((item) => ({
      id: item.id,
      key: item.key,
      label: item.label
    }))

    item.children.forEach((child) => {
      result = [...result, ...this.getChildrenDeep(child)]
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
      if (this.multiple) {
        this.selected.setValue(item.id, false)
      }
      this.indeterminate.setValue(item.key, false)
    } else if (children.length > selected) {
      this.selected.setValue(item.id, false)
      this.indeterminate.setValue(item.key, true)
    } else if (children.length === selected) {
      if (this.multiple) {
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
