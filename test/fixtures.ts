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
      }
    ]
  },
  {
    id: '3',
    label: 'Category 3'
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
