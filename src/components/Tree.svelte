<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'

  import { TrilistEvents, type Trilist, type TreeItem } from '../lib'

  import BulletIcon from '../assets/bullet.svg?raw'

  export let items: TreeItem[]
  export let animated = false
  export let selectable = false

  const trilist = getContext<Trilist>('trilist')
  const expanded = trilist.expanded
  const hidden = trilist.hidden
  const indeterminate = trilist.indeterminate
  const selected = trilist.selected

  const dispatch = createEventDispatcher()

  const handleExpand = (item: TreeItem, selected: boolean) => {
    trilist.toggleExpanded(item, !selected)
  }

  const handleSelect = (item: TreeItem, selected: boolean) => {
    trilist.toggleSelected(item, !selected)
    dispatch(TrilistEvents.change)
  }
</script>

{#if items.length}
  <ul {...$$restProps} role="group">
    {#each items as item}
      <li
        class="mb-3"
        class:hidden={$hidden.has(item.key)}
        role="treeitem"
        aria-selected={$selected.has(item.id)}
        aria-expanded={$expanded.has(item.key)}
      >
        {#if item.children?.length}
          <div class="flex">
            <button
              class="form-button focus-visible:ring-2 flex-none h-5 w-5 text-trilist-icon -rotate-90 mr-1 mt-0.5 transition-transform"
              class:rotate-0={$expanded.has(item.key)}
              on:click|preventDefault={() =>
                handleExpand(item, $expanded.has(item.key))}
            >
              {@html BulletIcon}
            </button>
            <label class="inline-flex">
              {#if selectable}
                <input
                  type="checkbox"
                  class="form-checkbox mt-1 mr-2 flex-none text-trilist-primary border-trilist-input"
                  checked={$selected.has(item.id)}
                  indeterminate={$indeterminate.has(item.key)}
                  on:click={() => handleSelect(item, $selected.has(item.id))}
                />
              {/if}
              <span>
                {@html trilist.getItemLabel(item)}
              </span>
            </label>
          </div>
          <div
            class="ml-6 mt-3 animate-in fade-in-25 slide-in-from-top-2"
            class:duration-0={!animated}
            class:hidden={!$expanded.has(item.key)}
          >
            <svelte:self
              items={item.children}
              {animated}
              {selectable}
              on:trilist-change
            />
          </div>
        {:else}
          <div class="flex">
            <div class="invisible flex-none h-5 w-5 mr-1 mt-0.5" />
            <label class="inline-flex">
              {#if selectable}
                <input
                  type="checkbox"
                  class="form-checkbox mt-1 mr-2 flex-none text-trilist-primary border-trilist-input"
                  checked={$selected.has(item.id)}
                  on:click={() => handleSelect(item, $selected.has(item.id))}
                />
              {/if}
              <span>
                {@html trilist.getItemLabel(item)}
              </span>
            </label>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
