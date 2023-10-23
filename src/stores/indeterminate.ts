import { writable } from 'svelte/store'

export const createIndeterminateStore = () => {
  const { set, subscribe, update } = writable<Set<string>>(new Set([]))

  const setIndeterminate = (key: string, value = true) =>
    value
      ? update((state) => state.add(key))
      : update((state) => {
          state.delete(key)

          return state
        })

  return {
    set: (value?: string[]) => set(new Set(value)),
    subscribe,
    setIndeterminate
  }
}
