import { derived } from 'svelte/store'

import { type Trilist, type TreeItemId } from '../lib'

export const createValueStore = (trilist: Trilist) =>
  derived(trilist.selected, ($store) => {
    const ids = [...$store]
    const idsWithFullSections: TreeItemId[] = []

    const result = ids.filter((id) => {
      const item = trilist.findItemById(id)

      if (!item) return false

      if (trilist.leafs) {
        return !item.children
      }

      if (
        item.children &&
        item.children.filter((child) => ids.includes(child.id)).length ===
          item.children.length
      ) {
        item.children.forEach((child) => idsWithFullSections.push(child.id))
      }

      return true
    })

    return !trilist.independent && !trilist.leafs && idsWithFullSections.length
      ? result.filter((id) => !idsWithFullSections.includes(id))
      : result
  })
