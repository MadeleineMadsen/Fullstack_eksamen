// frontend/src/components/SortSelector.tsx
import React from 'react';

interface Props {
  onSelectSort: (sortOrder: string) => void;
}

const SortSelector = ({ onSelectSort }: Props) => {
  const sortOrders = [
    { value: '', label: 'Sorter efter' },
    { value: 'rating', label: 'Rating' },
    { value: 'released', label: 'Udgivelsesdato' },
    { value: 'title', label: 'Titel' }
  ];

  return React.createElement('select', {
    onChange: (e: any) => onSelectSort(e.target.value),
    className: 'sort-select'
  },
    sortOrders.map(order => 
      React.createElement('option', { key: order.value, value: order.value }, order.label)
    )
  );
};

export default SortSelector;