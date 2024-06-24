import { get } from 'svelte/store'

import { TrilistEvents, type TrilistChangeEvent } from './events'
import { createStateStore } from '../stores/state'
import { createValueStore } from '../stores/value'

export type TreeItemId = string
export type TreeItemIdInput = string | number
export type TreeItemKey = string

export type TrilistValue = TreeItemId[] | TreeItemId | null
export type TrilistValueInput = TreeItemIdInput[] | TreeItemIdInput | null

export interface TreeItem {
  id: TreeItemId
  key: TreeItemKey
  label: string
  children?: TreeItem[]
  data: any
}

type TreeItemHook = (item: TreeItem) => string
type TrilistValueHook = (value: TrilistValue) => void

type InputItem = Record<string, any>

export interface TrilistOptions {
  items?: InputItem[]
  value?: TrilistValueInput
  disabled?: TrilistValueInput
  expandSelected?: boolean
  independent?: boolean
  leafs?: boolean
  multiselect?: boolean
  fieldId?: string
  fieldLabel?: string
  fieldChildren?: string
  labelHook?: TreeItemHook
  onChangeHook?: TrilistValueHook
}

export class Trilist {
  items: TreeItem[] = []
  el?: HTMLElement
  labelHook?: TreeItemHook
  onChangeHook?: TrilistValueHook

  independent = false
  leafs = false
  multiselect = false
  fieldId = 'id'
  fieldLabel = 'label'
  fieldChildren = 'children'

  readonly disabled = createStateStore<TreeItemId>()
  readonly expanded = createStateStore<TreeItemKey>()
  readonly hidden = createStateStore<TreeItemKey>()
  readonly indeterminate = createStateStore<TreeItemKey>()
  readonly selected = createStateStore<TreeItemId>()
  readonly value = createValueStore(this)

  init(el: HTMLElement, options: TrilistOptions): TreeItem[] {
    this.el = el

    this.independent = options.independent === true
    this.leafs = options.leafs === true
    this.multiselect = options.multiselect === true

    this.labelHook = options.labelHook
    this.onChangeHook = options.onChangeHook

    if (options.fieldId) this.fieldId = options.fieldId
    if (options.fieldLabel) this.fieldLabel = options.fieldLabel
    if (options.fieldChildren) this.fieldChildren = options.fieldChildren

    if (options.items?.length) {
      this.items = options.items.map((item) => this.processInputItem(item))
    }

    this.setDisabled(options.disabled)
    this.setValue(options.value)

    if (options.expandSelected) {
      const value = this.getValue()
      this.items.forEach((item) => this.setExpandSelectedDeep(item, value))
    }

    return this.items
  }

  getValue(): TreeItemId[] {
    return get(this.value)
  }

  setValue(value: TrilistValueInput = null): void {
    this.selected.clear()
    this.indeterminate.clear()

    if (value === null) return

    let ids = Array.isArray(value) ? value : [value]

    if (!this.multiselect) {
      ids = ids.slice(0, 1)
    }

    ids.forEach((id) => {
      const item = this.findItemById(id)
      if (item) {
        this.toggleSelected(item)
      }
    })
  }

  setDisabled(value: TrilistValueInput = null): void {
    if (value === null) return

    let ids = Array.isArray(value) ? value : [value]

    ids.forEach((id) => {
      const item = this.findItemById(id)
      if (item) {
        this.disabled.setValue(item.id)
        item?.children?.forEach((child) => this.disabled.setValue(child.id))
      }
    })
  }

  toggleSelected(item: TreeItem, value = true): void {
    if (get(this.disabled).has(item.id)) return

    if (this.multiselect) {
      if (this.independent) {
        this.selected.setValue(item.id, value)
      } else {
        this.setSelectedDeep(item, value)
      }
    } else {
      if (value) {
        this.selected.set([item.id])
      } else {
        this.selected.clear()
      }
    }

    this.items.forEach((item) => this.processStateDeep(item))
  }

  toggleExpanded(item: TreeItem, value = true): void {
    this.expanded.setValue(item.key, value)
  }

  expandAll(): void {
    this.items.forEach((item) => this.setExpandDeep(item, true))
  }

  collapseAll(): void {
    this.expanded.clear()
  }

  filter(query: string): void {
    this.hidden.clear()

    if (!query || query.length < 2) {
      return
    }

    this.items.forEach((item) => this.filterDeep(item, query.toLowerCase()))
  }

