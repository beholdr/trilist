import { writable } from 'svelte/store'

const createIndeterminateStore = () => {
  const { set, subscribe, update } = writable<Set<string>>(new Set([]))

  const setIndeterminate = (key: string, value = true) =>
    value
      ? update((state) => state.add(key))
      : update((state) => {
          state.delete(key)

          return state
        })

  return {
    set,
    subscribe,
    setIndeterminate
  }
}

export const indeterminateStore = createIndeterminateStore()
