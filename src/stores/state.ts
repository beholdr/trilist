import { writable } from 'svelte/store'

export const createStateStore = <T>() => {
  const { set, subscribe, update } = writable<Set<T>>(new Set([]))

  const setValue = (key: T, value = true) =>
    value
      ? update((state) => state.add(key))
      : update((state) => {
          state.delete(key)

          return state
        })

  return {
    subscribe,
    set: (value?: T[]) => set(new Set(value)),
    clear: () => set(new Set([])),
    setValue
  }
}
