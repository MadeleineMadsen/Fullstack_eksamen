// frontend/src/pages/AdminMoviesPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

// Base-URL til backend (fra .env eller fallback)
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://fullstack-eksamen-backend.onrender.com";

type AdminMovie = {
    id: number;
    title: string;
    released?: string;
};

const AdminMoviesPage: React.FC = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    // Lokal state til film, loading, fejl og aktiv sletning
    const [movies, setMovies] = useState<AdminMovie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Hent liste af admin-oprettede film ved mount
    useEffect(() => {
    const fetchMovies = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/api/movies/admin`, {
                credentials: "include", // vigtigt pga. cookie med JWT
            });

            if (!res.ok) {
                throw new Error(
                    `Kunne ikke hente admin-film (status ${res.status})`
                );
            }

            const data: AdminMovie[] = await res.json();
            console.log(" /api/movies/admin response:", data);

            setMovies(data);
        } catch (err: any) {
            console.error(err);
            setError(
                err.message ||
                    "Noget gik galt ved hentning af admin-film-listen."
            );
        } finally {
            setIsLoading(false);
        }
    };

    fetchMovies();
}, []);

    // Håndter sletning af film (kun for admin)
    const handleDelete = async (movieId: number, title: string) => {
        if (!isAdmin) {
            setError("Du skal være admin for at slette film.");
            return;
        }

        const confirmed = window.confirm(
            `Er du sikker på, at du vil slette filmen: "${title}"?`
        );
        if (!confirmed) return;

        try {
            setDeletingId(movieId);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/api/movies/${movieId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                let msg = `Kunne ikke slette film (status ${res.status})`;
                try {
                    const data = await res.json();
                    if (data?.message || data?.error) {
                        msg = data.message || data.error;
                    }
                } catch {
                    // ignore json-fejl
                }
                throw new Error(msg);
            }

            // Fjern filmen fra listen i UI
            setMovies((prev) => prev.filter((m) => m.id !== movieId));
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Noget gik galt ved sletning af filmen.");
        } finally {
            setDeletingId(null);
        }
    };

    // Hvis ikke admin → vis besked
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

     // Vælg hvilket indhold der skal vises
    let content: React.ReactNode;

    if (isLoading) {
        content = React.createElement("p", null, "Henter film...");
    } else if (error) {
        content = React.createElement(
            "p",
            { className: "error-message" },
            error
        );
    } else if (!movies.length) {
        content = React.createElement("p", null, "Der er ingen film i systemet.");
    } else {
        content = React.createElement(
            "ul",
            { className: "admin-movie-list" },
            movies.map((movie) =>
                React.createElement(
                    "li",
                    { key: movie.id, className: "admin-movie-item" },
                    React.createElement(
                        "div",
                        { className: "admin-movie-info" },
                        React.createElement("strong", null, movie.title),
                        movie.released &&
                        React.createElement(
                            "span",
                            { className: "admin-movie-released" },
                            " (",
                            movie.released,
                            ")"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "admin-movie-actions" },
                        React.createElement(
                            "button",
                            {
                                type: "button",
                                className: "secondary-button",
                                onClick: () => navigate(`/movies/${movie.id}`),
                            },
                            "Detaljer"
                        ),
                        React.createElement(
                            "button",
                            {
                                type: "button",
                                className: "admin-delete-button",
                                onClick: () => handleDelete(movie.id, movie.title),
                                disabled: deletingId === movie.id,
                            },
                            deletingId === movie.id ? "Sletter..." : "🗑 Slet"
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
            React.createElement("h1", null, "Admin – Film i systemet"),
            content
        )
    );
};

export default AdminMoviesPage;
