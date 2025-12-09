// frontend/src/components/GenreList.tsx
import React from 'react';

// Props til komponenten:
// onSelectGenre → callback-funktion der modtager det valgte genre-ID
interface Props {
  onSelectGenre: (genreId: number) => void;
}

const GenreList = ({ onSelectGenre }: Props) => {
  // Liste over faste genrer som TMDB bruger.
  // Dette er en simpel hardcoded liste for projektets skyld.
  const genres = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Komedie' },
    { id: 18, name: 'Drama' },
    { id: 878, name: 'Sci-Fi' }
  ];

  // Komponentens returværdi er et <select>-element med options.
  // Når brugeren vælger en genre → kaldes onSelectGenre(genreId).
  return React.createElement('select', {
    onChange: (e: any) => onSelectGenre(parseInt(e.target.value)), // parse til number
    className: 'genre-select' // CSS-klasse så den kan styles
  },
    React.createElement('option', { value: '' }, 'Vælg genre'),
    // Generér én <option> pr. genre i listen
    genres.map(genre => 
      React.createElement('option', { key: genre.id, value: genre.id }, genre.name)
    )
  );
};

export default GenreList;