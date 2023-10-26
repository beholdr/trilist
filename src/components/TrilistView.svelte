<svelte:options
  customElement={{
    tag: 'trilist-view',
    extend: extendElement,
    props: {
      animated: { type: 'Boolean' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { attribute: 'filter-placeholder', type: 'String' },
      leafs: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      selectable: { type: 'Boolean' }
    }
  }}
/>

<script lang="ts">
  import { setContext, onMount } from 'svelte'
  import { dispatch, EventName, extendElement } from '../lib/components'
  import { Tree, type TreeItem, type ComponentOptions } from '../lib/tree'

  import TreeFilter from './TreeFilter.svelte'
  import TreeList from './TreeList.svelte'

  import { getStyles } from '../theme'

  export let animated = false
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let leafs = false
  export let multiselect = false
  export let selectable = false

  const tree = new Tree()
  setContext('tree', tree)

  let items: TreeItem[] = []
  let el: HTMLElement
  let animatedEnabled = false

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

  // enable animation after pause
  onMount(async () => setTimeout(() => (animatedEnabled = animated), 300))
</script>

{@html getStyles()}

<div {...$$restProps} bind:this={el}>
  {#if filter}
    <TreeFilter {filterPlaceholder} />
  {/if}

  <TreeList
    {items}
    {selectable}
    animated={animatedEnabled}
    on:select={onSelect}
  />
</div>
