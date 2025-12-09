// frontend/src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import ErrorMessage from '../components/ErrorMessage';
import GenreList from "../components/GenreList";
import MovieGrid from "../components/MovieGrid";
import SearchInput from "../components/SearchInput";
import SortSelector from "../components/SortSelector";
import '../style/app.css';

export interface Movie {
    id: number;
    title: string;
    rating?: number;
    released?: string;
    poster_image?: string;
    overview?: string;
    background_image?: string;
}

// Base-URL til backend (env eller fallback)
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fullstack-eksamen-backend.onrender.com";

const HomePage = () => {
    //UI-state til filtre og film
    const [searchText, setSearchText] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hent film når søgning, genre eller sortering ændrer sig
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Kald backend, som igen taler med TMDB
                const url = new URL(`${API_BASE_URL}/api/tmdb/movies`);

                // Tilføj query params baseret på filtre
                if (sortOrder) {
                    url.searchParams.set("sort_by", sortOrder);
                }
                if (selectedGenre) {
                    url.searchParams.set("with_genres", String(selectedGenre));
                }
                if (searchText.trim().length > 0) {
                    url.searchParams.set("query", searchText);
                }

                const res = await fetch(url.toString());

                if (!res.ok) {
                    throw new Error("Kunne ikke hente film fra server");
                }

                const data = await res.json();

                // Map TMDB-respons til vores Movie-interface
                const mapped: Movie[] = (data.results ?? []).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    rating: m.vote_average,
                    released: m.release_date,
                    poster_image: m.poster_path
                        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                        : undefined,
                    overview: m.overview,
                    background_image: m.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${m.backdrop_path}`
                        : undefined,
                }));

                setMovies(mapped);
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError(err.message ?? "Der skete en fejl ved hentning af film");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [searchText, selectedGenre, sortOrder]);

    // Callbacks til child-komponenter
    const handleSearch = (text: string) => setSearchText(text);
    const handleGenre = (genreId: number) => setSelectedGenre(genreId);
    const handleSort = (sort: string) => setSortOrder(sort);

    return React.createElement(
        "div",
        null,
        // Filtersektion: søgning, genre og sortering
        React.createElement(
            "div",
            { className: "filter-container" },
            React.createElement(
                "div",
                { className: "filters-grid" },
                // Search i venstre side
                React.createElement(
                    "div",
                    { className: "search-wrapper" },
                    React.createElement(SearchInput, { onSearch: handleSearch })
                ),
                // Genre og Sort i højre side
                React.createElement(
                    "div",
                    { className: "filters-wrapper" },
                    React.createElement(GenreList, { onSelectGenre: handleGenre }),
                    React.createElement(SortSelector, { onSelectSort: handleSort })
                )
            )
        ),
        // Indhold: loader, fejl eller filmgrid
        React.createElement(
            "div",
            { className: "home-content" },
            isLoading && React.createElement("p", null, "Henter film..."),

            React.createElement(ErrorMessage, {
                message: error,
                onClose: () => setError(null),
            }),

            !isLoading &&
            !error &&
            React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "p",
                    null,
                    `Viser ${movies.length} film`
                ),
                React.createElement(MovieGrid, { movies })
            )
        )
    );
};

export default HomePage;