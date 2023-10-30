import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

import TrilistView from '../src/components/TrilistView.svelte'
import { treeData } from './fixtures'

test('empty tree', async () => {
  const result = render(TrilistView)
  expect(() => result.getByRole('tree')).not.toThrow()
  expect(() => result.getByRole('treeitem')).toThrow()
})

test('simple tree', async () => {
  const result = render(TrilistView)
  await result.component.init({ items: treeData })

  expect(() => result.getByRole('tree')).not.toThrow()
  expect(() => result.getAllByRole('treeitem')).not.toThrow()
})

test('label hooks', async () => {
  const result = render(TrilistView)
  await result.component.init({
    items: treeData,
    labelHook: (item) => '<b class="generated-label">' + item.label + '</b>'
  })

  const label = result.container.querySelector(
    '#trilist-view [role=treeitem] label:first'
  )

  expect(label).toContainHTML(
    '<b class="generated-label">' + treeData[0].label + '</b>'
  )
})

test('tree with expanded items', async () => {
  const result = render(TrilistView)
  await result.component.init({ items: treeData, expanded: ['2', '2-21'] })

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('aria-expanded') === 'true').length
  ).toBe(2)
})

test('tree with selected items', async () => {
  const result = render(TrilistView, { multiple: true })
  await result.component.init({ items: treeData, selected: ['12', '3', '4'] })

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('aria-selected') === 'true').length
  ).toBe(4)
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
  const result = render(TrilistView, { multiple: true })
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
  ).toBe(4)

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
  ).toBe(15)
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
  ).toBe(5)

  await user.click(collapseBtn)

  expect(
    result
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('aria-expanded') === 'true').length
  ).toBe(0)
})
