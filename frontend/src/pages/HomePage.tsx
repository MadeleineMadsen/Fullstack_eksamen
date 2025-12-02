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

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

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

                if (!TMDB_API_KEY) {
                    throw new Error("Mangler TMDB API key");
                }

                // basis-url til discover
                const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
                url.searchParams.set("api_key", TMDB_API_KEY);
                url.searchParams.set("language", "en-US");
                url.searchParams.set("sort_by", "popularity.desc");

                // sortering
                if (sortOrder === "rating") {
                    url.searchParams.set("sort_by", "vote_average.desc");
                } else if (sortOrder === "released") {
                    url.searchParams.set("sort_by", "primary_release_date.desc");
                } else if (sortOrder === "title") {
                    url.searchParams.set("sort_by", "original_title.asc");
                }

                if (selectedGenre) {
                    url.searchParams.set("with_genres", String(selectedGenre));
                }

                let res: Response;

                // hvis der søges, brug search-endpoint
                if (searchText.trim().length > 0) {
                    const searchUrl = new URL(`${TMDB_BASE_URL}/search/movie`);
                    searchUrl.searchParams.set("api_key", TMDB_API_KEY);
                    searchUrl.searchParams.set("language", "en-US");
                    searchUrl.searchParams.set("query", searchText);
                    res = await fetch(searchUrl.toString());
                } else {
                    res = await fetch(url.toString());
                }

                if (!res.ok) {
                    throw new Error("Kunne ikke hente film");
                }

                const data = await res.json();

                const mapped: Movie[] = (data.results ?? []).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    rating: m.vote_average,
                    released: m.release_date,
                    poster_image: m.poster_path
                        ? `${TMDB_IMAGE_BASE}${m.poster_path}`
                        : undefined,
                    overview: m.overview,
                    background_image: m.backdrop_path
                        ? `${TMDB_IMAGE_BASE}${m.backdrop_path}`
                        : undefined,
                }));

                setMovies(mapped);
            } catch (err: any) {
                setError(err.message ?? "Der skete en fejl");
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
