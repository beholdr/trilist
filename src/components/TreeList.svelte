<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Tree, type TreeItem } from '../lib/tree'
  import { EventName } from '../lib/components'

  export let tree: Tree
  export let items: TreeItem[] = tree.items ?? []

  const expanded = tree.expanded
  const selected = tree.selected
  const indeterminate = tree.indeterminate

  const handleExpand = (item: TreeItem, selected: boolean) => {
    tree.toggleExpanded(item.key, !selected)
  }

  // TODO: add other events: select/unselect, expand/collapse, open/close, search
  const dispatch = createEventDispatcher()

  const handleToggle = (item: TreeItem, selected: boolean) => {
    tree.toggleSelected(item, !selected)
    dispatch(EventName.select, item)
  }
</script>

<ul {...$$restProps}>
  {#each items as item}
    <li class="mb-2">
      {#if item.children}
        <button
          class="expand-button inline-block h-5 w-5 -rotate-90 pr-1 align-middle transition-transform"
          class:rotate-0={$expanded.has(item.key)}
          on:click|preventDefault={() =>
            handleExpand(item, $expanded.has(item.key))}
        />
        <label class="align-middle">
          <input
            type="checkbox"
            class="-mt-1 mr-1"
            checked={$selected.has(item.id)}
            indeterminate={$indeterminate.has(item.key)}
            on:click={() => handleToggle(item, $selected.has(item.id))}
          />
          {item.label}
        </label>
        {#if $expanded.has(item.key)}
          <svelte:self
            {tree}
            items={item.children}
            class="ml-7 mt-2"
            on:select
          />
        {/if}
      {:else}
        <span>
          <span class="invisible inline-block h-5 w-5 pr-1 align-middle" />
          <label class="align-middle">
            <input
              type="checkbox"
              class="-mt-1 mr-1"
              checked={$selected.has(item.id)}
              on:click={() => handleToggle(item, $selected.has(item.id))}
            />
            {item.label}
          </label>
        </span>
      {/if}
    </li>
  {/each}
</ul>

<style>
  .expand-button {
    /* TODO: use https://www.npmjs.com/package/postcss-inline-svg */
    background: url('src/assets/bullet.svg');
  }
</style>
