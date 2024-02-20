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

  expect(trilist.independent).toBe(false)
  expect(trilist.leafs).toBe(false)
  expect(trilist.multiselect).toBe(false)
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

test('set value multiselect', () => {
  const trilist = createTrilist({
    items: treeData,
    multiselect: true,
    leafs: true
  })

  expect(trilist.getValue()).toEqual([])

  trilist.setValue(1)

  expect(trilist.getValue()).toEqual(['11', '12', '13'])

  trilist.setValue(['4'])

  expect(trilist.getValue()).toEqual(['41'])
})

test('set value single', () => {
  const trilist = createTrilist({ items: treeData })

  expect(trilist.getValue()).toEqual([])

  trilist.setValue(1)

  expect(trilist.getValue()).toEqual(['1'])

  trilist.setValue(['4'])

  expect(trilist.getValue()).toEqual(['4'])
})

test('set null value', () => {
  const trilist = createTrilist({ items: treeData })

  expect(trilist.getValue()).toEqual([])

  trilist.setValue(1)

  expect(trilist.getValue()).toEqual(['1'])

  trilist.setValue(null)

  expect(trilist.getValue()).toEqual([])
})

test('set value as string', () => {
  const trilist = createTrilist({ items: treeData })

  expect(trilist.getValue()).toEqual([])

  trilist.setValue('1')

  expect(trilist.getValue()).toEqual(['1'])
})

test('non existent value', () => {
  const trilist = createTrilist({ items: treeData, value: 999 })

  expect(trilist.getValue()).toEqual([])
})

test('single select', () => {
  const onChangeHook = vi.fn()
  const trilist = createTrilist({ items: treeData, onChangeHook })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.multiselect).toBe(false)
  expect(trilist.getValue()).toEqual(['1'])

  trilist.dispatchChangeEvent()
  expect(onChangeHook).toHaveBeenCalledWith('1')

  trilist.toggleSelected(trilist.findItemById(1)!, false)
  expect(trilist.getValue()).toEqual([])

  trilist.dispatchChangeEvent()
  expect(onChangeHook).toHaveBeenCalledWith(null)
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
  expect(trilist.getValue()).toEqual(['1'])

  trilist.dispatchChangeEvent()
  expect(onChangeHook).toHaveBeenCalledWith(['1'])
})

test('no leafs', () => {
  const trilist = createTrilist({ items: treeData })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.leafs).toBe(false)
  expect(trilist.getValue()).toEqual(['1'])
})

test('independent', () => {
  const trilist = createTrilist({
    items: treeData,
    multiselect: true,
    independent: true
  })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.independent).toBe(true)
  expect(trilist.getValue()).toEqual(['1'])

  trilist.toggleSelected(trilist.findItemById('5')!)
  expect(trilist.getValue()).toEqual(['1', '5'])

  trilist.toggleSelected(trilist.findItemById('51')!)
  expect(trilist.getValue()).toEqual(['1', '5', '51'])

  trilist.toggleSelected(trilist.findItemById('5')!, false)
  expect(trilist.getValue()).toEqual(['1', '51'])

  expect(get(trilist.indeterminate).size).toBe(0)
})

test('leafs', () => {
  const trilist = createTrilist({
    items: treeData,
    leafs: true,
    multiselect: true
  })

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.leafs).toBe(true)
  expect(trilist.getValue()).toEqual(['11', '12', '13'])
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

  expect([...get(trilist.expanded)]).toEqual([
    '1',
    '2',
    '2.21',
    '2.22',
    '4',
    '5'
  ])
})

test('collapse all', () => {
  const trilist = createTrilist({ items: treeData })

  trilist.collapseAll()

  expect(get(trilist.expanded).size).toBe(0)
})

test('find item', () => {
  const trilist = createTrilist({ items: treeData })

  trilist.collapseAll()

  expect(trilist.findItemById(1)?.id).toEqual(treeData[0].id.toString())
  expect(trilist.findItemById('1')?.id).toEqual(treeData[0].id.toString())
})

