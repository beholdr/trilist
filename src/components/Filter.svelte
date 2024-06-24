<script lang="ts">
  import { getContext } from 'svelte'

  import { type Trilist } from '../lib'

  import ExpandIcon from '../assets/expand.svg?raw'
  import CollapseIcon from '../assets/collapse.svg?raw'

  export let filterPlaceholder: string

  const trilist = getContext<Trilist>('trilist')
  let input: HTMLInputElement

  const handleFilter = (query: string) => {
    trilist.filter(query)
  }

  export const autofocus = () => {
    setTimeout(() => input.focus())
  }
</script>

<div class="trilist-filter mb-4 flex">
  <input
    on:input={(e) => handleFilter(e.currentTarget.value)}
    bind:this={input}
    class="trilist-filter-input form-input w-full flex-grow rounded rounded-r-none bg-trilist-color-bg-primary text-base leading-normal placeholder:text-trilist-color-text-tertiary"
    type="search"
    placeholder={filterPlaceholder}
  />
  <button
    class="trilist-expand-all form-button flex items-center justify-center border border-l-0 bg-trilist-color-bg-primary px-2 text-trilist-color-text-tertiary hover:text-trilist-color-text-secondary active:brightness-95"
    title="Expand all"
    on:click={() => trilist.expandAll()}
  >
    {@html ExpandIcon}
  </button>
  <button
    class="trilist-collapse-all form-button flex items-center justify-center rounded rounded-l-none border border-l-0 bg-trilist-color-bg-primary px-2 text-trilist-color-text-tertiary hover:text-trilist-color-text-secondary active:brightness-95"
    title="Collapse all"
    on:click={() => trilist.collapseAll()}
  >
    {@html CollapseIcon}
  </button>
</div>
