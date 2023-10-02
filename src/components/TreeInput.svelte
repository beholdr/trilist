<svelte:options
  customElement={{
    tag: 'tree-input',
    props: {
      options: { type: 'Array' },
      selected: { type: 'Array' },
      expanded: { type: 'Array' }
    }
  }}
/>

<script lang="ts">
  import Tree from './Tree.svelte'
  import { dispatch } from '../lib/events'
  import { treeLib, type OptionItem, type TreeItemId } from '../lib/tree'
  import { getStyles } from '../theme'

  export let options: OptionItem[]
  export let selected: TreeItemId[] = []
  export let expanded: string[] = []
  // export let onlyLeafs: boolean = true;

  let component: HTMLElement

  const tree = treeLib.init(options, selected, expanded)

  const onSelectItem = (e: CustomEvent) => {
    dispatch(component, 'selectItem', e.detail)
  }
</script>

{@html getStyles()}

<main {...$$restProps} bind:this={component}>
  <div class="float-right text-sm">
    <button on:click={treeLib.expandAll}>Expand all</button> /
    <button on:click={treeLib.collapseAll}>Collapse all</button>
  </div>
  <Tree {tree} on:selectItem={onSelectItem} />
</main>
