import { get } from 'svelte/store'
import { createDataStore } from '../stores/data'

export type TreeItemKey = string | number

interface OptionItem {
  id: TreeItemKey
  label: string
  children?: OptionItem[]
}

export interface ComponentOptions {
  items: OptionItem[]
  selected?: TreeItemKey[]
  expanded?: TreeItemKey[]
  multiselect?: boolean
  labelHook?: (item: TreeItem) => string
}

export interface TreeItem extends OptionItem {
  key: TreeItemKey
  children?: TreeItem[]
}

export class Tree {
  protected items: TreeItem[] = []
  protected options: ComponentOptions | undefined
  protected query = ''

  readonly expanded = createDataStore()
  readonly hidden = createDataStore()
  readonly indeterminate = createDataStore()
  readonly selected = createDataStore()

  init(options: ComponentOptions) {
    this.options = options
    this.items = options.items.map((item) => this.processData(item))

    if (options.selected?.length) {
      if (this.options.multiselect) {
        this.selected.set(options.selected)
      } else {
        // select first option
        this.selected.set([options.selected[0]])
      }

      this.items.forEach((item) => this.setIndeterminateDeep(item))
    }

    this.expanded.set(options.expanded)

    return this.items
  }

  getItemLabel(item: TreeItem) {
    return this.options?.labelHook ? this.options?.labelHook(item) : item.label
  }

  toggleSelected(item: TreeItem, value = true) {
    if (this.options?.multiselect) {
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
    this.query = query.toLowerCase()

    this.hidden.clear()

    if (!query || query.length < 2) {
      return
    }

    this.items.forEach((item) => this.filterDeep(item))
  }

  protected filterDeep(item: TreeItem) {
    const matchLabel = item.label.toLowerCase().includes(this.query)
    const matchDeep = this.getChildrenDeep(item, true).some((item) =>
      item.label.toLowerCase().includes(this.query)
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
      item.children?.forEach((child) => this.filterDeep(child))
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
      this.indeterminate.setValue(item.key, false)
    } else if (children.length > selected) {
      this.selected.setValue(item.id, false)
      this.indeterminate.setValue(item.key, true)
    } else if (children.length === selected) {
      this.selected.setValue(item.id, true)
      this.indeterminate.setValue(item.key, false)
    }

    item.children?.forEach((child) => this.setIndeterminateDeep(child))
  }
}
