<svelte:options
  customElement={{
    tag: 'trilist-select',
    props: {
      animated: { type: 'Boolean' },
      fieldId: { type: 'String', attribute: 'field-id' },
      fieldLabel: { type: 'String', attribute: 'field-label' },
      fieldChildren: { type: 'String', attribute: 'field-children' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { type: 'String', attribute: 'filter-placeholder' },
      leafs: { type: 'Boolean' },
      multiple: { type: 'Boolean' },
      placeholder: { type: 'String' },
      selectButton: { type: 'String', attribute: 'select-button' },
      cancelButton: { type: 'String', attribute: 'cancel-button' }
    }
  }}
/>

<script lang="ts">
  import { setContext, type SvelteComponent } from 'svelte'

  import { Trilist, type TrilistOptions, type TreeItemKey } from '../lib'

  import Tags from './Tags.svelte'
  import Filter from './Filter.svelte'
  import Modal from './Modal.svelte'
  import TrilistView from './TrilistView.svelte'

  import TreeIcon from '../assets/tree.svg?raw'

  export let animated = false
  export let fieldId = ''
  export let fieldLabel = ''
  export let fieldChildren = ''
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let leafs = false
  export let multiple = false
  export let placeholder = 'Please select...'
  export let selectButton = 'Select'
  export let cancelButton = 'Cancel'

  let elTree: SvelteComponent
  let showModal = false
  let previousValue: TreeItemKey[]
  let animatedEnabled = false

  const trilist = new Trilist()
  setContext('trilist', trilist)

  const value = trilist.value

  export const init = (options: TrilistOptions) => {
    elTree.init(options)
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

<div
  {...$$restProps}
  id="trilist-select"
  role="combobox"
  aria-expanded={showModal}
  aria-controls="trilist-dialog"
>
  <button
    id="trilist-select-button"
    class="form-button flex justify-between w-full px-4 py-2 text-left select-none rounded border border-trilist-input-border bg-trilist-input-fone"
    on:click={openModal}
  >
    {#if $value.length}
      <Tags ids={$value} on:trilist-change={onChange} />
    {:else}
      <div class="text-trilist-button truncate">{placeholder}</div>
    {/if}
    <span class="text-trilist-button hover:text-trilist-button-hover ml-2 -mr-1">{@html TreeIcon}</span>
  </button>

  <Modal
    id="trilist-dialog"
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
      {fieldId}
      {fieldLabel}
      {fieldChildren}
      {leafs}
      {multiple}
      selectable
    />
  </Modal>
</div>
