<script lang="ts">
  import { Tree } from '../lib/tree'

  export let tree: Tree
</script>

<div class="mb-4 flex gap-x-2.5">
  <input
    class="flex-grow rounded border-gray-400"
    type="search"
    placeholder="Quick search"
  />
  <button
    class="expand-all-button w-10 rounded border border-gray-400 hover:border-gray-500"
    title="Expand all"
    on:click={() => tree.expandAll()}
  />
  <button
    class="collapse-all-button w-10 rounded border border-gray-400 hover:border-gray-500"
    title="Collapse all"
    on:click={() => tree.collapseAll()}
  />
</div>

<style lang="postcss">
  .expand-all-button {
    background: svg-load('../assets/expand.svg', fill=rgb(156 163 175))
      no-repeat 50%;
  }
  .collapse-all-button {
    background: svg-load('../assets/collapse.svg', fill=rgb(156 163 175))
      no-repeat 50%;
  }
</style>