test('parent selection and clear for multiselect', () => {
  const trilist = createTrilist({
    items: treeData,
    multiselect: true,
    leafs: true
  })

  const parent = trilist.findItemById('4')!
  const child = trilist.findItemById('41')!

  trilist.toggleSelected(parent)

  expect(trilist.getValue()).toEqual(['41'])

  trilist.toggleSelected(child, false)

  expect(trilist.getValue()).toEqual([])
})

test('parent selection and clear for single', () => {
  const trilist = createTrilist({
    items: treeData
  })

  const parent = trilist.findItemById('4')!
  const child = trilist.findItemById('41')!

  trilist.toggleSelected(parent)

  expect(trilist.getValue()).toEqual(['4'])

  trilist.toggleSelected(child)

  expect(trilist.getValue()).toEqual(['41'])

  trilist.toggleSelected(child, false)

  expect(trilist.getValue()).toEqual([])
})

test('set value as single', () => {
  const trilist = createTrilist({ items: treeData, value: '41' })

  expect(trilist.getValue()).toEqual(['41'])
})

test('set value as array', () => {
  const trilist = createTrilist({ items: treeData, value: ['41'] })

  expect(trilist.getValue()).toEqual(['41'])
})

test('no expand selected', () => {
  const trilist = createTrilist({ items: treeData, value: '41' })

  expect(trilist.getValue()).toEqual(['41'])
  expect(get(trilist.expanded).size).toBe(0)
})

test('expand selected', () => {
  const trilist = createTrilist({
    items: treeData,
    value: '41',
    expandSelected: true
  })

  expect(trilist.getValue()).toEqual(['41'])
  expect([...get(trilist.expanded)]).toEqual(['4'])
})

test('expand selected category', () => {
  const trilist = createTrilist({
    items: treeData,
    value: '22',
    multiselect: true,
    expandSelected: true
  })

  expect(trilist.getValue()).toEqual(['22'])
  expect([...get(trilist.expanded)]).toEqual(['2'])
})

test('expand selected category with leafs', () => {
  const trilist = createTrilist({
    items: treeData,
    value: '22',
    multiselect: true,
    leafs: true,
    expandSelected: true
  })

  expect(trilist.getValue()).toEqual(['221', '222'])
  expect([...get(trilist.expanded)]).toEqual(['2', '2.22'])
})

test('indeterminate state', () => {
  const trilist = createTrilist({
    items: treeData,
    value: '222',
    multiselect: true
  })

  expect(trilist.getValue()).toEqual(['222'])
  expect([...get(trilist.indeterminate)]).toEqual(['2', '2.22'])

  trilist.toggleSelected(trilist.findItemById('222')!, false)

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)
})

test('indeterminate child check / uncheck', () => {
  const trilist = createTrilist({
    items: treeData,
    value: '2',
    multiselect: true,
    expandSelected: true
  })

  expect(trilist.getValue()).toEqual(['2'])
  expect([...get(trilist.indeterminate)]).toEqual(['1'])

  const item = trilist.findItemById('221')

  trilist.toggleSelected(item!, false)

  expect(trilist.getValue()).toEqual(['21', '222'])
  expect([...get(trilist.indeterminate)]).toEqual(['1', '2', '2.22'])

  trilist.toggleSelected(item!, true)

  expect(trilist.getValue()).toEqual(['2'])
  expect([...get(trilist.indeterminate)]).toEqual(['1'])
})

test('single children select', () => {
  const trilist = createTrilist({ items: treeData })

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)

  const item5 = trilist.findItemById('5')
  const item51 = trilist.findItemById('51')
  const item52 = trilist.findItemById('52')

  trilist.toggleSelected(item5!, true)

  expect(trilist.getValue()).toEqual(['5'])
  expect(get(trilist.indeterminate).size).toBe(0)

  trilist.toggleSelected(item51!, true)

  expect(trilist.getValue()).toEqual(['51'])
  expect([...get(trilist.indeterminate)]).toEqual(['5'])

  trilist.toggleSelected(item52!, true)

  expect(trilist.getValue()).toEqual(['52'])
  expect([...get(trilist.indeterminate)]).toEqual(['5'])

  trilist.toggleSelected(item52!, false)

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)
})

