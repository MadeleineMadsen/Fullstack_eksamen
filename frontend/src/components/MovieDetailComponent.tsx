// frontend/src/components/MovieDetailPage.tsx
import React from 'react';

// Filminterface der matcher de data vi viser i detaljevisningen
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

// Props til komponenten: movie kan være undefined hvis data ikke er hentet endnu
interface Props {
  movie?: Movie;
}

// Hvis ingen film-data er tilgængelig endnu → vis loading-tekst
const MovieDetailPage = ({ movie }: Props) => {
  // TJEK: Hvis movie er undefined, returnér loading
  if (!movie) {
    return React.createElement('div', { className: 'movie-detail' },
      React.createElement('div', null, 'Henter film...')
    );
  }
// Simpel "tilbage" funktion der hopper til forrige side i browserhistorikke
  const handleBack = () => {
    window.history.back();
  };

    // Hovedlayout for film-detail-siden
  return React.createElement('div', { className: 'movie-detail' },


     // --- HERO SEKTION MED BAGGRUNDSBILLEDE OG TILBAGE-KNAP ---
    React.createElement('div', { className: 'movie-detail-header' },

      // Baggrundsbillede (stor banner)
      React.createElement('img', { 
        src: movie.background_image, 
        alt: movie.title,
        className: 'movie-detail-background' 
      }),
      // Tilbage-knap
      React.createElement('button', {
        className: 'back-button',
        onClick: handleBack
      }, '← Tilbage')
    ),

    // --- MAIN CONTENT: POSTER, INFORMATION, BESKRIVELSE ---
    React.createElement('div', { className: 'movie-detail-content' },
      // Filmens poster-billede
      React.createElement('img', {
        src: movie.poster_image,
        alt: movie.title,
        className: 'movie-detail-poster'
      }),
      // Tekstinfo om filmen
      React.createElement('div', { className: 'movie-detail-info' },
        React.createElement('h1', null, movie.title),
        // Rating
        React.createElement('div', { className: 'movie-detail-rating' },
          '⭐ ', movie.rating?.toFixed(1)
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