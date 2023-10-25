<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'
  import type { Tree, TreeItem } from '../lib/tree'
  import { EventName } from '../lib/components'

  import BulletIcon from '../assets/bullet.svg?raw'

  export let items: TreeItem[]
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
    <li class="mb-2" class:hidden={$hidden.has(item.key)}>
      {#if item.children}
        <button
          class="inline-block h-5 w-5 text-tri-gray -rotate-90 mr-0.5 align-middle transition-transform"
          class:rotate-0={$expanded.has(item.key)}
          on:click|preventDefault={() =>
            handleExpand(item, $expanded.has(item.key))}
        >
          {@html BulletIcon}
        </button>
        <label class="align-middle">
          {#if selectable}
            <input
              type="checkbox"
              class="-mt-1 mr-1 text-tri-primary"
              checked={$selected.has(item.id)}
              indeterminate={$indeterminate.has(item.key)}
              on:click={() => handleToggle(item, $selected.has(item.id))}
            />
          {/if}
          <span>{@html tree.getItemLabel(item)}</span>
        </label>
        <div class:hidden={!$expanded.has(item.key)}>
          <svelte:self
            {tree}
            items={item.children}
            {selectable}
            class={selectable ? 'ml-6 pl-0.5 mt-2' : 'ml-4 pl-0.5 mt-2'}
            on:select
          />
        </div>
      {:else}
        <span>
          <span class="invisible inline-block h-5 w-5 mr-0.5 align-middle" />
          <label class="align-middle">
            {#if selectable}
              <input
                type="checkbox"
                class="-mt-1 mr-1 text-tri-primary"
                checked={$selected.has(item.id)}
                on:click={() => handleToggle(item, $selected.has(item.id))}
              />
            {/if}
            {@html tree.getItemLabel(item)}
          </label>
        </span>
      {/if}
    </li>
  {/each}
</ul>
