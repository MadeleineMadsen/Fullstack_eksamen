import React, { useEffect, useState } from "react";
import ErrorMessage from '../components/ErrorMessage';
import GenreList from "../components/GenreList";
import MovieGrid from "../components/MovieGrid";
import SearchInput from "../components/SearchInput";
import SortSelector from "../components/SortSelector";
import '../styles/style.css';

// Movie-interface til HomePage (det vi skal bruge i listen)
// Optional felter fordi ikke alle film har alt data
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
    const [isLoading, setIsLoading] = useState(true);               // Loading state
    const [error, setError] = useState<string | null>(null);        // Fejlbesked til UI

    // Hent film når søgning, genre eller sortering ændrer sig
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true); // Start loading
                setError(null); // Reset fejl

                // Kald backend endpoint som proxy'er til TMDB
                // Vi bygger URL med searchParams, så query string bliver korrekt
                const url = new URL(`${API_BASE_URL}/api/tmdb/movies`);

                // Tilføj query params baseret på valgte filtre
                if (sortOrder) {
                    url.searchParams.set("sort_by", sortOrder);
                }
                if (selectedGenre) {
                    // TMDB bruger with_genres med genre-ID
                    url.searchParams.set("with_genres", String(selectedGenre));
                }
                if (searchText.trim().length > 0) {
                    // Hvis der er søgetekst → send query
                    url.searchParams.set("query", searchText);
                }

                // Fetch fra backend (som igen henter fra TMDB)
                const res = await fetch(url.toString());

                // Hvis serveren svarer med fejlstatus
                if (!res.ok) {
                    throw new Error("Kunne ikke hente film fra server");
                }

                const data = await res.json();

                // Map TMDB respons (data.results) til vores Movie-interface
                // Her omdannes poster_path/backdrop_path til fulde image URLs
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

                // Gem film i state → MovieGrid får dem som props
                setMovies(mapped);
            } catch (err: any) {
                // Fejl i fetch eller mapping
                console.error("Fetch error:", err);
                setError(err.message ?? "Der skete en fejl ved hentning af film");
            } finally {
                // Stop loading uanset succes/fejl
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [searchText, selectedGenre, sortOrder]);

    // Callbacks til child-komponenter
    const handleSearch = (text: string) => setSearchText(text);     // Kaldes fra SearchInput
    const handleGenre = (genreId: number) => setSelectedGenre(genreId);     // Kaldes fra GenreList
    const handleSort = (sort: string) => setSortOrder(sort);        // Kaldes fra SortSelector

    // Render UI: filter-sektion + content (loading/error/grid)
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
            
            // Loading vises mens fetch kører
            isLoading && React.createElement("p", null, "Henter film..."),

            // ErrorMessage komponent: viser fejl + mulighed for at lukke (nulstille error)
            React.createElement(ErrorMessage, {
                message: error,
                onClose: () => setError(null),
            }),

            // Når vi ikke loader og ikke har fejl → vis antal + MovieGrid
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