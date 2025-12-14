import React from "react";
import PLACEHOLDER_POSTER from "../assets/placeholder.png";

// Type til en film (det data vi forventer fra backend/TMDB)
// Mange felter er optional fordi de ikke altid findes på alle film
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

// Props til MovieDetailPage
interface Props {
  movie?: Movie;                  // movie kan være undefined mens der loades
  trailerKey?: string | null;     // YouTube key (null hvis der ikke er trailer)
}

const MovieDetailPage = ({ movie, trailerKey }: Props) => {
  
  // Loading state: hvis movie ikke er klar endnu
  if (!movie) {
    return React.createElement(
      "div",
      { className: "movie-detail" },
      React.createElement("div", null, "Henter film...")
    );
  }

  // Simpel tilbage-funktion (browser history)
  const handleBack = () => {
    window.history.back();
  };

  // Genererer streaming-sektionen (enten "ingen info" eller grid med platforme)
  const renderStreamingSection = () => {

    // Hvis der ikke findes streaming data
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

      // Grid container til alle streaming services
      React.createElement('div', { className: 'platforms-grid' },
        
        // Loop over alle platforme og lav et "kort" pr. platform
        movie.streaming_platforms.map(platform =>
          React.createElement('div', {
            key: platform.id,   // unik key for React
            className: 'platform-item',
            title: `Tilgængelig på ${platform.name}`
          },

            // Hvis platformen har logo_url → vis billede
            platform.logo_url
              ? React.createElement('img', {
                src: platform.logo_url,
                alt: platform.name,
                className: 'platform-logo'
              })

              // Ellers vis navnet som fallback
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

          // Forhindrer uendeligt loop hvis placeholder også fejler
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_POSTER;
        },
      }),

      // Tilbage-knap
      React.createElement('button', {
        className: 'back-button',
        onClick: handleBack
      }, '← Tilbage')
    ),

    // --- MAIN CONTENT ---
    React.createElement('div', { className: 'movie-detail-content' },
      
      // Venstre side: Poster. Fallback til placeholder hvis mangler/fejler
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

         // Basis-info (udgivelse, varighed, instruktør)
        React.createElement("p", null, "Udgivet: ", movie.released),
        React.createElement("p", null, "Varighed: ", movie.runtime, " minutter"),
        React.createElement("p", null, "Instruktør: ", movie.director),
        
        // Beskrivelse / overview
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

              // Trailer embed via YouTube
              src: `https://www.youtube.com/embed/${trailerKey}`,
              title: "Movie trailer",
              allow:
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: true,
            })
          )
          : null,

        // STREAMING: viser platforme eller "ingen info"
        renderStreamingSection()
      )
    )
  );
};

export default MovieDetailPage;
