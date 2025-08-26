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
      filterAutofocus: { type: 'Boolean', attribute: 'filter-autofocus' },
      filterPlaceholder: { type: 'String', attribute: 'filter-placeholder' },
      independent: { type: 'Boolean' },
      leafs: { type: 'Boolean' },
      multiselect: { type: 'Boolean' },
      noBorder: { type: 'Boolean', attribute: 'no-border' },
      placeholder: { type: 'String' },
      selectButton: { type: 'String', attribute: 'select-button' },
      cancelButton: { type: 'String', attribute: 'cancel-button' },
    },
  }}
/>

<script lang="ts">
  import { setContext } from 'svelte'

  import { Trilist, type TrilistOptions, type TreeItemId } from '../lib'

  import Styles from './Styles.svelte'
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
  export let filterAutofocus = false
  export let filterPlaceholder = 'Quick search'
  export let independent = false
  export let leafs = false
  export let multiselect = false
  export let noBorder = false
  export let placeholder = 'Please select...'
  export let selectButton = 'Select'
  export let cancelButton = 'Cancel'

  let elTree: TrilistView
  let elFilter: Filter
  let showModal = false
  let previousValue: TreeItemId[]
  let animatedEnabled = false

  export const trilist = new Trilist()
  setContext('trilist', trilist)

  const value = trilist.value
  let el: HTMLElement

  export const init = (options: TrilistOptions) => {
    elTree.init(options)
  }

  const openModal = () => {
    // enable animation after modal opening
    animatedEnabled = false
    setTimeout(() => (animatedEnabled = animated), 300)

    previousValue = trilist.getValue()

    if (filterAutofocus) {
      elFilter.autofocus()
    }

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
  bind:this={el}
>
  <button
    class="trilist-select-button flex w-full items-center justify-between rounded form-button bg-trilist-color-bg-primary px-trilist-px py-trilist-py select-none disabled:pointer-events-none disabled:opacity-50"
    class:border={!noBorder}
    class:focus-visible:ring-0={noBorder}
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
          class="truncate"
          title={tagItem(showModal ? previousValue[0] : $value[0])?.label}
        >
          {tagItem(showModal ? previousValue[0] : $value[0])?.label}
        </div>
      {/if}
    {:else}
      <div class="truncate text-trilist-color-text-tertiary">
        {placeholder}
      </div>
    {/if}
    <span
      class="ml-1 text-trilist-color-text-tertiary hover:text-trilist-color-text-secondary"
    >
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
      <h2 class="mb-5 text-lg font-medium leading-tight">{placeholder}</h2>
      {#if filter}
        <Filter bind:this={elFilter} {filterPlaceholder} />
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

  <Styles host={el} />
</div>
