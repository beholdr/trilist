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
  class="trilist-select-tags flex max-h-36 w-[calc(100%-28px)] flex-wrap gap-1.5"
>
  {#each ids as id}
    <div
      class="trilist-tag inline-flex items-center overflow-hidden rounded-sm bg-trilist-color-bg-secondary pl-2 text-sm text-trilist-color-text-secondary ring-1 ring-trilist-color-border-secondary"
      title={tagItem(id)?.label}
    >
      <div class="truncate">
        {tagItem(id)?.label}
      </div>
      <button
        class="form-button mx-1 my-0.5 text-trilist-color-text-tertiary hover:text-trilist-color-text-secondary"
        {disabled}
        on:click|stopPropagation={() => handleRemove(id)}
      >
        {@html CloseIcon}
      </button>
    </div>
  {/each}
</div>
