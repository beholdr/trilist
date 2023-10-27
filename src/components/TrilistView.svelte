<svelte:options
  customElement={{
    tag: 'trilist-view',
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

  import { Trilist, type ComponentOptions, type TreeItem } from '../lib'

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

  const isChild = hasContext('trilist')
  const trilist = isChild ? getContext<Trilist>('trilist') : new Trilist()

  if (!isChild) {
    setContext('trilist', trilist)
  }

  export const init = (options: ComponentOptions) => {
    items = trilist.init(options, el, multiselect, leafs)
  }

  const onChange = () => {
    if (!isChild) {
      trilist.dispatchChangeEvent()
    }
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
    on:trilist-change={onChange}
  />
</div>
