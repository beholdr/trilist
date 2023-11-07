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
  class="w-[32em] mt-5 sm:mt-10 sm:max-h-[90dvh] rounded shadow-md animate-in slide-in-from-top-4 backdrop:backdrop-blur backdrop:animate-in backdrop:fade-in-0"
  on:click|self={handleCancel}
  on:close={handleClose}
>
  <div class="flex flex-col max-h-full">
    <header
      class="sticky top-0 pt-3 sm:pt-6 px-3 sm:px-8 z-10 bg-trilist-fone"
    >
      <button
        class="form-button focus-visible:ring-2 text-trilist-input hover:text-trilist-hover float-right ml-2 mt-0.5 -mr-1"
        on:click={handleCancel}
      >
        {@html CloseIcon}
      </button>

      <slot name="header" />
    </header>

    <div class="flex-grow px-3 sm:px-8 bg-trilist-fone">
      <slot />
    </div>

    <footer
      class="sticky bottom-0 pt-4 pb-3 sm:pb-6 px-3 sm:px-8 z-10 bg-trilist-fone"
    >
      <!-- svelte-ignore a11y-autofocus -->
      <button
        id="trilist-dialog-select"
        class="form-button py-1 px-4 rounded border border-trilist-primary bg-trilist-primary text-white mr-2"
        autofocus
        on:click={handleSubmit}
      >
        {selectButton}
      </button>
      <button
        id="trilist-dialog-cancel"
        class="form-button py-1 px-4 rounded border text-trilist-input hover:text-trilist-hover border-trilist-input active:bg-trilist-secondary"
        on:click={handleCancel}
      >
        {cancelButton}
      </button>
    </footer>
  </div>
</dialog>
