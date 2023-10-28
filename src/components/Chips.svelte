<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'

  import { TrilistEvents, type Trilist, type TreeItemKey } from '../lib'

  import CloseIcon from '../assets/close.svg?raw'

  export let ids: TreeItemKey[]

  const trilist = getContext<Trilist>('trilist')
  const dispatch = createEventDispatcher()

  const tagItem = (id: TreeItemKey) => trilist.findItemById(id)

  const handleRemove = (id: TreeItemKey) => {
    trilist.toggleSelected(tagItem(id)!, false)
    dispatch(TrilistEvents.change)
  }
</script>

<div class="overflow-x-hidden max-h-32 flex gap-1 flex-wrap">
  {#each ids as id}
    <div
      class="trilist-chip inline-flex pl-2 items-center bg-trilist-secondary rounded text-sm overflow-hidden"
      title={tagItem(id)?.label}
    >
      <div class="py-0.5 truncate">
        {tagItem(id)?.label}
      </div>
      <button
        class="px-1 py-0.5 text-trilist-gray hover:text-trilist-gray-alt"
        on:click|stopPropagation={() => handleRemove(id)}
      >
        {@html CloseIcon}
      </button>
    </div>
  {/each}
</div>
