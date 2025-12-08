// backend/swagger.ts
import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Movie API",
        version: "1.0.0",
        description:
            "API til håndtering af film. Læsning (GET) sker fra TMDB, mens oprettelse/sletning (POST/DELETE) sker i den lokale database.",
    },
    servers: [
        {
            url: "http://localhost:5001",
            description: "Local development server",
        },
    ],

    paths: {
        "/api/movies": {
            get: {
                tags: ["Movies"],
                summary: "Hent liste af populære film fra TMDB",
                description:
                    "Henter en pagineret liste af populære film fra The Movie Database (TMDB).",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Side-nummer for pagination",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 1,
                            minimum: 1,
                        },
                    },
                    {
                        name: "page_size",
                        in: "query",
                        description: "Antal film per side",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 20,
                            maximum: 40,
                        },
                    },
                    {
                        name: "title",
                        in: "query",
                        description: "Filtrer efter titel (ikke anvendt på TMDB lige nu)",
                        required: false,
                        schema: { type: "string" },
                    },
                    {
                        name: "genre",
                        in: "query",
                        description: "Filtrer efter genre ID (ikke anvendt på TMDB lige nu)",
                        required: false,
                        schema: { type: "integer" },
                    },
                    {
                        name: "minRating",
                        in: "query",
                        description: "Minimum bedømmelse (ikke anvendt på TMDB lige nu)",
                        required: false,
                        schema: { type: "number" },
                    },
                    {
                        name: "maxRating",
                        in: "query",
                        description: "Maksimum bedømmelse (ikke anvendt på TMDB lige nu)",
                        required: false,
                        schema: { type: "number" },
                    },
                    {
                        name: "year",
                        in: "query",
                        description: "Filtrer efter udgivelsesår (ikke anvendt på TMDB lige nu)",
                        required: false,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    200: {
                        description: "Successfuldt response med filmliste",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/MoviesResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Serverfejl",
                    },
                },
            },

            post: {
                tags: ["Movies"],
                summary: "Opret en ny film i den lokale database",
                description:
                    "Opretter en ny film i den lokale Postgres-database. Denne route bruger IKKE TMDB, men jeres egen Movie-tabel.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/NewMovie" },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Film oprettet",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Movie" },
                            },
                        },
                    },
                    400: { description: "Ugyldige data (title mangler eller lign.)" },
                    500: { description: "Serverfejl" },
                },
            },
        },

        "/api/movies/{id}": {
            get: {
                tags: ["Movies"],
                summary: "Hent detaljer for en specifik film (fra TMDB)",
                description:
                    "Henter detaljerede oplysninger om en enkelt film fra The Movie Database (TMDB) baseret på TMDB's film-ID.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "integer",
                            example: 550,
                        },
                        description: "TMDB Film ID",
                    },
                ],
                responses: {
                    200: {
                        description: "Filmdetaljer",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Movie" },
                            },
                        },
                    },
                    404: {
                        description: "Film ikke fundet i TMDB",
                    },
                    500: {
                        description: "Serverfejl",
                    },
                },
            },

            delete: {
                tags: ["Movies"],
                summary: "Slet en film fra den lokale database",
                description:
                    "Sletter en film fra den lokale Movie-tabel baseret på dens ID i databasen (ikke TMDB ID).",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                        description: "Lokalt Movie ID (fra jeres database)",
                    },
                ],
                responses: {
                    204: { description: "Film slettet" },
                    404: { description: "Film ikke fundet" },
                    500: { description: "Serverfejl" },
                },
            },
        },
    },

    components: {
        schemas: {
            MoviesResponse: {
                type: "object",
                properties: {
                    count: {
                        type: "integer",
                        description: "Total antal film",
                    },
                    next: {
                        type: "string",
                        nullable: true,
                        description: "URL til næste side af resultater (eller null)",
                    },
                    results: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/Movie",
                        },
                    },
                },
            },

            // "Movie" bruges både til TMDB-respons og lokal DB-film.
            // Derfor har den felter fra begge verdener, hvor nogle er optional.
            Movie: {
                type: "object",
                properties: {
                    // Fælles / TMDB-felter
                    id: {
                        type: "integer",
                        description: "Film ID (TMDB ID eller lokalt DB-ID afhængigt af endpoint)",
                    },
                    title: {
                        type: "string",
                        description: "Film titel",
                    },
                    overview: {
                        type: "string",
                        description: "Film beskrivelse",
                    },
                    release_date: {
                        type: "string",
                        format: "date",
                        description: "Udgivelsesdato (TMDB format)",
                    },
                    poster_path: {
                        type: "string",
                        nullable: true,
                        description: "Sti til plakatbillede (TMDB)",
                    },
                    backdrop_path: {
                        type: "string",
                        nullable: true,
                        description: "Sti til baggrundsbillede (TMDB)",
                    },
                    vote_average: {
                        type: "number",
                        format: "float",
                        description: "Gennemsnitlig bedømmelse (0-10, TMDB)",
                    },
                    vote_count: {
                        type: "integer",
                        description: "Antal stemmer (TMDB)",
                    },
                    adult: {
                        type: "boolean",
                        description: "Er filmen kun for voksne? (TMDB)",
                    },
                    genre_ids: {
                        type: "array",
                        items: { type: "integer" },
                        description: "Liste af genre IDs (TMDB)",
                    },
                    popularity: {
                        type: "number",
                        format: "float",
                        description: "Popularitets-score (TMDB)",
                    },
                    video: {
                        type: "boolean",
                        description: "Har filmen video? (TMDB)",
                    },
                    original_language: {
                        type: "string",
                        description: "Originalsprog (TMDB)",
                    },
                    original_title: {
                        type: "string",
                        description: "Original titel (TMDB)",
                    },

                    // Lokale DB-felter (bruges især ved POST/DELETE respons)
                    released: {
                        type: "string",
                        nullable: true,
                        description: "Udgivelsesdato som brugt i DB (fx '2025-12-31')",
                    },
                    runtime: {
                        type: "integer",
                        nullable: true,
                        description: "Varighed i minutter (lokal DB)",
                    },
                    rating: {
                        type: "number",
                        format: "float",
                        nullable: true,
                        description: "Bedømmelse (lokal DB)",
                    },
                    background_image: {
                        type: "string",
                        nullable: true,
                        description: "URL eller sti til baggrundsbillede (lokal DB)",
                    },
                    metacritic: {
                        type: "integer",
                        nullable: true,
                        description: "Metacritic-score (lokal DB)",
                    },
                    poster_image: {
                        type: "string",
                        nullable: true,
                        description: "URL eller sti til plakatbillede (lokal DB)",
                    },
                    plot: {
                        type: "string",
                        nullable: true,
                        description: "Detaljeret plot-beskrivelse (lokal DB)",
                    },
                    director: {
                        type: "string",
                        nullable: true,
                        description: "Instruktør (lokal DB)",
                    },
                },
            },

            // Schema til at oprette ny film i DB
            NewMovie: {
                type: "object",
                required: ["title"],
                description:
                    "Schema for at oprette en ny film i den lokale database (bruges af POST /api/movies).",
                properties: {
                    title: {
                        type: "string",
                        description: "Film titel (påkrævet)",
                    },
                    overview: {
                        type: "string",
                        description: "Kort beskrivelse af filmen",
                    },
                    released: {
                        type: "string",
                        format: "date",
                        description: "Udgivelsesdato (fx '2025-12-31')",
                    },
                    runtime: {
                        type: "integer",
                        description: "Varighed i minutter",
                    },
                    rating: {
                        type: "number",
                        format: "float",
                        description: "Bedømmelse (0-10)",
                    },
                    background_image: {
                        type: "string",
                        description: "URL til baggrundsbillede",
                    },
                    poster_image: {
                        type: "string",
                        description: "URL til plakatbillede",
                    },
                    plot: {
                        type: "string",
                        description: "Detaljeret plot-beskrivelse",
                    },
                    director: {
                        type: "string",
                        description: "Instruktør",
                    },
                    metacritic: {
                        type: "integer",
                        description: "Metacritic-score",
                    },
                },
            },
        },
    },
};

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss: ".swagger-ui .info h2 { display: none }",
        customSiteTitle: "Movie API Documentation",
    }));
    console.log(
        "📚 Swagger dokumentation tilgængelig på http://localhost:5001/api-docs"
    );
}
