// frontend/src/components/MovieCard.test.tsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../components/MovieCard";


describe("MovieCard", () => {
  it("renderer filmens titel", () => {
    const testMovie = {
      id: 1,
      title: "Inception",
      rating: 8.8,
      released: "2010-07-16",
      poster_image:
        "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    };

    render(
      <MemoryRouter>
        <MovieCard movie={testMovie} />
      </MemoryRouter>
    );

    // 👇 det er selve testen
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });
});
