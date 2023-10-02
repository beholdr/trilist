<script lang="ts">
  import { treeLib } from '../lib/tree'

  import plusIcon from '../assets/plus.svg'
  import minusIcon from '../assets/minus.svg'
</script>

<div class="float-right text-sm">
  <button on:click={treeLib.expandAll}>
    <img src={plusIcon} class="w-5" alt="Expand all" />
  </button>
  <button on:click={treeLib.collapseAll}>
    <img src={minusIcon} class="w-5" alt="Collapse all" />
  </button>
</div>
