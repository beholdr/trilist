<svelte:options
  customElement={{
    tag: 'trilist-view',
    extend: extendElement,
    props: {
      treeControls: { attribute: 'tree-controls', type: 'Boolean' }
    }
  }}
/>

<script lang="ts">
  import { expandedStore } from '../stores/expanded'
  import { selectedStore } from '../stores/selected'
  import { indeterminateStore } from '../stores/indeterminate'
  import { dispatch, extendElement } from '../lib/components'
  import { treeLib, type TreeItem, type ComponentOptions } from '../lib/tree'

  import Tree from './Tree.svelte'
  import TreeControls from './TreeControls.svelte'

  import { getStyles } from '../theme'

  //////////////////////////////////////////////////////////////////////////////

  export let treeControls = false

  let component: HTMLElement
  let tree: TreeItem[] = []

  export const init = (options: ComponentOptions) => {
    tree = treeLib.init(options.options)
  }

  const onSelectItem = (e: CustomEvent) => {
    dispatch(component, 'select', e.detail)
  }
</script>

{@html getStyles()}

<div {...$$restProps} bind:this={component}>
  {#if treeControls}
    <TreeControls />
  {/if}

  <Tree
    {tree}
    {expandedStore}
    {selectedStore}
    {indeterminateStore}
    on:selectItem={onSelectItem}
  />
</div>
