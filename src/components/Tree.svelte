<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  // import { expandedStore } from '../stores/expanded'
  // import { selectedStore } from '../stores/selected'
  // import { indeterminateStore } from '../stores/indeterminate'
  import { treeLib, type TreeItem } from '../lib/tree'

  export let tree: TreeItem[]
  export let expandedStore: any
  export let selectedStore: any
  export let indeterminateStore: any

  // console.log(expandedStore)
  // console.log(selectedStore)

  const handleExpand = (item: TreeItem, selected: boolean) => {
    treeLib.toggleExpanded(item.key, !selected)
  }

  // TODO: add other events: select/unselect, expand/collapse, open/close, search
  const dispatch = createEventDispatcher()

  const handleToggle = (item: TreeItem, selected: boolean) => {
    treeLib.toggleSelected(item, !selected)
    dispatch('selectItem', item)
  }
</script>

<ul {...$$restProps}>
  {#each tree as item}
    <li class="mb-2">
      {#if item.children}
        <button
          class="expand-button inline-block h-5 w-5 -rotate-90 pr-1 align-middle transition-transform"
          class:rotate-0={$expandedStore.has(item.key)}
          on:click|preventDefault={() =>
            handleExpand(item, $expandedStore.has(item.key))}
        />
        <label class="align-middle">
          <input
            type="checkbox"
            class="-mt-1 mr-1"
            checked={$selectedStore.has(item.id)}
            indeterminate={$indeterminateStore.has(item.key)}
            on:click={() => handleToggle(item, $selectedStore.has(item.id))}
          />
          {item.label}
        </label>
        {#if $expandedStore.has(item.key)}
          <svelte:self
            tree={item.children}
            {expandedStore}
            {selectedStore}
            {indeterminateStore}
            class="ml-7 mt-2"
            on:selectItem
          />
        {/if}
      {:else}
        <span>
          <span class="invisible inline-block h-5 w-5 pr-1 align-middle" />
          <label class="align-middle">
            <input
              type="checkbox"
              class="-mt-1 mr-1"
              checked={$selectedStore.has(item.id)}
              on:click={() => handleToggle(item, $selectedStore.has(item.id))}
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
