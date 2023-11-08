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
  id="trilist-select-tags"
  class="w-[calc(100%-28px)] max-h-36 flex gap-1.5 flex-wrap"
>
  {#each ids as id}
    <div
      class="trilist-tag inline-flex pl-2 items-center bg-trilist-secondary ring-1 ring-trilist-tag rounded-sm text-trilist-primary text-sm overflow-hidden"
      title={tagItem(id)?.label}
    >
      <div class="truncate">
        {tagItem(id)?.label}
      </div>
      <button
        class="form-button focus-visible:ring-2 my-0.5 mx-1 text-trilist-icon hover:text-trilist-hover"
        {disabled}
        on:click|stopPropagation={() => handleRemove(id)}
      >
        {@html CloseIcon}
      </button>
    </div>
  {/each}
</div>
