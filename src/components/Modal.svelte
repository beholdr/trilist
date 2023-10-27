<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { TrilistEvents } from '../lib'

  import CloseIcon from '../assets/close.svg?raw'

  export let showModal = false
  export let selectButton: string
  export let cancelButton: string

  let dialog: HTMLDialogElement
  const dispatch = createEventDispatcher()

  $: if (dialog && showModal) dialog.showModal()

  const handleSubmit = () => {
    dispatch(TrilistEvents.change)
    dialog.close()
  }

  const handleCancel = () => {
    dispatch('trilist-cancel')
    dialog.close()
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  class="w-[32em] max-w-[94vw] rounded shadow-md animate-in slide-in-from-top-4 backdrop:backdrop-blur backdrop:animate-in backdrop:fade-in-0"
  on:close={() => (showModal = false)}
  on:click|self={handleCancel}
  on:cancel|self={handleCancel}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="flex flex-col max-h-full relative" on:click|stopPropagation>
    <header class="sticky top-0 pt-3 sm:pt-6 px-3 sm:px-8 z-10 bg-white">
      <button
        class="text-tri-gray hover:text-tri-gray-darker float-right ml-2 mt-0.5 -mr-1"
        on:click={handleCancel}
      >
        {@html CloseIcon}
      </button>

      <slot name="header" />
    </header>

    <div class="flex-grow px-3 sm:px-8">
      <slot />
    </div>

    <footer
      class="sticky bottom-0 pt-4 pb-3 sm:pb-6 px-3 sm:px-8 z-10 bg-white"
    >
      <!-- svelte-ignore a11y-autofocus -->
      <button
        class="py-2 px-6 rounded text-white bg-tri-primary mr-2"
        autofocus
        on:click={handleSubmit}
      >
        {selectButton}
      </button>
      <button
        class="py-2 px-6 rounded border text-tri-gray hover:text-tri-gray-darker border-tri-gray hover:border-tri-gray-darker"
        on:click={handleCancel}
      >
        {cancelButton}
      </button>
    </footer>
  </div>
</dialog>
