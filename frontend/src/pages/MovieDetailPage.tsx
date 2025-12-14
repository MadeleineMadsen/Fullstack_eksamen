import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from '../components/ErrorMessage';
import MovieDetailPageComponents, { Movie, } from "../components/MovieDetailComponent";

// Side der henter og viser detaljer for én film fra backend (lokal DB eller TMDB)

// Backend-URL (fra .env eller fallback)
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fullstack-eksamen-backend.onrender.com";

const MovieDetailPage = () => {

    console.log(' MOVIE DETAIL PAGE MOUNTED');

    // Henter route param fra URL (fx /movies/:id)
    // id kommer som string, derfor useParams<{ id: string }>()
    const { id } = useParams<{ id: string }>();  // Hent film-ID fra URL
    
    // State til filmdata + UI states
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const [error, setError] = useState<string | null>(null);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);

    console.log(' MovieDetailPage render - movie:', movie, 'isLoading:', isLoading, 'error:', error)
    console.log("MOVIE DETAIL:", movie);

    // Hent film når id ændrer sig
    useEffect(() => {

        // Hvis id mangler, gør ingenting
        if (!id) return;

        const fetchMovie = async () => {
            try {

                // Reset UI states inden fetch
                setIsLoading(true);
                setError(null);

                // Henter én film via backend (tjekker lokal DB → TMDB fallback)
                const url = `${API_BASE_URL}/api/movies/${id}`;
                const res = await fetch(url);

                // Hvis backend returnerer fejlstatus
                if (!res.ok) {
                    throw new Error(`Kunne ikke hente film (status: ${res.status})`);
                }

                // JSON data fra backend (kan være "DB-format" eller "TMDB-format")
                const data = await res.json();

                // Mapper backend- og TMDB-felter til ét Movie-objekt
                const mapped: Movie = {
                    id: data.id,
                    title: data.title ?? data.original_title,

                    // beskrivelse kan hedde overview (TMDB) eller plot (egne film)
                    overview: data.overview ?? data.plot,

                    // dato kan hedde released (DB) eller release_date (TMDB)
                    released: data.released ?? data.release_date,

                    // runtime kan være det samme i begge tilfælde
                    runtime: data.runtime ?? null,

                    // rating kan være rating (DB) eller vote_average (TMDB)
                    rating:
                        typeof data.rating === "number"
                            ? data.rating
                            : typeof data.vote_average === "number"
                                ? data.vote_average
                                : undefined,

                    metacritic:
                        typeof data.metacritic === "number"
                        ? data.metacritic
                        : undefined,
                        
                    // Plakat-billede: brug DB først, ellers TMDB
                    poster_image: data.poster_image
                        ? data.poster_image
                        : data.poster_path
                            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                            : undefined,

                    //  baggrund: samme logik
                    background_image: data.background_image
                        ? data.background_image
                        : data.backdrop_path
                            ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}`
                            : undefined,

                    director: data.director ?? undefined,

                    // Streaming data (fallback til tom liste)
                    streaming_platforms: data.streaming_platforms ?? [],

                    // Flag til UI (om vi har streaming info eller ej)
                    has_streaming_info: data.has_streaming_info ?? false,
                };

                // Gem mapped film i state
                setMovie(mapped);

                // Hent trailer separat (hvis endpoint findes)
                try {
                    const trailerRes = await fetch(`${API_BASE_URL}/api/movies/${id}/trailer`);
                    if (trailerRes.ok) {
                        const trailerData = await trailerRes.json();
                        setTrailerKey(trailerData?.key ?? null);
                    } else {

                        // Hvis trailer endpoint svarer med fejl → ingen trailer
                        setTrailerKey(null);
                    }
                } catch {
                    // Hvis fetch fejler helt (netværk) → ingen trailer
                    setTrailerKey(null);
                }


            } catch (err: any) {
                console.error("Fetch error:", err);
                setError(err.message ?? "Der skete en fejl ved hentning af filmdetaljer");
            } finally {
                 // Stop loading uanset udfald
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    // Loading state
    if (isLoading) {
        return React.createElement("p", null, "Henter film...");
    }

    // Error state: vis ErrorMessage + fallback tekst
    if (error) {
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(ErrorMessage, {
                message: error,
                onClose: () => setError(null),
            }),
            React.createElement("p", null, "Kunne ikke hente denne film.")
        );
    }

    // Hvis der ikke findes en film (fx tom response)
    if (!movie) {
        return React.createElement("p", null, "Film ikke fundet.");
    }
    // Sender film-data videre til præsentations-komponenten
    return React.createElement(MovieDetailPageComponents, { movie, trailerKey });

};

export default MovieDetailPage;