<script lang="ts">
  import { Tree } from '../lib/tree'

  import plusIcon from '../assets/plus.svg'
  import minusIcon from '../assets/minus.svg'

  export let tree: Tree
</script>

<div>
  <button on:click={() => tree.expandAll()}>
    <img src={plusIcon} class="w-5" alt="Expand all" />
  </button>
  <button on:click={() => tree.collapseAll()}>
    <img src={minusIcon} class="w-5" alt="Collapse all" />
  </button>
</div>
