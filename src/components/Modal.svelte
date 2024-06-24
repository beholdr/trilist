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

  // prevent body scrolling
  $: document.querySelector('html')!.style.overflow = showModal ? 'hidden' : ''

  const handleSubmit = () => {
    dialog.close('submit')
  }

  const handleCancel = () => {
    dialog.close()
  }

  const handleClose = () => {
    if (dialog.returnValue === 'submit') {
      dispatch(TrilistEvents.change)
      dialog.returnValue = '' // reset for correct Esc cancel work
    } else {
      dispatch('trilist-cancel')
    }
    showModal = false
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  {...$$restProps}
  bind:this={dialog}
  class="mt-5 w-[32em] rounded shadow-md animate-in slide-in-from-top-4 backdrop:backdrop-blur backdrop:animate-in backdrop:fade-in-0 sm:mt-10 sm:max-h-[90dvh]"
  on:click|self={handleCancel}
  on:close={handleClose}
>
  <div class="flex max-h-full flex-col text-trilist-color-text-primary">
    <header
      class="sticky top-0 z-10 bg-trilist-color-bg-primary px-3 pt-3 sm:px-8 sm:pt-6"
    >
      <button
        class="trilist-dialog-close form-button float-right -mr-1 ml-2 mt-0.5 text-trilist-color-text-tertiary hover:text-trilist-color-text-secondary"
        on:click={handleCancel}
      >
        {@html CloseIcon}
      </button>

      <slot name="header" />
    </header>

    <div class="flex-grow bg-trilist-color-bg-primary px-3 sm:px-8">
      <slot />
    </div>

    <footer
      class="sticky bottom-0 z-10 bg-trilist-color-bg-primary px-3 pb-3 pt-4 sm:px-8 sm:pb-6"
    >
      <button
        class="trilist-dialog-select form-button mr-2 select-none rounded border border-trilist-color-accent bg-trilist-color-accent px-4 py-1 text-trilist-color-text-inversed"
        on:click={handleSubmit}
      >
        {selectButton}
      </button>
      <button
        class="trilist-dialog-cancel form-button select-none rounded border px-4 py-1 text-trilist-color-text-secondary"
        on:click={handleCancel}
      >
        {cancelButton}
      </button>
    </footer>
  </div>
</dialog>
