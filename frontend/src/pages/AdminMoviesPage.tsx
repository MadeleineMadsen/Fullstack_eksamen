import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

// Base-URL til backend (fra .env eller fallback)
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://fullstack-eksamen-backend.onrender.com";

// Type til de filmfelter vi viser på admin-listen
// (her henter vi kun id, title og evt. released)
type AdminMovie = {
    id: number;
    title: string;
    released?: string;
};

const AdminMoviesPage: React.FC = () => {
    
    // useAuth giver adgang til auth-state (her bruger vi kun isAdmin)
    const { isAdmin } = useAuth();
    
    // useNavigate bruges til at navigere programmatisk til en route
    const navigate = useNavigate();

    // State: liste med film, loading, fejlbesked og "hvilken id sletter vi lige nu?"
    const [movies, setMovies] = useState<AdminMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // useEffect kører én gang ved mount ([]) → henter admin-film listen
    useEffect(() => {
    const fetchMovies = async () => {
        try {

            // Reset state inden fetch
            setIsLoading(true);
            setError(null);

            // Henter admin-oprettede film fra backend
            // credentials: "include" er vigtigt, hvis auth ligger i cookie (JWT cookie)
            const res = await fetch(`${API_BASE_URL}/api/movies/admin`, {
                credentials: "include", // vigtigt pga. cookie med JWT
            });

            // Hvis HTTP status ikke er OK → kast fejl
            if (!res.ok) {
                throw new Error(
                    `Kunne ikke hente admin-film (status ${res.status})`
                );
            }

            // Parse JSON og gem i state
            const data: AdminMovie[] = await res.json();
            console.log(" /api/movies/admin response:", data);

            setMovies(data);
        } catch (err: any) {

            // Gem fejl i state så vi kan vise den i UI
            console.error(err);
            setError(
                err.message ||
                    "Noget gik galt ved hentning af admin-film-listen."
            );
        } finally {

            // Stop loading uanset succes/fejl
            setIsLoading(false);
        }
    };

    fetchMovies();
}, []);

    // Håndter sletning af film (kun for admin)
    const handleDelete = async (movieId: number, title: string) => {

        // Frontend-sikkerhed: hvis ikke admin → stop her
        // (backend bør stadig også tjekke admin)
        if (!isAdmin) {
            setError("Du skal være admin for at slette film.");
            return;
        }

        // Brug confirm så brugeren ikke sletter ved en fejl
        const confirmed = window.confirm(
            `Er du sikker på, at du vil slette filmen: "${title}"?`
        );
        if (!confirmed) return;

        try {

            // Sætter deletingId så vi kan disable knappen + vise "Sletter..."
            setDeletingId(movieId);
            setError(null);

            // Send DELETE request til backend
            const res = await fetch(`${API_BASE_URL}/api/movies/${movieId}`, {
                method: "DELETE",
                credentials: "include",
            });

            // Hvis ikke OK → prøv at læse error message fra backend
            if (!res.ok) {
                let msg = `Kunne ikke slette film (status ${res.status})`;
                try {
                    const data = await res.json();
                    if (data?.message || data?.error) {
                        msg = data.message || data.error;
                    }
                } catch {
                    // Hvis JSON parsing fejler, ignorer og brug default msg
                }
                throw new Error(msg);
            }

            // Opdater UI: fjern filmen lokalt i state (ingen refetch nødvendig)
            setMovies((prev) => prev.filter((m) => m.id !== movieId));
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Noget gik galt ved sletning af filmen.");
        } finally {

            // Nulstil deletingId så knappen bliver aktiv igen
            setDeletingId(null);
        }
    };

    // Gatekeeping: hvis ikke admin → vis kun besked (ingen admin-liste)
    if (!isAdmin) {
        return React.createElement(
            Layout,
            null,
            React.createElement(
                "div",
                { className: "admin-movies-page" },
                React.createElement(
                    "p",
                    null,
                    "Du skal være admin for at se denne side."
                )
            )
        );
    }

    // content variabel gør det nemt at vælge UI afhængig af state
    let content: React.ReactNode;

    // 1) Loading state
    if (isLoading) {
        content = React.createElement("p", null, "Henter film...");
    
    // 2) Error state
    } else if (error) {
        content = React.createElement(
            "p",
            { className: "error-message" },
            error
        );
    
    // 3) Tom liste state
    } else if (!movies.length) {
        content = React.createElement("p", null, "Der er ingen film i systemet.");
    
    // 4) Normal state: render liste med film
    } else {
        content = React.createElement(
            "ul",
            { className: "admin-movie-list" },

            // Lav et <li> pr. film
            movies.map((movie) =>
                React.createElement(
                    "li",
                    { key: movie.id, className: "admin-movie-item" },
                    
                    // Venstre: titel + udgivelsesdato
                    React.createElement(
                        "div",
                        { className: "admin-movie-info" },
                        React.createElement("strong", null, movie.title),
                        
                        // released vises kun hvis den findes
                        movie.released &&
                        React.createElement(
                            "span",
                            { className: "admin-movie-released" },
                            " (",
                            movie.released,
                            ")"
                        )
                    ),

                    // Højre: actions (Detaljer + Slet)
                    React.createElement(
                        "div",
                        { className: "admin-movie-actions" },
                        
                        // Navigér til filmens details-side
                        React.createElement(
                            "button",
                            {
                                type: "button",
                                className: "secondary-button",
                                onClick: () => navigate(`/movies/${movie.id}`),
                            },
                            "Detaljer"
                        ),

                        // Slet-knap: disabled mens den specifikke film slettes
                        React.createElement(
                            "button",
                            {
                                type: "button",
                                className: "admin-delete-button",
                                onClick: () => handleDelete(movie.id, movie.title),
                                disabled: deletingId === movie.id,
                            },

                            // Skift knaptekst afhængig af deletingId
                            deletingId === movie.id ? "Sletter..." : "Slet"
                        )
                    )
                )
            )
        );
    }

    // Wrapper siden i Layout med overskrift + content
    return React.createElement(
        Layout,
        null,
        React.createElement(
            "div",
            { className: "admin-movies-page" },
            React.createElement("h1", null, "Film i systemet"),
            content
        )
    );
};

export default AdminMoviesPage;
