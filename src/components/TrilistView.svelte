<svelte:options
  customElement={{
    tag: 'trilist-view',
    props: {
      animated: { type: 'Boolean' },
      fieldId: { type: 'String', attribute: 'field-id' },
      fieldLabel: { type: 'String', attribute: 'field-label' },
      fieldChildren: { type: 'String', attribute: 'field-children' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { type: 'String', attribute: 'filter-placeholder' },
      leafs: { type: 'Boolean' },
      multiple: { type: 'Boolean' },
      selectable: { type: 'Boolean' }
    }
  }}
/>

<script lang="ts">
  import { getContext, hasContext, setContext, onMount } from 'svelte'

  import { Trilist, type TrilistOptions, type TreeItem } from '../lib'

  import Filter from './Filter.svelte'
  import Tree from './Tree.svelte'

  import { getStyles } from '../theme'

  export let animated = false
  export let animatedEnabled = false // passed from TrilistSelect as reactive prop
  export let fieldId = ''
  export let fieldLabel = ''
  export let fieldChildren = ''
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let leafs = false
  export let multiple = false
  export let selectable = multiple ? true : false

  let items: TreeItem[] = []
  let el: HTMLElement

  const isChild = hasContext('trilist')
  const trilist = isChild ? getContext<Trilist>('trilist') : new Trilist()

  if (!isChild) {
    setContext('trilist', trilist)
  }

  export const init = (options: TrilistOptions) => {
    items = trilist.init(el, {
      ...options,
      ...{ multiple, leafs, fieldId, fieldLabel, fieldChildren }
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
  id="trilist-view"
  role="tree"
  aria-multiselectable={multiple}
  bind:this={el}
>
  {#if filter && items.length}
    <Filter {filterPlaceholder} />
  {/if}

  <Tree
    {items}
    {selectable}
    animated={animatedEnabled}
    on:trilist-change={onChange}
  />
</div>
