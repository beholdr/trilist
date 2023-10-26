<svelte:options
  customElement={{
    tag: 'trilist-view',
    extend: extendElement,
    props: {
      selectable: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      leafs: { type: 'Boolean' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { attribute: 'filter-placeholder', type: 'String' }
    }
  }}
/>

<script lang="ts">
  import { setContext } from 'svelte'
  import { dispatch, EventName, extendElement } from '../lib/components'
  import { Tree, type TreeItem, type ComponentOptions } from '../lib/tree'

  import TreeFilter from './TreeFilter.svelte'
  import TreeList from './TreeList.svelte'

  import { getStyles } from '../theme'

  export let selectable = false
  export let multiselect = false
  export let leafs = false
  export let filter = false
  export let filterPlaceholder = 'Quick search'

  const tree = new Tree()
  setContext('tree', tree)

  let items: TreeItem[] = []
  let el: HTMLElement

  export const init = (options: ComponentOptions) => {
    if (multiselect) {
      options.multiselect = true
    }
    if (leafs) {
      options.leafs = true
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
