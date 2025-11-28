// backend/swagger.ts
import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Movie API",
        version: "1.0.0",
        description: "API til håndtering af film fra The Movie Database (TMDB)",
    },
    servers: [
        {
            url: "http://localhost:5001",
            description: "Local development server"
        },
    ],

    paths: {
        "/api/movies": {
            get: {
                tags: ["Movies"],
                summary: "Hent liste af populære film fra TMDB",
                description: "Henter en pagineret liste af populære film fra The Movie Database",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Side nummer for pagination",
                        required: false,
                        schema: { 
                            type: "integer", 
                            default: 1,
                            minimum: 1
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
                            maximum: 40
                        },
                    },
                    {
                        name: "title",
                        in: "query",
                        description: "Filtrer efter titel",
                        required: false,
                        schema: { type: "string" },
                    },
                    {
                        name: "genre",
                        in: "query", 
                        description: "Filtrer efter genre ID",
                        required: false,
                        schema: { type: "integer" },
                    },
                    {
                        name: "minRating",
                        in: "query",
                        description: "Minimum bedømmelse",
                        required: false,
                        schema: { type: "number" },
                    },
                    {
                        name: "maxRating",
                        in: "query",
                        description: "Maksimum bedømmelse", 
                        required: false,
                        schema: { type: "number" },
                    },
                    {
                        name: "year",
                        in: "query",
                        description: "Filtrer efter udgivelsesår",
                        required: false,
                        schema: { type: "integer" },
                    }
                ],
                responses: {
                    200: {
                        description: "Successfuldt response med film liste",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/MoviesResponse"
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server fejl"
                    }
                },
            },
            post: {
                tags: ["Movies"],
                summary: "Opret en ny film",
                description: "⚠️ Ikke implementeret - API'et bruger skrivebeskyttet TMDB data",
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
                    400: { description: "Ugyldige data" },
                    501: { description: "Ikke implementeret" }
                },
            },
        },

        "/api/movies/{id}": {
            get: {
                tags: ["Movies"],
                summary: "Hent detaljer for en specifik film",
                description: "Henter detaljerede oplysninger om en enkelt film fra The Movie Database",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { 
                            type: "integer",
                            example: 550 
                        },
                        description: "TMDB Film ID",
                    },
                ],
                responses: {
                    200: {
                        description: "Film detaljer",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Movie" },
                            },
                        },  
                    },
                    404: { 
                        description: "Film ikke fundet i TMDB" 
                    },
                    500: { 
                        description: "Server fejl" 
                    }
                },
            },
            delete: {
                tags: ["Movies"],
                summary: "Slet en film",
                description: "⚠️ Ikke implementeret - API'et bruger skrivebeskyttet TMDB data",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    204: { description: "Film slettet" },
                    404: { description: "Film ikke fundet" },
                    501: { description: "Ikke implementeret" }
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
                        description: "Total antal film"
                    },
                    next: {
                        type: "string",
                        nullable: true,
                        description: "URL til næste side af resultater"
                    },
                    results: {
                        type: "array",
                        items: { 
                            $ref: "#/components/schemas/Movie" 
                        }
                    }
                }
            },
            
            Movie: {
                type: "object",
                properties: {
                    id: { 
                        type: "integer",
                        description: "TMDB film ID" 
                    },
                    title: { 
                        type: "string",
                        description: "Film titel" 
                    },
                    overview: { 
                        type: "string",
                        description: "Film beskrivelse" 
                    },
                    release_date: { 
                        type: "string", 
                        format: "date",
                        description: "Udgivelsesdato" 
                    },
                    poster_path: { 
                        type: "string",
                        description: "Sti til plakatbillede" 
                    },
                    backdrop_path: { 
                        type: "string",
                        description: "Sti til baggrundsbillede" 
                    },
                    vote_average: { 
                        type: "number", 
                        format: "float",
                        description: "Gennemsnitlig bedømmelse (0-10)" 
                    },
                    vote_count: { 
                        type: "integer",
                        description: "Antal stemmer" 
                    },
                    adult: { 
                        type: "boolean",
                        description: "Er filmen for voksne?" 
                    },
                    genre_ids: {
                        type: "array",
                        items: { type: "integer" },
                        description: "Liste af genre IDs"
                    },
                    popularity: {
                        type: "number",
                        format: "float", 
                        description: "Popularitets score"
                    },
                    video: {
                        type: "boolean",
                        description: "Har filmen video?"
                    },
                    original_language: {
                        type: "string",
                        description: "Originalsprog"
                    },
                    original_title: {
                        type: "string", 
                        description: "Original titel"
                    }
                }
            },
            
            NewMovie: {
                type: "object",
                required: ["title"],
                description: "Schema for at oprette en ny film (ikke implementeret)",
                properties: {
                    title: { 
                        type: "string",
                        description: "Film titel (påkrævet)" 
                    },
                    overview: { 
                        type: "string",
                        description: "Film beskrivelse" 
                    },
                    release_date: { 
                        type: "string", 
                        format: "date",
                        description: "Udgivelsesdato" 
                    },
                    runtime: { 
                        type: "integer",
                        description: "Varighed i minutter" 
                    },
                    rating: { 
                        type: "number", 
                        format: "float",
                        description: "Bedømmelse" 
                    },
                    background_image: { 
                        type: "string",
                        description: "URL til baggrundsbillede" 
                    },
                },
            },
        },
    },
};

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss: '.swagger-ui .info h2 { display: none }', // Fjerner "Movie API" overskriften to gange
        customSiteTitle: "Movie API Documentation"
    }));
    console.log("📚 Swagger dokumentation tilgængelig på http://localhost:5001/api-docs");
}