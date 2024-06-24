<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'

  import { TrilistEvents, type Trilist, type TreeItemId } from '../lib'

  import CloseIcon from '../assets/close.svg?raw'

  export let ids: TreeItemId[]
  export let disabled = false

  const trilist = getContext<Trilist>('trilist')
  const dispatch = createEventDispatcher()

  const tagItem = (id: TreeItemId) => trilist.findItemById(id)

  const handleRemove = (id: TreeItemId) => {
    trilist.toggleSelected(tagItem(id)!, false)
    dispatch(TrilistEvents.change)
  }
</script>

<div
  class="trilist-select-tags w-[calc(100%-28px)] max-h-36 flex gap-1.5 flex-wrap"
>
  {#each ids as id}
    <div
      class="trilist-tag inline-flex pl-2 items-center bg-trilist-color-bg-secondary ring-1 ring-trilist-color-border-secondary rounded-sm text-trilist-color-text-secondary text-sm overflow-hidden"
      title={tagItem(id)?.label}
    >
      <div class="truncate">
        {tagItem(id)?.label}
      </div>
      <button
        class="form-button my-0.5 mx-1 text-trilist-color-text-tertiary hover:text-trilist-color-text-secondary"
        {disabled}
        on:click|stopPropagation={() => handleRemove(id)}
      >
        {@html CloseIcon}
      </button>
    </div>
  {/each}
</div>
