import { get } from 'svelte/store'
import { createExpandedStore } from '../stores/expanded'
import { createIndeterminateStore } from '../stores/indeterminate'
import { createSelectedStore } from '../stores/selected'

export type TreeItemId = string | number

interface OptionItem {
  id: TreeItemId
  label: string
  children?: OptionItem[]
}

export interface ComponentOptions {
  items: OptionItem[]
  selected?: TreeItemId[]
  expanded?: string[]
  labelHook?: (item: TreeItem) => string
}

export interface TreeItem extends OptionItem {
  key: string
  children?: TreeItem[]
}

export class Tree {
  items: TreeItem[] = []
  options: ComponentOptions

  expanded = createExpandedStore()
  indeterminate = createIndeterminateStore()
  selected = createSelectedStore()

  constructor(options: ComponentOptions) {
    this.options = options
    this.items = options.items.map((item) => this.processData(item))

    if (options.selected?.length) {
      this.selected.set(options.selected)
      this.items.forEach((item) => this.setIndeterminateDeep(item))
    }

    this.expanded.set(options.expanded)
  }

  toggleSelected(item: TreeItem, value = true) {
    this.setSelectedDeep(item, value)
    this.items.forEach((item) => this.setIndeterminateDeep(item))
  }

  setExpandDeep(item: TreeItem, value = true) {
    if (item.children) {
      this.expanded.setExpanded(item.key, value)
    }

    item.children?.forEach((child) => this.setExpandDeep(child, value))
  }

  toggleExpanded(item: TreeItem, value = true) {
    this.expanded.setExpanded(item.key, value)
  }

  expandAll() {
    this.items.forEach((item) => this.setExpandDeep(item, true))
  }

  collapseAll() {
    this.items.forEach((item) => this.setExpandDeep(item, false))
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

  protected setSelectedDeep(item: TreeItem, value = true) {
    this.selected.setSelected(item.id, value)

    item.children?.forEach((child) => this.setSelectedDeep(child, value))
  }

  protected getChildrenDeep(item: TreeItem) {
    if (!item.children) return []

    let result = item.children
      .filter((child) => !child.children?.length)
      .map((child) => child.id)

    item.children.forEach((child) => {
      result = [...result, ...this.getChildrenDeep(child)]
    })

    return result
  }

  protected setIndeterminateDeep(item: TreeItem) {
    if (!item.children) return

    const selectedItems = get(this.selected)
    const children = this.getChildrenDeep(item)
    const selected = children.filter((id) => selectedItems.has(id)).length

    if (!selected) {
      this.selected.setSelected(item.id, false)
      this.indeterminate.setIndeterminate(item.key, false)
    } else if (children.length > selected) {
      this.selected.setSelected(item.id, false)
      this.indeterminate.setIndeterminate(item.key, true)
    } else if (children.length === selected) {
      this.selected.setSelected(item.id, true)
      this.indeterminate.setIndeterminate(item.key, false)
    }

    item.children?.forEach((item) => this.setIndeterminateDeep(item))
  }
}
