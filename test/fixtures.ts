export const treeData = [
  {
    id: 1,
    label: 'Category 1',
    children: [
      { id: '11', label: 'Leaf 11' },
      { id: '12', label: 'Leaf 12 xx' }
    ]
  },
  {
    id: '2',
    label: 'Category 2',
    children: [
      { id: '11', label: 'Leaf 11 (category 2)' },
      {
        id: '21',
        label: 'Category with very long name 21 zz',
        children: [
          { id: '11', label: 'Leaf 11 (category 21)' },
          { id: '211', label: 'Leaf with very long name too 211 zzz' },
          { id: '212', label: 'Leaf 212' }
        ]
      },
      {
        id: '22',
        label: 'Category 22',
        children: [
          { id: '221', label: 'Leaf 221' },
          { id: '222', label: 'Leaf 222' }
        ]
      }
    ]
  },
  {
    id: '3',
    label: 'Category 3',
    children: []
  },
  {
    id: '4',
    label: 'Category 4',
    children: [{ id: '41', label: 'Leaf 41' }]
  },
  {
    id: '5',
    label: 'Category 5',
    children: [
      { id: '51', label: 'Leaf 51' },
      { id: '52', label: 'Leaf 52 xxx' }
    ]
  }
]

export const treeDataAlt = [
  {
    key: 1,
    name: 'Category 1',
    items: [
      { key: '11', label: 'Leaf 11' },
      { key: '12', label: 'Leaf 12 xx' }
    ]
  },
  {
    key: '2',
    name: 'Category 2',
    items: [
      { key: '11', name: 'Leaf 11 (category 2)' },
      {
        key: '21',
        name: 'Category with very long name 21 zz',
        items: [
          { key: '11', name: 'Leaf 11 (category 21)' },
          { key: '211', name: 'Leaf with very long name too 211 zzz' },
          { key: '212', name: 'Leaf 212' }
        ]
      }
    ]
  }
]
