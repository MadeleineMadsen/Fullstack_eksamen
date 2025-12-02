// frontend/src/components/MovieCard.tsx
import React from 'react';

const MovieCard = ({ movie }: any) => {
  const handleClick = () => {
    // Midlertidig løsning - brug window.location indtil router virker
    window.location.href = `/movies/${movie.id}`;
  };

  return React.createElement('div', { 
    className: 'movie-card',
    onClick: handleClick,
    style: { cursor: 'pointer' }
  },
    React.createElement('img', { 
      src: movie.poster_image, 
      alt: movie.title, 
      className: 'movie-card-image' 
    }),
    React.createElement('div', { className: 'movie-card-content' },
      React.createElement('h3', null, movie.title),
      React.createElement('div', null, '⭐ ', movie.rating),
      React.createElement('p', null, movie.released?.substring(0, 4))
    )
  );
};

export default MovieCard;