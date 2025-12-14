import React from 'react';

// Props til komponenten:
// onSelectGenre → callback-funktion der modtager det valgte genre-ID
interface Props {
  onSelectGenre: (genreId: number) => void;
}

// Viser en dropdown (<select>) med faste filmgenrer
const GenreList = ({ onSelectGenre }: Props) => {

  // Hardcoded liste af genrer
  // ID'erne matcher TMDB's officielle genre-ID'er
  // Bruges til filtrering af film
  const genres = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Komedie' },
    { id: 18, name: 'Drama' },
    { id: 878, name: 'Sci-Fi' }
  ];

  // Returnerer et <select>-element lavet med React.createElement
  // Når brugeren vælger en genre, kaldes onSelectGenre med genre-ID
  return React.createElement('select', {
    
    // onChange trigger når brugeren vælger en ny option
    onChange: (e: any) =>
      
      // e.target.value er string → parses til number
      onSelectGenre(parseInt(e.target.value)), // parse til number
      
      // CSS-klasse så den kan styles
      className: 'genre-select'
  },
  // Standard option (ingen genre valgt)
    React.createElement('option', { value: '' }, 'Vælg genre'),
    
    // Opret én <option> for hver genre i listen
    genres.map(genre => 
      React.createElement('option', { key: genre.id, value: genre.id }, genre.name)
    )
  );
};

export default GenreList;