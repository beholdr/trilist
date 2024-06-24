<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'

  import { TrilistEvents } from '../lib'
  import type { Trilist, TreeItem, TreeItemId } from '../lib'

  import BulletIcon from '../assets/bullet.svg?raw'

  export let items: TreeItem[]
  export let animated = false
  export let selectable = false

  const trilist = getContext<Trilist>('trilist')

  const disabled = trilist.disabled
  const expanded = trilist.expanded
  const hidden = trilist.hidden

  let selected: TreeItemId[] = []
  trilist.selected.subscribe((value) => (selected = [...value]))

  let indeterminate: Record<string, boolean> = {}
  trilist.indeterminate.subscribe(
    (value) =>
      (indeterminate = Object.fromEntries([...value].map((el) => [el, true])))
  )

  const handleExpand = (item: TreeItem, selected: boolean) => {
    trilist.toggleExpanded(item, !selected)
  }

  const dispatch = createEventDispatcher()

  const handleSelect = async (item: TreeItem) => {
    trilist.toggleSelected(item, selected.includes(item.id))
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
        aria-selected={selected.includes(item.id)}
        aria-expanded={$expanded.has(item.key)}
      >
        {#if item.children?.length}
          <div class="flex">
            <button
              class="form-button flex-none h-5 w-5 text-trilist-color-text-tertiary -rotate-90 mr-1 mt-0.5 transition-transform"
              class:rotate-0={$expanded.has(item.key)}
              on:click|preventDefault={() =>
                handleExpand(item, $expanded.has(item.key))}
            >
              {@html BulletIcon}
            </button>
            <label
              class={$disabled.has(item.id)
                ? 'opacity-50 cursor-not-allowed inline-flex'
                : 'inline-flex'}
            >
              {#if selectable}
                <input
                  type="checkbox"
                  class="form-checkbox mt-1 mr-2 flex-none text-trilist-color-accent disabled:cursor-not-allowed"
                  value={item.id}
                  bind:group={selected}
                  disabled={$disabled.has(item.id)}
                  bind:indeterminate={indeterminate[item.key]}
                  on:change={() => handleSelect(item)}
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
            <label
              class={$disabled.has(item.id)
                ? 'opacity-50 cursor-not-allowed inline-flex'
                : 'inline-flex'}
            >
              {#if selectable}
                <input
                  type="checkbox"
                  class="form-checkbox mt-1 mr-2 flex-none text-trilist-color-accent disabled:cursor-not-allowed"
                  value={item.id}
                  bind:group={selected}
                  disabled={$disabled.has(item.id)}
                  on:change={() => handleSelect(item)}
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
