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
    class="form-input text-base leading-normal w-full flex-grow rounded border-trilist-input-border bg-trilist-input-fone"
    type="search"
    placeholder={filterPlaceholder}
  />
  <button
    class="form-button rounded px-2 border flex items-center justify-center text-trilist-button hover:text-trilist-button-hover border-trilist-input-border bg-trilist-input-fone active:bg-trilist-secondary"
    title="Expand all"
    on:click={() => trilist.expandAll()}
  >
    {@html ExpandIcon}
  </button>
  <button
    class="form-button rounded px-2 border flex items-center justify-center text-trilist-button hover:text-trilist-button-hover border-trilist-input-border bg-trilist-input-fone active:bg-trilist-secondary"
    title="Collapse all"
    on:click={() => trilist.collapseAll()}
  >
    {@html CollapseIcon}
  </button>
</div>
