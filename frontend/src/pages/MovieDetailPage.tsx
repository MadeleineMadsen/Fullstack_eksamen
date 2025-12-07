// frontend/src/pages/MovieDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetailPageComponent, {
    Movie,
} from "../components/MovieDetailPage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fullstack-eksamen-backend.onrender.com";

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

                const url = `${API_BASE_URL}/api/tmdb/movies/${id}`;
                const res = await fetch(url);

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
                        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                        : undefined,
                    background_image: data.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
                        : undefined,
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
