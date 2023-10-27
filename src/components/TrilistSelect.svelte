<svelte:options
  customElement={{
    tag: 'trilist-select',
    extend: extendElement,
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

  import {
    dispatchOut,
    extendElement,
    Tree,
    TrilistEvents,
    type ComponentOptions,
    type TreeItemKey
  } from '../lib'

  import TreeFilter from './TreeFilter.svelte'
  import TreeTags from './TreeTags.svelte'
  import TrilistView from './TrilistView.svelte'
  import Modal from './Modal.svelte'

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

  const tree = new Tree()
  const value = tree.value
  setContext('tree', tree)

  export const init = (options: ComponentOptions) => {
    elTree.init(options)
  }

  const openModal = () => {
    previousValue = tree.getValue()
    showModal = true
  }

  const onSelect = () => {
    dispatchOut(
      el,
      new CustomEvent(TrilistEvents.select, { detail: tree.getValue() })
    )
  }

  const onCancel = () => {
    tree.setValue(previousValue)
  }
</script>

<div {...$$restProps} bind:this={el}>
  <button
    class="flex justify-between w-full px-4 py-2 text-left rounded border border-tri-gray hover:border-tri-gray-darker"
    on:click={openModal}
  >
    {#if $value.length}
      <TreeTags ids={$value} on:select={onSelect} />
    {:else}
      <div class="text-gray-500 truncate">{placeholder}</div>
    {/if}
    <span class="text-tri-gray ml-2 -mr-1">{@html TreeIcon}</span>
  </button>

  <Modal
    bind:showModal
    {selectButton}
    {cancelButton}
    on:select={onSelect}
    on:cancel={onCancel}
  >
    <span slot="header">
      <h2 class="text-lg font-medium mb-5 leading-tight">{placeholder}</h2>
      {#if filter}
        <TreeFilter {filterPlaceholder} />
      {/if}
    </span>

    <TrilistView
      bind:this={elTree}
      {animated}
      {leafs}
      {multiselect}
      selectable
    />
  </Modal>
</div>
