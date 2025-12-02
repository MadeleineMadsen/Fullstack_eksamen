// frontend/src/components/SearchInput.tsx
import React from 'react';

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  return React.createElement('input', {
    type: 'text',
    placeholder: 'Søg efter film...',
    onChange: (e: any) => onSearch(e.target.value),
    className: 'search-input'
  });
};

export default SearchInput;