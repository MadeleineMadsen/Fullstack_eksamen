// frontend/src/components/GenreList.tsx
import React from 'react';

interface Props {
  onSelectGenre: (genreId: number) => void;
}

const GenreList = ({ onSelectGenre }: Props) => {
  const genres = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Komedie' },
    { id: 18, name: 'Drama' },
    { id: 878, name: 'Sci-Fi' }
  ];

  return React.createElement('select', {
    onChange: (e: any) => onSelectGenre(parseInt(e.target.value)),
    className: 'genre-select'
  },
    React.createElement('option', { value: '' }, 'Vælg genre'),
    genres.map(genre => 
      React.createElement('option', { key: genre.id, value: genre.id }, genre.name)
    )
  );
};

export default GenreList;