// frontend/src/components/MovieGrid.tsx
import React from 'react';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  rating?: number;
  released?: string;
  poster_image?: string;
}

interface Props {
  movies: Movie[];
}

const MovieGrid = ({ movies }: Props) => {
  return React.createElement('div', { className: 'movie-grid' },
    movies.map(movie => 
      React.createElement(MovieCard, { key: movie.id, movie: movie })
    )
  );
};

export default MovieGrid;