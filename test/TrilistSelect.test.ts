import { render, type RenderResult } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

import { treeData } from './fixtures'
import TrilistSelect from '../src/components/TrilistSelect.svelte'
import { Trilist } from '../src/lib'

const showModal = async (result: RenderResult<TrilistSelect>) => {
  const user = userEvent.setup()
  const button = result.container.querySelector('.trilist-select-button')

  await user.click(button!)
}

test('empty select', async () => {
  const result = render(TrilistSelect)

  expect(result.getByRole('combobox')).toBeInTheDocument()

  expect(result.component.trilist).toBeInstanceOf(Trilist)
  expect(result.component.trilist.independent).toBe(false)
  expect(result.component.trilist.leafs).toBe(false)
  expect(result.component.trilist.multiselect).toBe(false)
})

test('simple select', async () => {
  const result = render(TrilistSelect, {
    independent: true,
    leafs: true,
    multiselect: true
  })

  await result.component.init({ items: treeData })

  expect(result.component.trilist.independent).toBe(true)
  expect(result.component.trilist.leafs).toBe(true)
  expect(result.component.trilist.multiselect).toBe(true)
})

test('show dialog', async () => {
  const result = render(TrilistSelect)

  expect(result.container.querySelector('#trilist-dialog')).not.toBeVisible()

  await showModal(result)

  expect(result.container.querySelector('#trilist-dialog')).toBeVisible()
})

test('custom labels', async () => {
  const result = render(TrilistSelect, {
    filter: true,
    filterPlaceholder: 'FILTER_PLACEHOLDER',
    placeholder: 'PROP_PLACEHOLDER',
    selectButton: 'SELECT_BUTTON',
    cancelButton: 'CANCEL_BUTTON'
  })

  expect(() => result.getByPlaceholderText('FILTER_PLACEHOLDER')).not.toThrow()

  expect(
    result.container.querySelector('.trilist-dialog-select')
  ).toHaveTextContent('SELECT_BUTTON')

  expect(
    result.container.querySelector('.trilist-dialog-cancel')
  ).toHaveTextContent('CANCEL_BUTTON')

  expect(
    result.container.querySelector('.trilist-select-button')
  ).toHaveTextContent('PROP_PLACEHOLDER')

  expect(
    result.container.querySelector('#trilist-dialog header')
  ).toHaveTextContent('PROP_PLACEHOLDER')
})

test('single selection select', async () => {
  const result = render(TrilistSelect)
  await result.component.init({ items: treeData })

  await showModal(result)

  expect(() => result.getAllByRole('checkbox')).not.toThrow()
  expect(result.getByRole('tree').getAttribute('aria-multiselectable')).toBe(
    'false'
  )
})

test('multi selection select', async () => {
  const result = render(TrilistSelect, { multiselect: true })
  await result.component.init({ items: treeData })

  await showModal(result)

  expect(() => result.getAllByRole('checkbox')).not.toThrow()
  expect(result.getByRole('tree').getAttribute('aria-multiselectable')).toBe(
    'true'
  )
})

test('single selection with selected item', async () => {
  const result = render(TrilistSelect)
  await result.component.init({ items: treeData, value: ['12', '3', '4'] })

  expect(
    result.container.querySelectorAll('.trilist-select-tags .trilist-tag')
      .length
  ).toBe(0)

  expect(
    result.container.querySelector('.trilist-select-button > div')
  ).toHaveTextContent('Leaf 12')
})

test('multi selection with selected items', async () => {
  const result = render(TrilistSelect, { multiselect: true })
  await result.component.init({ items: treeData, value: ['12', '3', '4'] })

  expect(
    result.container.querySelectorAll('.trilist-select-tags .trilist-tag')
      .length
  ).toBe(3)

  const user = userEvent.setup()
  const button = result.container.querySelector(
    '.trilist-select-tags .trilist-tag:first > button'
  )

  await user.click(button!)

  expect(
    result.container.querySelectorAll('.trilist-select-tags .trilist-tag')
      .length
  ).toBe(2)
})

test('change event', async () => {
  const result = render(TrilistSelect)
  const onChangeHook = vi.fn()

  await result.component.init({ items: treeData, onChangeHook })

  const user = userEvent.setup()
  const checkbox = result.container.querySelector(
    '.trilist-view [type=checkbox]:first'
  )
  const selectBtn = result.container.querySelector('.trilist-dialog-select')
  const cancelBtn = result.container.querySelector('.trilist-dialog-cancel')

  await showModal(result)
  await user.click(checkbox!)
  await user.click(cancelBtn!)

  expect(
    result.container.querySelector('.trilist-select-button > div')
  ).not.toHaveTextContent('Category 1')

  expect(onChangeHook).not.toHaveBeenCalled()

  await showModal(result)
  await user.click(checkbox!)
  await user.click(selectBtn!)

  expect(
    result.container.querySelector('.trilist-select-button > div')
  ).toHaveTextContent('Category 1')

  expect(onChangeHook).toHaveBeenCalledWith(1)
})

test('disabled', async () => {
  const result = render(TrilistSelect, { disabled: true })

  expect(
    result.container.querySelector('.trilist-select-button')
  ).toBeDisabled()

  expect(
    result.container.querySelectorAll(
      '.trilist-select-tags .trilist-tag:not:disabled'
    ).length
  ).toBe(0)

  await showModal(result)

  expect(result.container.querySelector('#trilist-dialog')).not.toBeVisible()
})
