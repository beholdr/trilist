<svelte:options
  customElement={{
    tag: 'trilist-select',
    extend: extendElement,
    props: {
      multiselect: { type: 'Boolean' },
      selected: { type: 'Array' },
      expanded: { type: 'Array' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { attribute: 'filter-placeholder', type: 'String' },
      treeControls: { attribute: 'tree-controls', type: 'Boolean' }
    }
  }}
/>

<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import type { ComponentOptions, TreeItemKey } from '../lib/tree'
  import { extendElement } from '../lib/components'
  import TrilistView from './TrilistView.svelte'
  import Modal from './Modal.svelte'

  import TreeIcon from '../assets/tree.svg?raw'

  export let multiselect = false
  export let selected: TreeItemKey[] = []
  export let expanded: TreeItemKey[] = []
  export let placeholder = 'Please select...'
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let treeControls = false
  // export let groups: boolean = false
  // export let single: boolean = false

  let treeEl: SvelteComponent
  let showModal = false

  export const init = (options: ComponentOptions) => {
    treeEl.init(options)
  }
</script>

<div {...$$restProps}>
  <button
    class="flex justify-between items-center w-full px-3 py-2 text-left text-gray-500 rounded border border-linecolor hover:border-linecolor2"
    on:click={() => (showModal = true)}
  >
    {placeholder}
    <span class="text-linecolor">{@html TreeIcon}</span>
  </button>

  <Modal bind:showModal>
    <h2 slot="header">{placeholder}</h2>
    <TrilistView
      bind:this={treeEl}
      {selected}
      {expanded}
      {filter}
      {filterPlaceholder}
      {treeControls}
      {multiselect}
      selectable
      on:select
    />
  </Modal>
</div>
