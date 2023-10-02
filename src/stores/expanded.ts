import { writable } from 'svelte/store'

const createExpandedStore = () => {
  const { set, subscribe, update } = writable<Set<string>>(new Set([]))

  const setExpanded = (key: string, value = true) =>
    value
      ? update((state) => state.add(key))
      : update((state) => {
          state.delete(key)

          return state
        })

  return {
    set,
    subscribe,
    setExpanded
  }
}

export const expandedStore = createExpandedStore()
