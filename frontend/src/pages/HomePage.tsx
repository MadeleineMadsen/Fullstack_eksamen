// frontend/src/pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import GenreList from "../components/GenreList";
import MovieGrid from "../components/MovieGrid";
import SearchInput from "../components/SearchInput";
import SortSelector from "../components/SortSelector";

export interface Movie {
    id: number;
    title: string;
    rating?: number;
    released?: string;
    poster_image?: string;
    overview?: string;
    background_image?: string;
}

// Brug miljøvariabel eller fallback til din backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fullstack-eksamen-backend.onrender.com";

const HomePage = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // NY: Kald DIN BACKEND i stedet for TMDB direkte
                const url = new URL(`${API_BASE_URL}/api/tmdb/movies`);
                
                // Send parametrene - din backend håndterer dem
                if (sortOrder) {
                    url.searchParams.set("sort_by", sortOrder);
                }
                if (selectedGenre) {
                    url.searchParams.set("with_genres", String(selectedGenre));
                }
                if (searchText.trim().length > 0) {
                    url.searchParams.set("query", searchText);
                }

                // FJERNET: API key tjek - din backend har nøglen
                const res = await fetch(url.toString());
                
                if (!res.ok) {
                    throw new Error("Kunne ikke hente film fra server");
                }

                const data = await res.json();

                // Din backend returnerer data i samme format som TMDB
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

    const handleSearch = (text: string) => setSearchText(text);
    const handleGenre = (genreId: number) => setSelectedGenre(genreId);
    const handleSort = (sort: string) => setSortOrder(sort);

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { className: "filter-container" },
            React.createElement(SearchInput, { onSearch: handleSearch }),
            React.createElement(
                "div",
                { className: "filters-right" },
                React.createElement(GenreList, { onSelectGenre: handleGenre }),
                React.createElement(SortSelector, { onSelectSort: handleSort })
            )
        ),
        React.createElement(
            "div",
            { style: { padding: "20px" } },
            isLoading && React.createElement("p", null, "Henter film..."),
            error &&
            React.createElement("p", { style: { color: "red" } }, error),
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