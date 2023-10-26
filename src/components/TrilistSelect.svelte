<svelte:options
  customElement={{
    tag: 'trilist-select',
    extend: extendElement,
    props: {
      animated: { type: 'Boolean' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { attribute: 'filter-placeholder', type: 'String' },
      leafs: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      placeholder: { type: 'String' }
    }
  }}
/>

<script lang="ts">
  import { setContext, type SvelteComponent } from 'svelte'
  import { Tree, type ComponentOptions } from '../lib/tree'
  import { extendElement } from '../lib/components'
  import TreeFilter from './TreeFilter.svelte'
  import TrilistView from './TrilistView.svelte'
  import Modal from './Modal.svelte'

  import TreeIcon from '../assets/tree.svg?raw'

  export let animated = false
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let leafs = false
  export let multiselect = false
  export let placeholder = 'Please select...'

  let el: SvelteComponent
  let showModal = false

  const tree = new Tree()
  setContext('tree', tree)

  export const init = (options: ComponentOptions) => {
    el.init(options)
  }

  const openModal = () => {
    showModal = true
  }
</script>

<div {...$$restProps}>
  <button
    class="flex justify-between items-center w-full px-3 py-2 text-left rounded border border-tri-gray hover:border-tri-gray-darker"
    on:click={openModal}
  >
    <span class="text-gray-500 truncate">{placeholder}</span>
    <span class="text-tri-gray ml-2">{@html TreeIcon}</span>
  </button>

  <Modal bind:showModal>
    <span slot="header">
      <h2 class="text-lg font-medium mb-5 leading-tight">{placeholder}</h2>
      {#if filter}
        <TreeFilter {filterPlaceholder} />
      {/if}
    </span>

    <TrilistView bind:this={el} {animated} {leafs} {multiselect} selectable />
  </Modal>
</div>
