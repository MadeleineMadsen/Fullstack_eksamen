// frontend/src/components/MovieDetailComponent.tsx
import React from "react";

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

// Props til komponenten
interface Props {
  movie?: Movie;
  trailerKey?: string | null;
}

// Hvis ingen film-data er tilgængelig endnu → vis loading-tekst
const MovieDetailPage = ({ movie, trailerKey }: Props) => {
  if (!movie) {
    return React.createElement(
      "div",
      { className: "movie-detail" },
      React.createElement("div", null, "Henter film...")
    );
  }

  // Simpel "tilbage" funktion der hopper til forrige side i browserhistorikken
  const handleBack = () => {
    window.history.back();
  };

  return React.createElement(
    "div",
    { className: "movie-detail" },

    // --- HERO SEKTION MED BAGGRUNDSBILLEDE OG TILBAGE-KNAP ---
    React.createElement(
      "div",
      { className: "movie-detail-header" },

      React.createElement("img", {
        src: movie.background_image,
        alt: movie.title,
        className: "movie-detail-background",
      }),

      React.createElement(
        "button",
        {
          className: "back-button",
          onClick: handleBack,
        },
        "← Tilbage"
      )
    ),

    // --- MAIN CONTENT: POSTER, INFORMATION, BESKRIVELSE ---
    React.createElement(
      "div",
      { className: "movie-detail-content" },

      React.createElement("img", {
        src: movie.poster_image,
        alt: movie.title,
        className: "movie-detail-poster",
      }),

      React.createElement(
        "div",
        { className: "movie-detail-info" },
        React.createElement("h1", null, movie.title),

        React.createElement(
          "div",
          { className: "movie-detail-rating" },
          "⭐ ",
          movie.rating,
          "/10"
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
          : null
      )
    )
  );
};

export default MovieDetailPage;
