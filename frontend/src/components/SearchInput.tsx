// frontend/src/components/SearchInput.tsx
import React from 'react';

// Props-type: komponenten modtager en callback-funktion,
// som bliver kaldt hver gang brugeren skriver i søgefeltet.
interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  return React.createElement('input', {
    type: 'text',                     // Tekst der vises før brugeren skriver
    placeholder: 'Søg efter film...', // CSS klasse til styling

    // onChange-eventet kalder onSearch med den aktuelle tekst
    // og giver dermed live-søgning i filmlisten
    onChange: (e: any) => onSearch(e.target.value),
    className: 'search-input'
  });
};

export default SearchInput;