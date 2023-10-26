<svelte:options
  customElement={{
    tag: 'trilist-select',
    extend: extendElement,
    props: {
      multiselect: { type: 'Boolean' },
      leafs: { type: 'Boolean' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { attribute: 'filter-placeholder', type: 'String' }
    }
  }}
/>

<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import type { ComponentOptions } from '../lib/tree'
  import { extendElement } from '../lib/components'
  import TrilistView from './TrilistView.svelte'
  import Modal from './Modal.svelte'

  import TreeIcon from '../assets/tree.svg?raw'

  export let multiselect = false
  export let leafs = false
  export let placeholder = 'Please select...'
  export let filter = false
  export let filterPlaceholder = 'Quick search'

  let treeEl: SvelteComponent
  let showModal = false

  export const init = (options: ComponentOptions) => {
    treeEl.init(options)
  }
</script>

<div {...$$restProps}>
  <button
    class="flex justify-between items-center w-full px-3 py-2 text-left rounded border border-tri-gray hover:border-tri-gray-darker"
    on:click={() => (showModal = true)}
  >
    <span class="text-gray-500 truncate">{placeholder}</span>
    <span class="text-tri-gray ml-2">{@html TreeIcon}</span>
  </button>

  <Modal bind:showModal>
    <h2 slot="header">{placeholder}</h2>
    <TrilistView
      bind:this={treeEl}
      {multiselect}
      {leafs}
      {filter}
      {filterPlaceholder}
      selectable
      on:select
    />
  </Modal>
</div>
