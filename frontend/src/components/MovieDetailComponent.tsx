// frontend/src/components/MovieDetailComponent.tsx
import React from "react";
import PLACEHOLDER_POSTER from "../assets/placeholder.png";

// Opdater filminterface til at inkludere streaming platforms
export interface Movie {
  id: number;
  title: string;
  overview?: string;
  released?: string;
  runtime?: number;
  rating?: number;
  metacritic?: number;
  poster_image?: string;
  background_image?: string;
  director?: string;
  streaming_platforms?: any[];
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
  trailerKey?: string | null;
}

const MovieDetailPage = ({ movie, trailerKey }: Props) => {
  if (!movie) {
    return React.createElement(
      "div",
      { className: "movie-detail" },
      React.createElement("div", null, "Henter film...")
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
        src: movie.background_image ?? PLACEHOLDER_POSTER,
        alt: movie.title,
        className: 'movie-detail-background',
        onError: (e: any) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_POSTER;
        },
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
        src: movie.poster_image ?? PLACEHOLDER_POSTER,
        alt: movie.title,
        className: "movie-detail-poster",
        onError: (e: any) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_POSTER;
        },
      }),

      // Højre side: Film info
      React.createElement('div', { className: 'movie-detail-info' },
        React.createElement('h1', null, movie.title),

        // Rating + metacritic
        React.createElement('div', { className: 'movie-detail-rating-row' },
          [
            // TMDB rating - altid vist
            React.createElement('span', {
              key: 'tmdb-rating',
              className: 'rating-main'
            },
              '⭐ ',
              movie.rating != null ? `${movie.rating.toFixed(1)} / 10` : '—'
            ),

            // Metacritic - kun hvis den findes
            movie.metacritic != null &&
            React.createElement('span', {
              key: 'metacritic-rating',
              className: 'rating-metacritic'
            },
              'Metacritic: ', `${movie.metacritic} / 100`
            )
          ].filter(Boolean) // Fjerner false værdier
        ),

        React.createElement("p", null, "Udgivet: ", movie.released),
        React.createElement("p", null, "Varighed: ", movie.runtime, " minutter"),
        React.createElement("p", null, "Instruktør: ", movie.director),
        React.createElement(
          "p",
          { className: "movie-detail-overview" },
          movie.overview
        ),

        // --- TRAILER ---
        trailerKey
          ? React.createElement(
            "div",
            { className: "movie-detail-trailer" },
            React.createElement("h2", null, "Trailer"),
            React.createElement("iframe", {
              width: "100%",
              height: "400",
              src: `https://www.youtube.com/embed/${trailerKey}`,
              title: "Movie trailer",
              allow:
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: true,
            })
          )
          : null,

        // --- NYT: STREAMING SEKTION ---
        renderStreamingSection()
      )
    )
  );
};

export default MovieDetailPage;
