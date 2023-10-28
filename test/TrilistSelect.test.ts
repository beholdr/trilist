import { render, screen, type RenderResult } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

import TrilistSelect from '../src/components/TrilistSelect.svelte'
import { treeData } from './fixtures'

const showModal = async (result: RenderResult<TrilistSelect>) => {
  const user = userEvent.setup()
  const button = result.container.querySelector('.trilist-select > button')

  await user.click(button!)
}

test('empty select', async () => {
  const result = render(TrilistSelect)

  expect(result.getByRole('combobox')).toBeInTheDocument()
})

test('show dialog', async () => {
  const result = render(TrilistSelect)

  expect(
    result.container.querySelector('#trilist-select-dialog')
  ).not.toBeVisible()

  await showModal(result)

  expect(result.container.querySelector('#trilist-select-dialog')).toBeVisible()
})

test('select with custom labels', async () => {
  const result = render(TrilistSelect, {
    filter: true,
    filterPlaceholder: 'FILTER_PLACEHOLDER',
    placeholder: 'PROP_PLACEHOLDER',
    selectButton: 'SELECT_BUTTON',
    cancelButton: 'CANCEL_BUTTON'
  })

  expect(() => result.getByPlaceholderText('FILTER_PLACEHOLDER')).not.toThrow()

  expect(
    result.container.querySelector('#trilist-select-dialog footer')
  ).toHaveTextContent('SELECT_BUTTON')

  expect(
    result.container.querySelector('#trilist-select-dialog footer')
  ).toHaveTextContent('CANCEL_BUTTON')

  expect(
    result.container.querySelector('.trilist-select > button')
  ).toHaveTextContent('PROP_PLACEHOLDER')

  expect(
    result.container.querySelector('#trilist-select-dialog header h2')
  ).toHaveTextContent('PROP_PLACEHOLDER')
})

test('with selected items', async () => {
  const result = render(TrilistSelect, { multiselect: true })
  await result.component.init({ items: treeData, selected: ['12', '3', '4'] })

  expect(
    result.container.querySelectorAll('.trilist-select .trilist-chip')
      .length
  ).toBe(3)

  const user = userEvent.setup()
  const button = result.container.querySelector(
    '.trilist-select .trilist-chip:first > button'
  )

  await user.click(button!)

  expect(
    result.container.querySelectorAll('.trilist-select > button .trilist-chip')
      .length
  ).toBe(2)
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

test('single selection select', async () => {
  const result = render(TrilistSelect, { multiselect: true })
  await result.component.init({ items: treeData })

  await showModal(result)

  expect(() => result.getAllByRole('checkbox')).not.toThrow()
  expect(result.getByRole('tree').getAttribute('aria-multiselectable')).toBe(
    'true'
  )
})
