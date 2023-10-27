<script lang="ts">
  import { getContext } from 'svelte'

  import { type Trilist } from '../lib'

  import ExpandIcon from '../assets/expand.svg?raw'
  import CollapseIcon from '../assets/collapse.svg?raw'

  export let filterPlaceholder: string

  const trilist = getContext<Trilist>('trilist')

  const handleFilter = (query: string) => {
    trilist.filter(query)
  }
</script>

<div class="mb-4 flex gap-x-2.5">
  <input
    on:input={(e) => handleFilter(e.currentTarget.value)}
    class="text-base leading-normal w-full flex-grow rounded border-trilist-gray bg-trilist-input"
    type="search"
    placeholder={filterPlaceholder}
  />
  <button
    class="px-2 rounded border flex items-center justify-center text-trilist-gray hover:text-trilist-gray-alt border-trilist-gray hover:border-trilist-gray-alt active:bg-trilist-secondary"
    title="Expand all"
    on:click={() => trilist.expandAll()}
  >
    {@html ExpandIcon}
  </button>
  <button
    class="px-2 rounded border flex items-center justify-center text-trilist-gray hover:text-trilist-gray-alt border-trilist-gray hover:border-trilist-gray-alt active:bg-trilist-secondary"
    title="Collapse all"
    on:click={() => trilist.collapseAll()}
  >
    {@html CollapseIcon}
  </button>
</div>
