<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'
  import type { Tree, TreeItemKey } from '../lib/tree'

  import CloseIcon from '../assets/close.svg?raw'
  import { TrilistEvents } from '../lib'

  export let ids: TreeItemKey[]

  const tree = getContext<Tree>('tree')
  const dispatch = createEventDispatcher()

  const tagItem = (id: TreeItemKey) => tree.findItemById(id)

  const handleRemove = (id: TreeItemKey) => {
    tree.toggleSelected(tagItem(id)!, false)
    dispatch(TrilistEvents.select)
  }
</script>

<div class="overflow-x-hidden max-h-32 flex gap-1 flex-wrap">
  {#each ids as id}
    <div
      class="inline-flex pl-2 items-center bg-gray-200 rounded text-sm overflow-hidden"
      title={tagItem(id)?.label}
    >
      <div class="py-0.5 truncate">
        {tagItem(id)?.label}
      </div>
      <button
        class="px-1 py-0.5 text-tri-gray hover:text-tri-gray-darker"
        on:click|stopPropagation={() => handleRemove(id)}
      >
        {@html CloseIcon}
      </button>
    </div>
  {/each}
</div>
