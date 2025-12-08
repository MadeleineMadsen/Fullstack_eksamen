// frontend/src/components/MovieDetailPage.tsx
import React from 'react';

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  released?: string;
  runtime?: number;
  rating?: number;
  poster_image?: string;
  background_image?: string;
  director?: string;
}

interface Props {
  movie?: Movie;
}


const MovieDetailPage = ({ movie }: Props) => {
  // TJEK: Hvis movie er undefined, returnér loading
  if (!movie) {
    return React.createElement('div', { className: 'movie-detail' },
      React.createElement('div', null, 'Henter film...')
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  return React.createElement('div', { className: 'movie-detail' },
    React.createElement('div', { className: 'movie-detail-header' },
      React.createElement('img', { 
        src: movie.background_image, 
        alt: movie.title,
        className: 'movie-detail-background' 
      }),
      React.createElement('button', {
        className: 'back-button',
        onClick: handleBack
      }, '← Tilbage')
    ),
    React.createElement('div', { className: 'movie-detail-content' },
      React.createElement('img', {
        src: movie.poster_image,
        alt: movie.title,
        className: 'movie-detail-poster'
      }),
      React.createElement('div', { className: 'movie-detail-info' },
        React.createElement('h1', null, movie.title),
        React.createElement('div', { className: 'movie-detail-rating' },
          '⭐ ', movie.rating, '/10'
        ),
        React.createElement('p', null, 'Udgivet: ', movie.released),
        React.createElement('p', null, 'Varighed: ', movie.runtime, ' minutter'),
        React.createElement('p', null, 'Instruktør: ', movie.director),
        React.createElement('p', { className: 'movie-detail-overview' }, movie.overview)
      )
    )
  );
};

export default MovieDetailPage;