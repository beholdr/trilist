<svelte:options
  customElement={{
    tag: 'tree-input',
    props: {
      options: { type: 'Array' },
      selected: { type: 'Array' },
      expanded: { type: 'Array' },
      expandCollapseControls: {
        attribute: 'expand-collapse-controls',
        type: 'Boolean'
      }
    }
  }}
/>

<script lang="ts">
  import { dispatch } from '../lib/events'
  import { treeLib, type OptionItem, type TreeItemId } from '../lib/tree'
  import Tree from './Tree.svelte'
  import TreeControl from './TreeControl.svelte'

  // TODO: add customization via vars
  import { getStyles } from '../theme'

  //////////////////////////////////////////////////////////////////////////////

  export let options: OptionItem[] = []
  export let selected: TreeItemId[] = []
  export let expanded: string[] = []

  // export let groups: boolean = false
  // export let single: boolean = false

  export let expandCollapseControls = false

  //////////////////////////////////////////////////////////////////////////////

  let component: HTMLElement

  const tree = treeLib.init(options, selected, expanded)

  const onSelectItem = (e: CustomEvent) => {
    dispatch(component, 'selectItem', e.detail)
  }
</script>

{@html getStyles()}

<main {...$$restProps} bind:this={component}>
  {#if expandCollapseControls}
    <TreeControl />
  {/if}
  <Tree {tree} on:selectItem={onSelectItem} />
</main>