test('indeterminate child single', () => {
  const trilist = createTrilist({
    items: treeData,
    value: '221',
    expandSelected: true
  })

  expect(trilist.getValue()).toEqual(['221'])
  expect([...get(trilist.indeterminate)]).toEqual(['2', '2.22'])

  const item2 = trilist.findItemById('2')
  const item22 = trilist.findItemById('22')
  const item221 = trilist.findItemById('221')

  trilist.toggleSelected(item221!, false)

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)

  trilist.toggleSelected(item2!, true)

  expect(trilist.getValue()).toEqual(['2'])
  expect(get(trilist.indeterminate).size).toBe(0)

  trilist.toggleSelected(item22!, true)

  expect(trilist.getValue()).toEqual(['22'])
  expect([...get(trilist.indeterminate)]).toEqual(['2'])

  trilist.toggleSelected(item221!, true)

  expect(trilist.getValue()).toEqual(['221'])
  expect([...get(trilist.indeterminate)]).toEqual(['2', '2.22'])
})

test('filtering', () => {
  const trilist = createTrilist({ items: treeData })

  expect(get(trilist.hidden).size).toBe(0)

  trilist.filter('xx')

  expect(get(trilist.hidden).size).toBe(11)

  trilist.filter('xxx')

  expect(get(trilist.hidden).size).toBe(17)

  trilist.filter('xxxx')

  expect(get(trilist.hidden).size).toBe(19)
})

test('disabled multi select', () => {
  const trilist = createTrilist({
    items: treeData,
    disabled: '21',
    multiselect: true
  })

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.getValue()).toEqual(['12', '13'])
  expect([...get(trilist.indeterminate)]).toEqual(['1'])

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.getValue()).toEqual(['12', '13'])
  expect([...get(trilist.indeterminate)]).toEqual(['1'])

  trilist.toggleSelected(trilist.findItemById('12')!, false)

  expect(trilist.getValue()).toEqual(['13'])
  expect([...get(trilist.indeterminate)]).toEqual(['1'])

  trilist.toggleSelected(trilist.findItemById(1)!)

  expect(trilist.getValue()).toEqual(['13', '12'])
  expect([...get(trilist.indeterminate)]).toEqual(['1'])

  trilist.toggleSelected(trilist.findItemById('12')!, false)

  expect(trilist.getValue()).toEqual(['13'])
  expect([...get(trilist.indeterminate)]).toEqual(['1'])

  trilist.toggleSelected(trilist.findItemById('13')!, false)

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)
})

test('disabled multi select deep', () => {
  const trilist = createTrilist({
    items: treeData,
    disabled: '21',
    multiselect: true
  })

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)

  trilist.toggleSelected(trilist.findItemById('21')!)

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)

  trilist.toggleSelected(trilist.findItemById('11')!)

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)

  trilist.toggleSelected(trilist.findItemById('221')!)

  expect(trilist.getValue()).toEqual(['221'])
  expect([...get(trilist.indeterminate)]).toEqual(['2', '2.22'])

  trilist.toggleSelected(trilist.findItemById('222')!)

  expect(trilist.getValue()).toEqual(['22'])
  expect([...get(trilist.indeterminate)]).toEqual(['2'])

  trilist.toggleSelected(trilist.findItemById('2')!)

  expect(trilist.getValue()).toEqual(['22'])
  expect([...get(trilist.indeterminate)]).toEqual(['2'])

  trilist.toggleSelected(trilist.findItemById('22')!, false)

  expect(trilist.getValue()).toEqual([])
  expect(get(trilist.indeterminate).size).toBe(0)
})

test('set disabled as single', () => {
  const trilist = createTrilist({ items: treeData, disabled: '41' })

  expect([...get(trilist.disabled)]).toEqual(['41'])
})

test('set disabled as array', () => {
  const trilist = createTrilist({ items: treeData, disabled: ['41'] })

  expect([...get(trilist.disabled)]).toEqual(['41'])
})

test('non existent disabled', () => {
  const trilist = createTrilist({ items: treeData, disabled: 999 })

  expect(get(trilist.disabled).size).toBe(0)
})