  findItemById(id: TreeItemId | number, item?: TreeItem): TreeItem | null {
    const sid = id.toString()

    if (item && item.id === sid) {
      return item
    }

    const elements = !item ? this.items : item.children ?? []

    for (const el of elements) {
      const result = this.findItemById(sid, el)
      if (result) {
        return result
      }
    }

    return null
  }

  getItemLabel(item: TreeItem): string {
    return this.labelHook ? this.labelHook(item) : item.label
  }

  dispatchChangeEvent(): void {
    const value = this.getValue()
    const detail = this.multiselect ? value : value.slice(0, 1).shift() ?? null

    if (this.onChangeHook) {
      this.onChangeHook(detail)
    }

    /* c8 ignore next 5 */
    this.findHost(this.el!)?.dispatchEvent(
      new CustomEvent(TrilistEvents.change, {
        detail,
      }) satisfies TrilistChangeEvent,
    )
  }

  protected filterDeep(item: TreeItem, query: string) {
    const matchLabel = item.label.toLowerCase().includes(query)
    const matchDeep = this.getChildrenDeep(item).some((item) =>
      item.label.toLowerCase().includes(query),
    )

    if (!matchLabel && !matchDeep) {
      this.hidden.setValue(item.key)
    }

    // expand category matched by children
    if (matchDeep) {
      this.toggleExpanded(item)
    }

    // don't filter out children if category matched by label
    if (!matchLabel && item.children?.length) {
      item.children?.forEach((child) => this.filterDeep(child, query))
    }
  }

  protected findHost(el: Element | ShadowRoot): Element | null {
    /* c8 ignore next 3 */
    if ('host' in el) {
      return el.host
    }

    return el.parentNode ? this.findHost(el.parentNode as Element) : null
  }

  protected processInputItem(item: InputItem, key = ''): TreeItem {
    const { [this.fieldChildren]: _, ...data } = item // get data without children

    const result: TreeItem = {
      id: item[this.fieldId].toString(),
      key: key ? key + '.' + item[this.fieldId] : item[this.fieldId].toString(),
      label: item[this.fieldLabel],
      data,
    }

    if (item[this.fieldChildren] && item[this.fieldChildren].length) {
      result.children = (item[this.fieldChildren] as InputItem[]).map((child) =>
        this.processInputItem(child, result.key),
      )
    }

    return result
  }

  protected setExpandDeep(item: TreeItem, value = true) {
    if (item.children?.length) {
      this.toggleExpanded(item, value)
    }

    item.children?.forEach((child) => this.setExpandDeep(child, value))
  }

  protected setExpandSelectedDeep(item: TreeItem, value: TreeItemId[]) {
    if (this.getChildrenDeep(item).some((item) => value.includes(item.id))) {
      this.toggleExpanded(item)
    }

    item.children?.forEach((child) => this.setExpandSelectedDeep(child, value))
  }

  protected setSelectedDeep(item: TreeItem, value = true) {
    if (get(this.disabled).has(item.id)) return

    this.selected.setValue(item.id, value)

    item.children?.forEach((child) => this.setSelectedDeep(child, value))
  }

  protected getChildrenDeep(item: TreeItem, leafs = false) {
    if (!item.children?.length) return []

    let result = item.children
      .filter((item) => (leafs ? !item.children?.length : true))
      .map((item) => ({
        id: item.id,
        key: item.key,
        label: item.label,
      }))

    item.children.forEach((child) => {
      result = [...result, ...this.getChildrenDeep(child, leafs)]
    })

    return result
  }

  protected processStateDeep(item: TreeItem) {
    if (!item.children?.length) return

    const selected = get(this.selected)
    const children = this.getChildrenDeep(item, this.multiselect)
    const selectedChildren = children.filter((el) => selected.has(el.id)).length

    if (this.independent) {
      this.indeterminate.setValue(
        item.key,
        !!selectedChildren && !selected.has(item.id),
      )
    } else {
      if (!selectedChildren) {
        if (this.multiselect) {
          this.selected.setValue(item.id, false)
        }
        this.indeterminate.setValue(item.key, false)
      } else if (children.length === selectedChildren) {
        if (this.multiselect) {
          this.selected.setValue(item.id, true)
          this.indeterminate.setValue(item.key, false)
        } else {
          this.selected.setValue(item.id, false)
          this.indeterminate.setValue(item.key, true)
        }
      } else {
        this.selected.setValue(item.id, false)
        this.indeterminate.setValue(item.key, true)
      }
    }

    item.children?.forEach((child) => this.processStateDeep(child))
  }
}
