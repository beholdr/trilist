<svelte:options
  customElement={{
    tag: 'trilist-view',
    extend: extendElement,
    props: {
      selectable: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      selected: { type: 'Array' },
      expanded: { type: 'Array' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { attribute: 'filter-placeholder', type: 'String' }
    }
  }}
/>

<script lang="ts">
  import { setContext } from 'svelte'
  import { dispatch, EventName, extendElement } from '../lib/components'
  import { Tree } from '../lib/tree'
  import type * as TreeType from '../lib/tree'

  import TreeFilter from './TreeFilter.svelte'
  import TreeList from './TreeList.svelte'

  import { getStyles } from '../theme'

  export let selectable = false
  export let multiselect = false
  export let selected: TreeType.TreeItemKey[] = []
  export let expanded: TreeType.TreeItemKey[] = []
  export let filter = false
  export let filterPlaceholder = 'Quick search'

  const tree = new Tree()
  setContext('tree', tree)

  let items: TreeType.TreeItem[] = []
  let el: HTMLElement

  export const init = (options: TreeType.ComponentOptions) => {
    if (selected.length) {
      options.selected = selected.concat(options.selected ?? [])
    }
    if (expanded.length) {
      options.expanded = expanded.concat(options.expanded ?? [])
    }
    if (multiselect) {
      options.multiselect = true
    }

    items = tree.init(options)
  }

  const onSelect = (e: CustomEvent) => {
    dispatch(el, EventName.select, e.detail)
  }
</script>

{@html getStyles()}

<div {...$$restProps} bind:this={el}>
  {#if filter}
    <TreeFilter {filterPlaceholder} />
  {/if}

  <TreeList {items} {selectable} on:select={onSelect} />
</div>
