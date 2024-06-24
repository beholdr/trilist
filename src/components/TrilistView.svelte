<svelte:options
  customElement={{
    tag: 'trilist-view',
    props: {
      animated: { type: 'Boolean' },
      expandSelected: { type: 'Boolean', attribute: 'expand-selected' },
      fieldId: { type: 'String', attribute: 'field-id' },
      fieldLabel: { type: 'String', attribute: 'field-label' },
      fieldChildren: { type: 'String', attribute: 'field-children' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { type: 'String', attribute: 'filter-placeholder' },
      independent: { type: 'Boolean' },
      leafs: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      selectable: { type: 'Boolean' },
    },
  }}
/>

<script lang="ts">
  import { getContext, hasContext, setContext, onMount } from 'svelte'

  import { Trilist, type TrilistOptions } from '../lib'

  import Filter from './Filter.svelte'
  import Tree from './Tree.svelte'

  import { getStyles } from '../theme'

  export let animated = false
  export let animatedEnabled = false // passed from TrilistSelect as reactive prop
  export let expandSelected = false
  export let fieldId = ''
  export let fieldLabel = ''
  export let fieldChildren = ''
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let independent = false
  export let leafs = false
  export let multiselect = false
  export let selectable = multiselect ? true : false

  const isChild = hasContext('trilist')

  export const trilist = isChild
    ? getContext<Trilist>('trilist')
    : new Trilist()

  if (!isChild) {
    setContext('trilist', trilist)
  }

  let items = trilist.items
  let el: HTMLElement

  export const init = (options: TrilistOptions) => {
    items = trilist.init(el, {
      ...options,
      ...{
        expandSelected,
        independent,
        leafs,
        multiselect,
        fieldId,
        fieldLabel,
        fieldChildren,
      },
    })
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

<div
  {...$$restProps}
  class="trilist-view"
  role="tree"
  aria-multiselectable={multiselect}
  bind:this={el}
>
  {#if filter && items.length}
    <Filter {filterPlaceholder} />
  {/if}

  <Tree
    class="trilist-tree"
    {items}
    {selectable}
    animated={animatedEnabled}
    on:trilist-change={onChange}
  />
</div>
