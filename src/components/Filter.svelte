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
    class="trilist-filter-input form-input text-base leading-normal w-full flex-grow rounded rounded-r-none bg-trilist-color-bg-primary placeholder:text-trilist-color-text-tertiary"
    type="search"
    placeholder={filterPlaceholder}
  />
  <button
    class="trilist-expand-all form-button px-2 border border-l-0 flex items-center justify-center text-trilist-color-text-tertiary hover:text-trilist-color-text-secondary bg-trilist-color-bg-primary active:brightness-95"
    title="Expand all"
    on:click={() => trilist.expandAll()}
  >
    {@html ExpandIcon}
  </button>
  <button
    class="trilist-collapse-all form-button rounded rounded-l-none px-2 border border-l-0 flex items-center justify-center text-trilist-color-text-tertiary hover:text-trilist-color-text-secondary bg-trilist-color-bg-primary active:brightness-95"
    title="Collapse all"
    on:click={() => trilist.collapseAll()}
  >
    {@html CollapseIcon}
  </button>
</div>
