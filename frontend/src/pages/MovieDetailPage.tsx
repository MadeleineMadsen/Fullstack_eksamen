// frontend/src/pages/MovieDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetailPageComponent, {
    Movie,
} from "../components/MovieDetailPage";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const MovieDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMovie = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (!TMDB_API_KEY) {
                    throw new Error("Mangler TMDB API key");
                }

                const url = new URL(`${TMDB_BASE_URL}/movie/${id}`);
                url.searchParams.set("api_key", TMDB_API_KEY);
                url.searchParams.set("language", "en-US");

                const res = await fetch(url.toString());
                if (!res.ok) throw new Error("Kunne ikke hente film");

                const data = await res.json();

                const mapped: Movie = {
                    id: data.id,
                    title: data.title,
                    overview: data.overview,
                    released: data.release_date,
                    runtime: data.runtime,
                    rating: data.vote_average,
                    poster_image: data.poster_path
                        ? `${TMDB_IMAGE_BASE}${data.poster_path}`
                        : undefined,
                    background_image: data.backdrop_path
                        ? `${TMDB_IMAGE_BASE}${data.backdrop_path}`
                        : undefined,
                    // director kan evt. hentes senere via credits
                };

                setMovie(mapped);
            } catch (err: any) {
                console.error(err);
                setError(err.message ?? "Der skete en fejl");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    if (isLoading) {
        return React.createElement("p", null, "Henter film...");
    }

    if (error) {
        return React.createElement(
            "p",
            { style: { color: "red" } },
            error
        );
    }

    if (!movie) {
        return React.createElement("p", null, "Film ikke fundet.");
    }

    return React.createElement(MovieDetailPageComponent, { movie });
};

export default MovieDetailPage;
