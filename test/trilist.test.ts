import { get } from 'svelte/store'

import { Trilist, type TreeItem, type TrilistOptions } from '../src/lib/trilist'
import { treeData, treeDataAlt } from './fixtures'

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
  expect(trilist.onChangeHook).toBeUndefined()
})

test('init with alt fields', () => {
  const trilist = createTrilist({
    items: treeDataAlt,
    fieldId: 'key',
    fieldLabel: 'name',
    fieldChildren: 'items'
  })

  expectTypeOf(trilist.items).toMatchTypeOf<TreeItem[]>()
  expect(trilist.items.length).toBe(2)
})

test('no items init', () => {
  const trilist = createTrilist({})

  expectTypeOf(trilist.items).toMatchTypeOf<TreeItem[]>()
  expect(trilist.items.length).toBe(0)
})

test('single select', () => {
  const onChangeHook = vi.fn()
  const trilist = createTrilist({ items: treeData, onChangeHook })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.multiselect).toBe(false)
  expect(trilist.getValue()).toEqual([1])

  trilist.dispatchChangeEvent()
  expect(onChangeHook).toHaveBeenCalledWith(1)
})

test('multi select', () => {
  const onChangeHook = vi.fn()
  const trilist = createTrilist({
    items: treeData,
    onChangeHook,
    multiselect: true
  })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.multiselect).toBe(true)
  expect(trilist.getValue()).toEqual([1])

  trilist.dispatchChangeEvent()
  expect(onChangeHook).toHaveBeenCalledWith([1])
})

test('no leafs', () => {
  const trilist = createTrilist({ items: treeData })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.leafs).toBe(false)
  expect(trilist.getValue()).toEqual([1])
})

test('leafs', () => {
  const trilist = createTrilist({
    items: treeData,
    leafs: true,
    multiselect: true
  })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.leafs).toBe(true)
  expect(trilist.getValue()).toEqual(['11', '12'])
})

test('leafs with single select', () => {
  const onChangeHook = vi.fn()
  const trilist = createTrilist({ items: treeData, onChangeHook, leafs: true })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.leafs).toBe(true)
  expect(trilist.getValue()).toEqual([])

  trilist.dispatchChangeEvent()
  expect(onChangeHook).toHaveBeenCalledWith(null)
})

test('label hook', () => {
  const labelHook = vi.fn(() => 'NEW_LABEL')
  const trilist = createTrilist({ items: treeData, labelHook })

  expectTypeOf(trilist.labelHook!).toBeFunction()

  const item = trilist.findItemById(1)
  const label = trilist.getItemLabel(item!)

  expect(labelHook).toHaveBeenCalledOnce()
  expect(label).toBe('NEW_LABEL')
})

test('expand all', () => {
  const trilist = createTrilist({ items: treeData })

  trilist.expandAll()

  expect([...get(trilist.expanded)]).toEqual(['1', '2', '2-21', '2-22', '4', '5'])
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
