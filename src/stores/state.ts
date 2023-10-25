import { writable } from 'svelte/store'
import type { TreeItemKey } from '../lib/tree'

export const createStateStore = () => {
  const { set, subscribe, update } = writable<Set<TreeItemKey>>(new Set([]))

  const setValue = (key: TreeItemKey, value = true) =>
    value
      ? update((state) => state.add(key))
      : update((state) => {
          state.delete(key)

          return state
        })

  return {
    subscribe,
    set: (value?: TreeItemKey[]) => set(new Set(value)),
    clear: () => set(new Set([])),
    setValue
  }
}
