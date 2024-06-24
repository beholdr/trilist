;(function () {
  function trilistPlugin(hook) {
    hook.mounted(async () => {
      const treeData = await fetch('treedata.json').then((r) => r.json())

      await Promise.allSettled([
        customElements.whenDefined('trilist-view'),
        customElements.whenDefined('trilist-select'),
      ])

      document
        .querySelectorAll('trilist-view')
        .forEach((el) => el.init({ items: treeData }))
      document
        .querySelectorAll('trilist-select')
        .forEach((el) => el.init({ items: treeData }))
    })
  }

  $docsify = $docsify || {}
  $docsify.plugins = [].concat($docsify.plugins || [], trilistPlugin)
})()
