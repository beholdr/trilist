import { derived } from 'svelte/store'
import type { Tree, TreeItemKey } from '../lib/tree'

export const createValueStore = (tree: Tree) =>
  derived(tree.selected, ($store) => {
    const ids = [...$store]
    const idsWithFullSections: TreeItemKey[] = []

    const result = ids.filter((id) => {
      const item = tree.findItemById(id)

      if (!item) return false

      if (tree.leafs) {
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

    return !tree.leafs && idsWithFullSections.length
      ? result.filter((id) => !idsWithFullSections.includes(id))
      : result
  })
