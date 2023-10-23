import { writable } from 'svelte/store'
import { type TreeItemId } from '../lib/tree'

export const createSelectedStore = () => {
  const { set, subscribe, update } = writable<Set<TreeItemId>>(new Set([]))

  const setSelected = (id: TreeItemId, value = true) =>
    value
      ? update((state) => state.add(id))
      : update((state) => {
          state.delete(id)

          return state
        })

  return {
    set: (value?: TreeItemId[]) => set(new Set(value)),
    subscribe,
    setSelected
  }
}
