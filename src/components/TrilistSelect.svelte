<svelte:options
  customElement={{
    tag: 'trilist-select',
    props: {
      animated: { type: 'Boolean' },
      disabled: { type: 'Boolean' },
      expandSelected: { type: 'Boolean', attribute: 'expand-selected' },
      fieldId: { type: 'String', attribute: 'field-id' },
      fieldLabel: { type: 'String', attribute: 'field-label' },
      fieldChildren: { type: 'String', attribute: 'field-children' },
      filter: { type: 'Boolean' },
      filterPlaceholder: { type: 'String', attribute: 'filter-placeholder' },
      independent: { type: 'Boolean' },
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

  import { Trilist, type TrilistOptions, type TreeItemId } from '../lib'

  import Tags from './Tags.svelte'
  import Filter from './Filter.svelte'
  import Modal from './Modal.svelte'
  import TrilistView from './TrilistView.svelte'

  import TreeIcon from '../assets/tree.svg?raw'

  export let animated = false
  export let disabled = false
  export let expandSelected = false
  export let fieldId = ''
  export let fieldLabel = ''
  export let fieldChildren = ''
  export let filter = false
  export let filterPlaceholder = 'Quick search'
  export let independent = false
  export let leafs = false
  export let multiselect = false
  export let placeholder = 'Please select...'
  export let selectButton = 'Select'
  export let cancelButton = 'Cancel'

  let elTree: SvelteComponent
  let showModal = false
  let previousValue: TreeItemId[]
  let animatedEnabled = false

  export const trilist = new Trilist()
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

  const tagItem = (id: TreeItemId) => trilist.findItemById(id)

  const onChange = () => {
    trilist.dispatchChangeEvent()
  }

  const onCancel = () => {
    trilist.setValue(previousValue)
  }
</script>

<div
  {...$$restProps}
  class="trilist-select"
  role="combobox"
  aria-expanded={showModal}
  aria-controls="trilist-dialog"
>
  <button
    class="trilist-select-button form-button flex justify-between w-full p-2 text-left select-none rounded border border-trilist-input bg-trilist-fone disabled:opacity-50 disabled:pointer-events-none"
    {disabled}
    on:click={openModal}
  >
    {#if (!showModal && $value.length) || (showModal && previousValue.length)}
      {#if multiselect}
        <Tags
          ids={showModal ? previousValue : $value}
          {disabled}
          on:trilist-change={onChange}
        />
      {:else}
        <div
          class="truncate mx-1"
          title={tagItem(showModal ? previousValue[0] : $value[0])?.label}
        >
          {tagItem(showModal ? previousValue[0] : $value[0])?.label}
        </div>
      {/if}
    {:else}
      <div class="text-trilist-icon mx-1 truncate">{placeholder}</div>
    {/if}
    <span class="text-trilist-icon hover:text-trilist-hover ml-1">
      {@html TreeIcon}
    </span>
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
      {expandSelected}
      {independent}
      {leafs}
      {multiselect}
      {fieldId}
      {fieldLabel}
      {fieldChildren}
      selectable
    />
  </Modal>
</div>
