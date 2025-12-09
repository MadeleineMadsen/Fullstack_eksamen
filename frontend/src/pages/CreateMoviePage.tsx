// frontend/src/pages/CreateMoviePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useAuth } from "../hooks/useAuth";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://fullstack-eksamen-backend.onrender.com";

const CreateMoviePage: React.FC = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        plot: "",
        director: "",
        released: "",
        runtime: "",
        rating: "",
        metacritic: "",
        poster_image: "",
        background_image: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!isAdmin) {
            setError("Du skal være admin for at oprette film.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                title: formData.title.trim(),
                plot: formData.plot.trim() || null,
                director: formData.director.trim() || null,
                released: formData.released || null,
                runtime: formData.runtime ? Number(formData.runtime) : null,
                rating: formData.rating ? Number(formData.rating) : null,
                metacritic: formData.metacritic
                    ? Number(formData.metacritic)
                    : null,
                poster_image: formData.poster_image.trim() || null,
                background_image: formData.background_image.trim() || null,
            };

            const res = await fetch(`${API_BASE_URL}/api/movies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let msg = `Fejl ved oprettelse (status ${res.status})`;
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

            const created = await res.json();

            setSuccess(`Filmen "${created.title}" er oprettet ✅`);
            setError(null);

            setFormData({
                title: "",
                plot: "",
                director: "",
                released: "",
                runtime: "",
                rating: "",
                metacritic: "",
                poster_image: "",
                background_image: "",
            });
        } catch (err: any) {
            setError(err.message || "Noget gik galt ved oprettelse af filmen.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return React.createElement(
        Layout,
        null,
        React.createElement(
            "div",
            { className: "admin-create-page" }, // ydre wrapper til kun admin-siden
            React.createElement(
                "div",
                { className: "page-container" }, // kortet som CSS'en styler
                React.createElement("h1", null, "Admin – Opret ny film"),
                React.createElement(
                    "button",
                    {
                        type: "button",
                        className: "secondary-button admin-list-button",
                        onClick: () => navigate("/admin/movies"),
                    },
                    "Se oprettede film"
                ),
                error &&
                React.createElement(
                    "p",
                    { className: "error-message" },
                    error
                ),

                success &&
                React.createElement(
                    "p",
                    { className: "success-message" },
                    success
                ),

                React.createElement(
                    "form",
                    { onSubmit: handleSubmit, className: "movie-form" },

                    // Titel
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "title" },
                            "Titel *"
                        ),
                        React.createElement("input", {
                            id: "title",
                            name: "title",
                            type: "text",
                            required: true,
                            value: formData.title,
                            onChange: handleChange,
                        })
                    ),

                    // Plot
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "plot" },
                            "Beskrivelse / plot"
                        ),
                        React.createElement("textarea", {
                            id: "plot",
                            name: "plot",
                            rows: 4,
                            value: formData.plot,
                            onChange: handleChange,
                        })
                    ),

                    // Instruktør
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "director" },
                            "Instruktør"
                        ),
                        React.createElement("input", {
                            id: "director",
                            name: "director",
                            type: "text",
                            value: formData.director,
                            onChange: handleChange,
                        })
                    ),

                    // Udgivelsesdato
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "released" },
                            "Udgivelsesdato (YYYY-MM-DD)"
                        ),
                        React.createElement("input", {
                            id: "released",
                            name: "released",
                            type: "text",
                            placeholder: "f.eks. 2024-12-01",
                            value: formData.released,
                            onChange: handleChange,
                        })
                    ),

                    // Runtime
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "runtime" },
                            "Runtime (minutter)"
                        ),
                        React.createElement("input", {
                            id: "runtime",
                            name: "runtime",
                            type: "number",
                            min: 0,
                            value: formData.runtime,
                            onChange: handleChange,
                        })
                    ),

                    // Rating
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "rating" },
                            "Rating (0-10)"
                        ),
                        React.createElement("input", {
                            id: "rating",
                            name: "rating",
                            type: "number",
                            min: 0,
                            max: 10,
                            step: 0.1,
                            value: formData.rating,
                            onChange: handleChange,
                        })
                    ),

                    // Metacritic
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "metacritic" },
                            "Metacritic (0-100)"
                        ),
                        React.createElement("input", {
                            id: "metacritic",
                            name: "metacritic",
                            type: "number",
                            min: 0,
                            max: 100,
                            value: formData.metacritic,
                            onChange: handleChange,
                        })
                    ),

                    // Poster URL
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "poster_image" },
                            "Poster URL"
                        ),
                        React.createElement("input", {
                            id: "poster_image",
                            name: "poster_image",
                            type: "text",
                            value: formData.poster_image,
                            onChange: handleChange,
                        })
                    ),

                    // Background URL
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "label",
                            { htmlFor: "background_image" },
                            "Background URL"
                        ),
                        React.createElement("input", {
                            id: "background_image",
                            name: "background_image",
                            type: "text",
                            value: formData.background_image,
                            onChange: handleChange,
                        })
                    ),

                    // Knapper
                    React.createElement(
                        "div",
                        { className: "form-actions" },
                        React.createElement(
                            "button",
                            {
                                type: "submit",
                                disabled: isSubmitting,
                                className: "submit-button",
                            },
                            isSubmitting ? "Opretter..." : "Opret film"
                        ),
                        React.createElement(
                            "button",
                            {
                                type: "button",
                                className: "secondary-button",
                                onClick: () => navigate("/"),
                            },
                            "Tilbage til forsiden"
                        )
                    )
                )
            )
        )
    );
};

export default CreateMoviePage;
