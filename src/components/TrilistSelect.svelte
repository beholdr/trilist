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
  import { type SvelteComponent } from 'svelte'
  import { extendElement } from '../lib/components'
  import { type ComponentOptions } from '../lib/tree'

  import TrilistView from './TrilistView.svelte'
  import Modal from './Modal.svelte'

  //////////////////////////////////////////////////////////////////////////////

  export let treeControls = false
  export let placeholder = 'Please select...'
  // export let groups: boolean = false
  // export let single: boolean = false

  let component: SvelteComponent
  let showModal = false

  export const init = (options: ComponentOptions) => {
    component.init(options)
  }
</script>

<div {...$$restProps}>
  <button class="trilist-select" on:click={() => (showModal = true)}>
    {placeholder}
  </button>

  <Modal bind:showModal>
    <h2 slot="header">{placeholder}</h2>
    <TrilistView bind:this={component} {treeControls} />
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
