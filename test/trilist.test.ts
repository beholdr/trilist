import { get } from 'svelte/store'

import { Trilist, type TreeItem, type TrilistOptions } from '../src/lib/trilist'
import { treeData } from './fixtures'

const createTrilist = (options: TrilistOptions) => {
  const trilist = new Trilist()
  trilist.init(document.createElement('div'), options)

  return trilist
}

test('init', () => {
  const trilist = createTrilist({ items: treeData })

  expectTypeOf(trilist.items).toMatchTypeOf<TreeItem[]>()
  expect(trilist.items.length).toBe(5)

  expect(trilist.multiselect).toBe(false)
  expect(trilist.leafs).toBe(false)
  expect(trilist.labelHook).toBeUndefined()
})

test('init with multiselect', () => {
  const trilist = createTrilist({ items: treeData, multiselect: true })

  expect(trilist.multiselect).toBe(true)
  expect(trilist.leafs).toBe(false)
})

test('init with leafs', () => {
  const trilist = createTrilist({ items: treeData, leafs: true })

  expect(trilist.multiselect).toBe(false)
  expect(trilist.leafs).toBe(true)
})

test('label hook', () => {
  const labelHook = vi.fn()
  const trilist = createTrilist({ items: treeData, labelHook })

  expectTypeOf(trilist.labelHook!).toBeFunction()

  const item = trilist.findItemById(1)
  trilist.getLabel(item!)

  expect(labelHook).toHaveBeenCalledOnce()
})

test('expand all', () => {
  const trilist = createTrilist({ items: treeData })

  trilist.expandAll()

  expect([...get(trilist.expanded)]).toEqual(['1', '2', '2-21', '4', '5'])
})

test('collapse all', () => {
  const trilist = createTrilist({ items: treeData })

  trilist.collapseAll()

  expect(get(trilist.expanded).size).toBe(0)
})

test('find item', () => {
  const trilist = createTrilist({ items: treeData })

  trilist.collapseAll()

  expect(trilist.findItemById(1)?.id).toEqual(treeData[0].id)
  expect(trilist.findItemById('1')).toBe(null)
})
