<svelte:options
  customElement={{
    tag: 'trilist-view',
    extend: extendElement,
    props: {
      selectable: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      selected: { type: 'Array' },
      expanded: { type: 'Array' },
      treeControls: { attribute: 'tree-controls', type: 'Boolean' }
    }
  }}
/>

<script lang="ts">
  import { dispatch, EventName, extendElement } from '../lib/components'
  import { Tree, type ComponentOptions, type TreeItemKey } from '../lib/tree'

  import TreeList from './TreeList.svelte'
  import TreeControls from './TreeControls.svelte'

  import { getStyles } from '../theme'

  //////////////////////////////////////////////////////////////////////////////

  export let selectable = false
  export let multiselect = false
  export let selected: TreeItemKey[] = []
  export let expanded: TreeItemKey[] = []
  export let treeControls = false

  let el: HTMLElement
  let tree: Tree | undefined

  export const init = (options: ComponentOptions) => {
    if (selected.length) {
      options.selected = selected.concat(options.selected ?? [])
    }
    if (expanded.length) {
      options.expanded = expanded.concat(options.expanded ?? [])
    }
    if (multiselect) {
      options.multiselect = true
    }

    tree = new Tree(options)
  }

  const onSelect = (e: CustomEvent) => {
    dispatch(el, EventName.select, e.detail)
  }
</script>

{@html getStyles()}

{#if tree}
  <div {...$$restProps} bind:this={el}>
    {#if treeControls}
      <TreeControls {tree} />
    {/if}

    <TreeList {tree} {selectable} {multiselect} on:select={onSelect} />
  </div>
{/if}
