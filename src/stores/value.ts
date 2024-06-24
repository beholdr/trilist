import { derived } from 'svelte/store'

import { type Trilist, type TreeItemId } from '../lib'

export const createValueStore = (trilist: Trilist) =>
  derived(trilist.selected, ($store) => {
    const ids = [...$store]
    const idsFullSections: TreeItemId[] = []

    const result = ids.filter((id) => {
      const item = trilist.findItemById(id)

      if (!item) return false

      if (trilist.isLeafs()) {
        return !item.children
      }

      if (
        item.children &&
        item.children.filter((child) => ids.includes(child.id)).length ===
          item.children.length
      ) {
        item.children.forEach((child) => idsFullSections.push(child.id))
      }

      return true
    })

    const filter =
      !trilist.isIndependent() && !trilist.isLeafs() && idsFullSections.length

    return filter
      ? result.filter((id) => !idsFullSections.includes(id))
      : result
  })
