// frontend/src/pages/MovieDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieDetailPageComponent, {
    Movie,
} from "../components/MovieDetailComponent";
import Layout from "./Layout";


// Brug miljøvariabel
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fullstack-eksamen-backend.onrender.com";

const MovieDetailPage = () => {

    console.log('🎬 MOVIE DETAIL PAGE MOUNTED');

    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    console.log('🔄 MovieDetailPage render - movie:', movie, 'isLoading:', isLoading, 'error:', error)

    useEffect(() => {
        if (!id) return;

        const fetchMovie = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // NY: Kald DIN BACKEND i stedet for TMDB direkte
                const url = `${API_BASE_URL}/api/movies/${id}`;
                const res = await fetch(url);
                
                if (!res.ok) {
                    throw new Error(`Kunne ikke hente film (status: ${res.status})`);
                }

                const data = await res.json();

                // Map data fra din backend til din Movie type
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
                console.error("Fetch error:", err);
                setError(err.message ?? "Der skete en fejl ved hentning af filmdetaljer");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [id]);
    // Bestem indhold baseret på state
    let content;
    
    if (isLoading) {
        content = React.createElement("p", null, "Henter film...");
    } else if (error) {
        content = React.createElement("p", { style: { color: "red" } }, `Fejl: ${error}`);
    } else if (!movie) {
        content = React.createElement("p", null, "Film ikke fundet.");
    } else {
        content = React.createElement(MovieDetailPageComponent, { movie });
    }

    // Wrap med Layout komponent
    return React.createElement(Layout, {children: content});
};

export default MovieDetailPage;