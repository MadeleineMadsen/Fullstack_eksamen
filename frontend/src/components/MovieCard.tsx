// frontend/src/components/MovieCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  rating?: number;
  released?: string;
  poster_image?: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return React.createElement(
    Link,
    { to: `/movies/${movie.id}`, className: "movie-card-link" },
    React.createElement(
      "div",
      {
        className: "movie-card",
        style: { cursor: "pointer" },
      },
      React.createElement("img", {
        src: movie.poster_image,
        alt: movie.title,
        className: "movie-card-image",
      }),
      React.createElement(
        "div",
        { className: "movie-card-content" },
        React.createElement("h3", null, movie.title),
        React.createElement("div", null, "⭐ ", movie.rating),
        React.createElement(
          "p",
          null,
          movie.released ? movie.released.substring(0, 4) : ""
        )
      )
    )
  );
};

export default MovieCard;
