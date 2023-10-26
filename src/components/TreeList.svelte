<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'
  import type { Tree, TreeItem } from '../lib/tree'
  import { EventName } from '../lib/components'

  import BulletIcon from '../assets/bullet.svg?raw'

  export let items: TreeItem[]
  export let animated = false
  export let selectable = false

  const tree = getContext<Tree>('tree')
  const expanded = tree.expanded
  const hidden = tree.hidden
  const indeterminate = tree.indeterminate
  const selected = tree.selected

  const dispatch = createEventDispatcher()

  const handleExpand = (item: TreeItem, selected: boolean) => {
    tree.toggleExpanded(item, !selected)
  }

  const handleToggle = (item: TreeItem, selected: boolean) => {
    tree.toggleSelected(item, !selected)
    dispatch(EventName.select, item)
  }
</script>

<ul {...$$restProps}>
  {#each items as item}
    <li class="mb-3" class:hidden={$hidden.has(item.key)}>
      {#if item.children}
        <div class="flex">
          <button
            class="flex-none h-5 w-5 text-tri-gray -rotate-90 mr-1 mt-0.5 transition-transform"
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
                class="mt-1 mr-2 flex-none text-tri-primary"
                checked={$selected.has(item.id)}
                indeterminate={$indeterminate.has(item.key)}
                on:click={() => handleToggle(item, $selected.has(item.id))}
              />
            {/if}
            {@html tree.labelHook ? tree.labelHook(item) : item.label}
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
            on:select
          />
        </div>
      {:else}
        <div class="flex">
          <div class="invisible flex-none h-5 w-5 mr-1 mt-0.5" />
          <label class="inline-flex">
            {#if selectable}
              <input
                type="checkbox"
                class="mt-1 mr-2 flex-none text-tri-primary"
                checked={$selected.has(item.id)}
                on:click={() => handleToggle(item, $selected.has(item.id))}
              />
            {/if}
            {@html tree.labelHook ? tree.labelHook(item) : item.label}
          </label>
        </div>
      {/if}
    </li>
  {/each}
</ul>
