// frontend/src/components/SortSelector.tsx
import React from 'react';


// Props: parent-komponenten giver SortSelector en callback,
// som bliver kaldt når brugeren vælger en sorteringsmulighed.
interface Props {
  onSelectSort: (sortOrder: string) => void;
}
// Liste af mulige sorteringsvalg, som vises i dropdown-menuen
const SortSelector = ({ onSelectSort }: Props) => {
  const sortOrders = [
    { value: '', label: 'Sorter efter' },
    { value: 'rating', label: 'Rating' },
    { value: 'released', label: 'Udgivelsesdato' },
    { value: 'title', label: 'Titel' }
  ];

  return React.createElement('select', {
     // Når brugeren vælger en sortering → send value tilbage til parent
    onChange: (e: any) => onSelectSort(e.target.value),
    className: 'sort-select'
  },
  // Map over sorteringsmuligheder og lav én <option> per element
    sortOrders.map(order => 
      React.createElement('option', { key: order.value, value: order.value }, 
        order.label)// Den tekst som brugeren ser
    )
  );
};

export default SortSelector;