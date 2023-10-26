<svelte:options
  customElement={{
    tag: 'trilist-view',
    extend: extendElement,
    props: {
      animated: { type: 'Boolean' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { type: 'String', attribute: 'filter-placeholder' },
      leafs: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      selectable: { type: 'Boolean' }
    }
  }}
/>

<script lang="ts">
  import { getContext, hasContext, setContext, onMount } from 'svelte'
  import { dispatchOut, TrilistEvents, extendElement } from '../lib/components'
  import { Tree, type ComponentOptions, type TreeItem } from '../lib/tree'
  import TreeFilter from './TreeFilter.svelte'
  import TreeList from './TreeList.svelte'

  import { getStyles } from '../theme'

  export let animated = false
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let leafs = false
  export let multiselect = false
  export let selectable = false

  let items: TreeItem[] = []
  let el: HTMLElement
  let animatedEnabled = false

  const isSelectComponent = hasContext('tree')
  const tree = isSelectComponent ? getContext<Tree>('tree') : new Tree()

  if (!isSelectComponent) {
    setContext('tree', tree)
  }

  export const init = (options: ComponentOptions) => {
    items = tree.init(options, multiselect, leafs)
  }

  const onSelect = () => {
    if (isSelectComponent) return

    dispatchOut(
      el,
      new CustomEvent(TrilistEvents.select, { detail: tree.getValue() })
    )
  }

  // enable animation after initial rendering
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
