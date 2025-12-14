// frontend/src/components/MovieCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import PLACEHOLDER_POSTER from "../assets/placeholder.png";


// Movie-interfacet beskriver de data, som et filmkort skal kunne vise
interface Movie {
  id: number;
  title: string;
  rating?: number;
  released?: string;
  poster_image?: string;
}

// Props til komponenten — modtager én film
interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return React.createElement(
    // Wrapper som Link → klik på kortet navigerer til filmens detail-side
    Link,
    {
      to: `/movies/${movie.id}`// Dynamisk route baseret på filmens ID
      , className: "movie-card-link"
    },// CSS-klasse til styling

    // Filmkortets container
    React.createElement(
      "div",
      {
        className: "movie-card",
      },
      // Billede af filmen
      React.createElement("img", {
        src: movie.poster_image ?? PLACEHOLDER_POSTER,
        alt: movie.title,
        className: "movie-card-image",// CSS-styling
        onError: (e: any) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_POSTER;
        },
      }),
      // Tekstindhold: titel, rating og årstal
      React.createElement(
        "div",
        { className: "movie-card-content" },
        React.createElement("h3", { className: "movie-card-title" }, movie.title),
        React.createElement("div", { className: "movie-card-rating" }, "⭐ ", movie.rating?.toFixed(1)),
        React.createElement(
          "p",
          { className: "movie-card-year" },
          movie.released ? movie.released.substring(0, 4) : ""
        )
      )
    )
  );
};

export default MovieCard;
