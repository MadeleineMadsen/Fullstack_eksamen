import React from "react";

//  Importerer nødvendige testværktøjer
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../components/MovieCard";

// -----------------------------------------------------------------------------
// MovieCard TEST
// Formål: Sikre at komponenten korrekt viser filmens titel i UI'et
// -----------------------------------------------------------------------------

describe("MovieCard", () => {
  it("renderer filmens titel", () => {

    // Testdata som MovieCard skal modtage
    const testMovie = {
      id: 1,
      title: "Inception",
      rating: 8.8,
      released: "2010-07-16",
      poster_image:
        "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    };
    
  // Renderer komponenten i et MemoryRouter (kræves pga. <Link>)
    render(
      <MemoryRouter>
        <MovieCard movie={testMovie} />
      </MemoryRouter>
    );

    //  Selve testen: Tjek at filmens titel findes i DOM'en
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });
});
