<svelte:options
  customElement={{
    tag: 'trilist-select',
    props: {
      animated: { type: 'Boolean' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { type: 'String', attribute: 'filter-placeholder' },
      leafs: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      placeholder: { type: 'String' },
      selectButton: { type: 'String', attribute: 'select-button' },
      cancelButton: { type: 'String', attribute: 'cancel-button' }
    }
  }}
/>

<script lang="ts">
  import { setContext, type SvelteComponent } from 'svelte'

  import { Trilist, type ComponentOptions, type TreeItemKey } from '../lib'

  import Chips from './Chips.svelte'
  import Filter from './Filter.svelte'
  import Modal from './Modal.svelte'
  import TrilistView from './TrilistView.svelte'

  import TreeIcon from '../assets/tree.svg?raw'

  export let animated = false
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let leafs = false
  export let multiselect = false
  export let placeholder = 'Please select...'
  export let selectButton = 'Select'
  export let cancelButton = 'Cancel'

  let el: HTMLElement
  let elTree: SvelteComponent
  let showModal = false
  let previousValue: TreeItemKey[]
  let animatedEnabled = false

  const trilist = new Trilist()
  setContext('trilist', trilist)

  const value = trilist.value

  export const init = (options: ComponentOptions) => {
    elTree.init(options, el)
  }

  const openModal = () => {
    // enable animation after modal opening
    animatedEnabled = false
    setTimeout(() => (animatedEnabled = animated), 300)

    previousValue = trilist.getValue()

    showModal = true
  }

  const onChange = () => {
    trilist.dispatchChangeEvent()
  }

  const onCancel = () => {
    trilist.setValue(previousValue)
  }
</script>

<div {...$$restProps} bind:this={el}>
  <button
    class="flex justify-between w-full px-4 py-2 text-left select-none rounded border border-trilist-gray hover:border-trilist-gray-alt bg-trilist-input"
    on:click={openModal}
  >
    {#if $value.length}
      <Chips ids={$value} on:trilist-change={onChange} />
    {:else}
      <div class="text-gray-500 truncate">{placeholder}</div>
    {/if}
    <span class="text-trilist-gray ml-2 -mr-1">{@html TreeIcon}</span>
  </button>

  <Modal
    bind:showModal
    {selectButton}
    {cancelButton}
    on:trilist-change={onChange}
    on:trilist-cancel={onCancel}
  >
    <span slot="header">
      <h2 class="text-lg font-medium mb-5 leading-tight">{placeholder}</h2>
      {#if filter}
        <Filter {filterPlaceholder} />
      {/if}
    </span>

    <TrilistView
      bind:this={elTree}
      {animatedEnabled}
      {leafs}
      {multiselect}
      selectable
    />
  </Modal>
</div>
