<script lang="ts">
  import { getContext } from 'svelte'
  import type { Tree } from '../lib/tree'

  import ExpandIcon from '../assets/expand.svg?raw'
  import CollapseIcon from '../assets/collapse.svg?raw'

  export let treeControls = false
  export let filterPlaceholder: string

  const tree = getContext<Tree>('tree')

  const handleFilter = (query: string) => {
    tree.filter(query)
  }
</script>

<div class="mb-4 flex gap-x-2.5">
  <input
    on:input={(e) => handleFilter(e.currentTarget.value)}
    class="flex-grow rounded border-tri-gray"
    type="search"
    placeholder={filterPlaceholder}
  />
  {#if treeControls}
    <button
      class="w-[42px] rounded border flex items-center justify-center text-tri-gray hover:text-tri-gray-darker border-tri-gray hover:border-tri-gray-darker active:bg-gray-100"
      title="Expand all"
      on:click={() => tree.expandAll()}
    >
      {@html ExpandIcon}
    </button>
    <button
      class="w-[42px] rounded border flex items-center justify-center text-tri-gray hover:text-tri-gray-darker border-tri-gray hover:border-tri-gray-darker active:bg-gray-100"
      title="Collapse all"
      on:click={() => tree.collapseAll()}
    >
      {@html CollapseIcon}
    </button>
  {/if}
</div>
