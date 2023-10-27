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
    class="text-base leading-normal w-full flex-grow rounded border-tri-gray text-gray-600"
    type="search"
    placeholder={filterPlaceholder}
  />
  <button
    class="px-2 rounded border flex items-center justify-center text-tri-gray hover:text-tri-gray-darker border-tri-gray hover:border-tri-gray-darker active:bg-gray-100"
    title="Expand all"
    on:click={() => trilist.expandAll()}
  >
    {@html ExpandIcon}
  </button>
  <button
    class="px-2 rounded border flex items-center justify-center text-tri-gray hover:text-tri-gray-darker border-tri-gray hover:border-tri-gray-darker active:bg-gray-100"
    title="Collapse all"
    on:click={() => trilist.collapseAll()}
  >
    {@html CollapseIcon}
  </button>
</div>
