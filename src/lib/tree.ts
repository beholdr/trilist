import { get } from 'svelte/store'
import { selectedStore } from '../stores/selected'
import { indeterminateStore } from '../stores/indeterminate'
import { expandedStore } from '../stores/expanded'

export type TreeItemId = string | number

// TODO: configurable `id` and `label` fields
export interface OptionItem {
  id: TreeItemId
  label: string
  children?: OptionItem[]
}

export interface TreeItem extends OptionItem {
  key: string
  children?: TreeItem[]
}

let tree: TreeItem[] = []

const recursiveDeepCopy = (obj: any): any =>
  Object.keys(obj).reduce(
    (v, d) =>
      Object.assign(v, {
        [d]: obj[d].constructor === Object ? recursiveDeepCopy(obj[d]) : obj[d]
      }),
    {}
  )

const processData = (item: OptionItem, key = '') => {
  const result = recursiveDeepCopy(item)
  result.key = key ? key + '-' + result.id : result.id.toString()

  if (result.children) {
    result.children = result.children.map((child: TreeItem) =>
      processData(child, result.key)
    )
  }

  return result
}

const init = (
  options: OptionItem[],
  selected: TreeItemId[] = [],
  expanded: string[] = []
) => {
  tree = options.map((item) => processData(item))

  // TODO: unify item / item.id / item.key arguments?

  if (selected.length) {
    // selected.forEach(item => toggleSelected(item, true))
    selectedStore.set(new Set(selected))
    tree.forEach(setIndeterminateDeep)
  }
  expandedStore.set(new Set(expanded))

  return tree
}

const setSelectedDeep = (item: TreeItem, value = true) => {
  selectedStore.setSelected(item.id, value)

  item.children?.forEach((child) => setSelectedDeep(child, value))
}

const getChildrenDeep = (item: TreeItem) => {
  if (!item.children) return []

  let result = item.children
    .filter((child) => !child.children?.length)
    .map((child) => child.id)

  item.children.forEach((child) => {
    result = [...result, ...getChildrenDeep(child)]
  })

  return result
}

const setIndeterminateDeep = (item: TreeItem) => {
  if (!item.children) return

  const selectedItems = get(selectedStore)
  const children = getChildrenDeep(item)
  const selected = children.filter((id) => selectedItems.has(id)).length

  if (!selected) {
    selectedStore.setSelected(item.id, false)
    indeterminateStore.setIndeterminate(item.key, false)
  } else if (children.length > selected) {
    selectedStore.setSelected(item.id, false)
    indeterminateStore.setIndeterminate(item.key, true)
  } else if (children.length === selected) {
    selectedStore.setSelected(item.id, true)
    indeterminateStore.setIndeterminate(item.key, false)
  }

  item.children?.forEach(setIndeterminateDeep)
}

const toggleSelected = (item: TreeItem, value = true) => {
  setSelectedDeep(item, value)
  tree.forEach(setIndeterminateDeep)
}

const setExpandDeep = (item: TreeItem, value = true) => {
  if (item.children) {
    expandedStore.setExpanded(item.key, value)
  }

  item.children?.forEach((child) => setExpandDeep(child, value))
}

const toggleExpanded = (key: string, value = true) => {
  expandedStore.setExpanded(key, value)
}

const expandAll = () => {
  tree.forEach((item) => setExpandDeep(item, true))
}

const collapseAll = () => {
  tree.forEach((item) => setExpandDeep(item, false))
}

export const treeLib = {
  init,
  toggleSelected,
  toggleExpanded,
  expandAll,
  collapseAll
}
