import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

// Base-URL til backend (fra .env eller fallback)
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://fullstack-eksamen-backend.onrender.com";

// Simpel XSS-check: blokér < og > i tekstfelter
// (hindrer fx HTML-tags i title/plot/director)
const hasForbiddenChars = (value: string): boolean =>
    value.includes("<") || value.includes(">");

// Simpel URL-validering: kræv http:// eller https:// hvis feltet ikke er tomt
// (hindrer fx javascript: eller andre uønskede schemas)
const isInvalidUrl = (url: string): boolean =>
    url !== "" && !/^https?:\/\//i.test(url);

const CreateMoviePage: React.FC = () => {
    
    // Tjek om brugeren er admin (må kun oprette film hvis admin)
    const { isAdmin } = useAuth();
    
    // Bruges til navigation til andre sider
    const navigate = useNavigate();
    
    // Formularens state (alle inputfelter)
    // Alle er strings i state, fordi de kommer fra inputfelter
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

    // UI state til beskeder og submit status
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Opdaterer formData ved input-ændringer
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        
        // Opdater kun det felt der matcher input "name"
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Håndter submit af formular (opret film)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();     // Undgå page reload
        setError(null);         // Reset beskeder
        setSuccess(null);

        // DEBUG: se hvad der faktisk bliver sendt til valideringen
        console.log(" formData ved submit:", formData);

        //  1) XSS-beskyttelse på tekstfelter
        if (
            hasForbiddenChars(formData.title) ||
            hasForbiddenChars(formData.plot) ||
            hasForbiddenChars(formData.director)
        ) {
            setError(
                "Titel, beskrivelse og instruktør må ikke indeholde < eller >"
            );
            return;
        }

        // 2) URL-sikkerhed: hvis der er URL, så skal den starte med http(s)
        if (
            isInvalidUrl(formData.poster_image) ||
            isInvalidUrl(formData.background_image)
        ) {
            setError(
                "Poster- og background-URL skal starte med http:// eller https://"
            );
            return;
        }

        // 3) Access control i frontend: kun admin må oprette film
        if (!isAdmin) {
            setError("Du skal være admin for at oprette film.");
            return;
        }

        setIsSubmitting(true);
        try {

            // Byg payload til backend
            // Trim strings og konvertér number-felter til Number
            // Brug null hvis feltet er tomt (så backend kan gemme NULL)
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

            // POST request til backend for at oprette filmen
            // credentials: include er vigtigt hvis auth ligger i cookies
            const res = await fetch(`${API_BASE_URL}/api/movies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            // Hvis backend returnerer fejl → læs evt. message og vis i UI
            if (!res.ok) {
                let msg = `Fejl ved oprettelse (status ${res.status})`;
                try {
                    const data = await res.json();
                    if (data?.message || data?.error) {
                        msg = data.message || data.error;
                    }
                } catch {
                    // Hvis response ikke er JSON → ignorér
                }
                throw new Error(msg);
            }

            // Læs den oprettede film tilbage fra backend
            const created = await res.json();

            // Vis success besked og nulstil form
            setSuccess(`Filmen "${created.title}" er oprettet `);
            setError(null);

            // Reset alle felter efter succes
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
            // Vis fejlbesked hvis noget går galt
            setError(
                err.message || "Noget gik galt ved oprettelse af filmen."
            );
        } finally {
            // Stop submit-state uanset udfald
            setIsSubmitting(false);
        }
    };

    // Render: hele siden er wrapped i Layout
    return React.createElement(
        Layout,
        null,
        React.createElement(
            "div",
            { className: "admin-create-page" },
            React.createElement(
                "div",
                { className: "page-container" },
                
                // Side titel
                React.createElement("h1", null, "Opret ny film"),
                
                // Knappen til at se admin-film listen
                React.createElement(
                    "button",
                    {
                        type: "button",
                        className: "secondary-button admin-list-button",
                        onClick: () => navigate("/admin/movies"),
                    },
                    "Se oprettede film"
                ),

                // Vis fejlbesked hvis den findes
                error &&
                React.createElement(
                    "p",
                    { className: "error-message" },
                    error
                ),

                // Vis succesbesked hvis den findes
                success &&
                React.createElement(
                    "p",
                    { className: "success-message" },
                    success
                ),

                // Formular: onSubmit kører handleSubmit
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

                    // Plot / beskrivelse
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
