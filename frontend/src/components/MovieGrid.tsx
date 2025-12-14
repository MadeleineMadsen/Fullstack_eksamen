import React from 'react';
import MovieCard from './MovieCard';

// Movie-interface bruges til at sikre at grid-komponenten kun modtager
// de properties som MovieCard skal bruge.
interface Movie {
  id: number;
  title: string;
  rating?: number;
  released?: string;
  poster_image?: string;
}

// Props: MovieGrid modtager en liste af film der skal vises
interface Props {
  movies: Movie[];
}

const MovieGrid = ({ movies }: Props) => {
  return React.createElement('div', { className: 'movie-grid' },    // Container som styres via CSS-grid i styling
    movies.map(movie => 
      React.createElement(MovieCard, { key: movie.id,   // React key for at optimere rendering
        movie: movie })   // Sender hele movie-objektet videre til MovieCard
    )
  );
};

export default MovieGrid;