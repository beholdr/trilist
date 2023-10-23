<svelte:options
  customElement={{
    tag: 'trilist-select',
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
  import Modal from './Modal.svelte'

  import { getStyles } from '../theme'

  //////////////////////////////////////////////////////////////////////////////

  // export let options: OptionItem[] = []
  // export let selected: TreeItemId[] = []
  // export let expanded: string[] = []

  export let treeControls = false
  export let placeholder = 'Please select...'
  // export let groups: boolean = false
  // export let single: boolean = false

  let component: HTMLElement
  let tree: TreeItem[] = []
  let showModal = false

  export const init = (options: ComponentOptions) => {
    tree = treeLib.init(options.options)
  }

  const onSelectItem = (e: CustomEvent) => {
    dispatch(component, 'select', e.detail)
  }
</script>

{@html getStyles()}

<div {...$$restProps} bind:this={component}>
  <button class="trilist-select" on:click={() => (showModal = true)}>
    {placeholder}
  </button>

  <Modal bind:showModal>
    <h2 slot="header">{placeholder}</h2>
    <div>
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
  </Modal>
</div>

<style>
  .trilist-select {
    display: block;
    width: 100%;
    text-align: left;
    color: var(--trilist-placholder-color, #999);
    background: url('src/assets/tree.svg') no-repeat right 10px top 50%;
    background-size: 20px;
    border: 1px solid var(--trilist-border-color, #999);
    border-radius: var(--trilist-border-radius, 0);
    padding: 8px 12px;
  }
  .trilist-select:hover {
    border-color: var(--trilist-border-hover-color, #777);
  }
</style>
