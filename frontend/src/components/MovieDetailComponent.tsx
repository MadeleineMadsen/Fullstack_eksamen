// frontend/src/components/MovieDetailPage.tsx
import React from 'react';

// Opdater filminterface til at inkludere streaming platforms
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

  // Nye felter til streaming
  streaming_platforms?: StreamingPlatform[];
  has_streaming_info?: boolean;
}

// Interface for streaming platforme
interface StreamingPlatform {
  id: number;
  name: string;
  logo_path?: string;
  logo_url?: string;
}

// Props til komponenten
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

  // Simpel "tilbage" funktion
  const handleBack = () => {
    window.history.back();
  };

  // Funktion til at generere streaming-sektionen
  const renderStreamingSection = () => {
    if (!movie.streaming_platforms || movie.streaming_platforms.length === 0) {
      return React.createElement('div', { className: 'streaming-section' },
        React.createElement('h2', null, 'Tilgængelig på'),
        React.createElement('div', { className: 'no-streaming-info' },
          React.createElement('p', null, 'Ingen streaming-information tilgængelig'),
          React.createElement('p', { className: 'help-text' },
            'Tjek tjenester som Netflix, HBO eller Disney+')
        )
      );
    }

    // Hvis vi har streaming platforms, vis dem
    return React.createElement('div', { className: 'streaming-section' },
      React.createElement('h2', null, 'Tilgængelig på'),
      React.createElement('div', { className: 'platforms-grid' },
        // Map over hver platform og vis logo/ikon
        movie.streaming_platforms.map(platform =>
          React.createElement('div', {
            key: platform.id,
            className: 'platform-item',
            title: `Tilgængelig på ${platform.name}`
          },
            platform.logo_url
              ? React.createElement('img', {
                src: platform.logo_url,
                alt: platform.name,
                className: 'platform-logo'
              })
              : React.createElement('div', { className: 'platform-name' },
                platform.name
              )
          )
        )
      ),
      // JustWatch attribution (vigtigt for at overholde vilkår)
      React.createElement('p', { className: 'attribution' },
        React.createElement('small', null,
          'Streaming data fra ',
          React.createElement('a', {
            href: 'https://www.justwatch.com/',
            target: '_blank',
            rel: 'noopener noreferrer'
          }, 'JustWatch')
        )
      )
    );
  };

  // Hovedlayout for film-detail-siden
  return React.createElement('div', { className: 'movie-detail' },

    // --- HERO SEKTION MED BAGGRUNDSBILLEDE OG TILBAGE-KNAP ---
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

    // --- MAIN CONTENT ---
    React.createElement('div', { className: 'movie-detail-content' },
      // Venstre side: Poster
      React.createElement('img', {
        src: movie.poster_image,
        alt: movie.title,
        className: 'movie-detail-poster'
      }),

      // Højre side: Film info
      React.createElement('div', { className: 'movie-detail-info' },
        React.createElement('h1', null, movie.title),

        // Rating
        React.createElement('div', { className: 'movie-detail-rating' },
          '⭐ ', movie.rating, '/10'
        ),

        // Metadata
        React.createElement('p', null, 'Udgivet: ', movie.released),
        React.createElement('p', null, 'Varighed: ', movie.runtime, ' minutter'),
        React.createElement('p', null, 'Instruktør: ', movie.director),

        // Overview
        React.createElement('p', { className: 'movie-detail-overview' }, movie.overview),

        // --- NY SEKTION: Streaming platforms ---
        renderStreamingSection()
      )
    )
  );
};

export default MovieDetailPage;