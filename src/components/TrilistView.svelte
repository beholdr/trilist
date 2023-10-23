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
  import { dispatch, EventName, extendElement } from '../lib/components'
  import { Tree, type ComponentOptions } from '../lib/tree'

  import TreeList from './TreeList.svelte'
  import TreeControls from './TreeControls.svelte'

  import { getStyles } from '../theme'

  //////////////////////////////////////////////////////////////////////////////

  export let treeControls = false

  let el: HTMLElement
  let tree: Tree | undefined

  export const init = (options: ComponentOptions) => {
    tree = new Tree(options.options)
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

    <TreeList {tree} on:select={onSelect} />
  </div>
{/if}
