<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { expandedStore } from '../stores/expanded'
  import { selectedStore } from '../stores/selected'
  import { indeterminateStore } from '../stores/indeterminate'
  import { treeLib, type TreeItem } from '../lib/tree'

  export let tree: TreeItem[]

  const handleExpand = (item: TreeItem, selected: boolean) => {
    treeLib.toggleExpanded(item.key, !selected)
  }

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
          class="inline-block w-5 h-5 align-middle pr-1 transition-transform -rotate-90 expand-button"
          class:rotate-0={$expandedStore.has(item.key)}
          on:click|preventDefault={() =>
            handleExpand(item, $expandedStore.has(item.key))}
        />
        <label class="align-middle">
          <input
            type="checkbox"
            class="mr-1 -mt-1"
            checked={$selectedStore.has(item.id)}
            indeterminate={$indeterminateStore.has(item.key)}
            on:click={() => handleToggle(item, $selectedStore.has(item.id))}
          />
          {item.label}
        </label>
        {#if $expandedStore.has(item.key)}
          <svelte:self tree={item.children} class="mt-2 ml-7" on:selectItem />
        {/if}
      {:else}
        <span>
          <span class="invisible inline-block w-5 h-5 align-middle pr-1" />
          <label class="align-middle">
            <input
              type="checkbox"
              class="mr-1 -mt-1"
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
