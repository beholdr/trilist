<svelte:options
  customElement={{
    tag: 'trilist-select',
    extend: extendElement,
    props: {
      selected: { type: 'Array' },
      expanded: { type: 'Array' },
      treeControls: { attribute: 'tree-controls', type: 'Boolean' }
    }
  }}
/>

<script lang="ts">
  import { type SvelteComponent } from 'svelte'
  import { type ComponentOptions, type TreeItemId } from '../lib/tree'
  import { extendElement } from '../lib/components'

  import TrilistView from './TrilistView.svelte'
  import Modal from './Modal.svelte'

  //////////////////////////////////////////////////////////////////////////////

  export let selected: TreeItemId[] = []
  export let expanded: string[] = []
  export let treeControls = false
  export let placeholder = 'Please select...'
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
    class="block w-full px-3 py-2 text-left text-gray-400 rounded border border-gray-400 hover:border-gray-500 bg-[url(src/assets/tree.svg)] bg-no-repeat bg-[size:20px] bg-[right_10px_center]"
    on:click={() => (showModal = true)}
  >
    {placeholder}
  </button>

  <Modal bind:showModal>
    <h2 slot="header">{placeholder}</h2>
    <TrilistView
      bind:this={treeEl}
      {selected}
      {expanded}
      {treeControls}
      selectable
      on:select
    />
  </Modal>
</div>
