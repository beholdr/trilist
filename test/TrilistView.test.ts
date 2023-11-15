import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

import { treeData } from './fixtures'
import TrilistView from '../src/components/TrilistView.svelte'
import { Trilist, type TreeItem } from '../src/lib'

test('empty tree', async () => {
  const result = render(TrilistView)
  expect(() => result.getByRole('tree')).not.toThrow()
  expect(() => result.getByRole('treeitem')).toThrow()

  expect(result.component.trilist).toBeInstanceOf(Trilist)
  expect(result.component.trilist.independent).toBe(false)
  expect(result.component.trilist.leafs).toBe(false)
  expect(result.component.trilist.multiselect).toBe(false)
})

test('simple tree', async () => {
  const result = render(TrilistView, {
    independent: true,
    leafs: true,
    multiselect: true
  })

  await result.component.init({ items: treeData })

  expect(() => result.getByRole('tree')).not.toThrow()
  expect(() => result.getAllByRole('treeitem')).not.toThrow()

  expect(result.component.trilist.independent).toBe(true)
  expect(result.component.trilist.leafs).toBe(true)
  expect(result.component.trilist.multiselect).toBe(true)
})

test('label hooks', async () => {
  const result = render(TrilistView)
  await result.component.init({
    items: treeData,
    labelHook: (item: TreeItem) => '<b class="tl-label">' + item.label + '</b>'
  })

  const label = result.container.querySelector(
    '#trilist-view [role=treeitem] label:first'
  )

  expect(label).toContainHTML(
    '<b class="tl-label">' + treeData[0].label + '</b>'
  )
})

test('tree with selected items', async () => {
  const result = render(TrilistView, { multiselect: true })
  await result.component.init({ items: treeData, value: ['12', '3', '4'] })

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('aria-selected') === 'true').length
  ).toBe(4)
})

test('tree with expand selected items', async () => {
  const result = render(TrilistView, { expandSelected: true })
  await result.component.init({ items: treeData, value: ['222'] })

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('aria-expanded') === 'true').length
  ).toBe(2)
})

test('empty tree with filter', async () => {
  const result = render(TrilistView, { filter: true })

  expect(() => result.getByRole('searchbox')).toThrow()
})

test('non empty tree with filter', async () => {
  const result = render(TrilistView, {
    filter: true,
    filterPlaceholder: 'FILTER_PLACEHOLDER'
  })
  await result.component.init({ items: treeData })

  expect(() => result.getByRole('searchbox')).not.toThrow()
  expect(() => result.getByPlaceholderText('FILTER_PLACEHOLDER')).not.toThrow()
})

test('single selection tree', async () => {
  const result = render(TrilistView, { selectable: true })
  await result.component.init({ items: treeData })

  expect(() => result.getAllByRole('checkbox')).not.toThrow()
  expect(result.getByRole('tree').getAttribute('aria-multiselectable')).toBe(
    'false'
  )
})

test('multi selection tree', async () => {
  const result = render(TrilistView, { multiselect: true })
  await result.component.init({ items: treeData })

  expect(() => result.getAllByRole('checkbox')).not.toThrow()
  expect(result.getByRole('tree').getAttribute('aria-multiselectable')).toBe(
    'true'
  )
})

test('unselectable tree', async () => {
  const result = render(TrilistView)
  await result.component.init({ items: treeData })

  expect(() => result.getByRole('checkbox')).toThrow()
})

test('selectable tree', async () => {
  const result = render(TrilistView, { selectable: true })
  await result.component.init({ items: treeData })

  expect(() => result.getAllByRole('checkbox')).not.toThrow()
})

test('filtering tree', async () => {
  const result = render(TrilistView, { filter: true })
  await result.component.init({ items: treeData })

  const user = userEvent.setup()
  const input = result.getByRole('searchbox')

  await user.type(input, 'xx')

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => !el.className.includes('hidden')).length
  ).toBe(8)

  await user.type(input, 'x')

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => !el.className.includes('hidden')).length
  ).toBe(2)

  await user.type(input, 'x')

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => !el.className.includes('hidden')).length
  ).toBe(0)

  await user.type(input, '{backspace}{backspace}{backspace}{backspace}')

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => !el.className.includes('hidden')).length
  ).toBe(19)
})

test('expand/collapse all', async () => {
  const result = render(TrilistView, { filter: true })
  await result.component.init({ items: treeData })

  const user = userEvent.setup()
  const expandBtn = result.getByRole('button', { name: /Expand All/i })
  const collapseBtn = result.getByRole('button', { name: /Collapse All/i })

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('aria-expanded') === 'true').length
  ).toBe(0)

  await user.click(expandBtn)

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('aria-expanded') === 'true').length
  ).toBe(6)

  await user.click(collapseBtn)

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('aria-expanded') === 'true').length
  ).toBe(0)
})

test('change event', async () => {
  const result = render(TrilistView, {
    selectable: true,
    multiselect: true,
    leafs: true
  })
  const onChangeHook = vi.fn()

  await result.component.init({ items: treeData, onChangeHook })

  const user = userEvent.setup()
  const checkbox = result.container.querySelector(
    '#trilist-view [type=checkbox]:first'
  )

  await user.click(checkbox!)

  expect(onChangeHook).toHaveBeenCalledWith(['11', '12', '13'])
})
