// backend/swagger.ts
import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
    title: "Movie API",
    version: "1.0.0",
    description: "Simpel API til vores movie-projekt (eksamensprojekt).",
    },
    servers: [
    {
        url: "http://localhost:5001",
        description: "Local dev (Docker, host-port 5001)",
    },
    ],
    paths: {
    "/api/movies": {
        get: {
        tags: ["Movies"],
        summary: "Hent liste af film",
        parameters: [
            {
            name: "search",
            in: "query",
            description: "Fritekst-søgning i titler",
            required: false,
            schema: { type: "string" },
            },
            {
            name: "page",
            in: "query",
            description: "Side (pagination)",
            required: false,
            schema: { type: "integer", default: 1 },
            },
        ],
        responses: {
            200: {
            description: "Liste af film",
            content: {
                "application/json": {
                schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Movie" },
                },
                },
            },
            },
        },
        },
        post: {
        tags: ["Movies"],
        summary: "Opret en ny film (beskyttet route senere)",
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
            401: { description: "Ikke logget ind (når auth er på)" },
        },
        },
    },

    "/api/movies/{id}": {
        get: {
        tags: ["Movies"],
        summary: "Hent én film",
        parameters: [
            {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "Movie ID",
            },
        ],
        responses: {
            200: {
            description: "En enkelt film",
            content: {
                "application/json": {
                schema: { $ref: "#/components/schemas/Movie" },
                },
            },  
            },
            404: { description: "Film ikke fundet" },
        },
        },
        delete: {
        tags: ["Movies"],
        summary: "Slet en film (beskyttet route)",
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
            401: { description: "Ikke logget ind" },
            404: { description: "Film ikke fundet" },
        },
        },
    },
    },
    components: {
    schemas: {
        Movie: {
        type: "object",
        properties: {
            id: { type: "integer" },
            title: { type: "string" },
            overview: { type: "string" },
            released: { type: "string", format: "date" },
            runtime: { type: "integer" },
            rating: { type: "number", format: "float" },
            background_image: { type: "string" },
        },
        },
        NewMovie: {
        type: "object",
        required: ["title"],
        properties: {
            title: { type: "string" },
            overview: { type: "string" },
            released: { type: "string", format: "date" },
            runtime: { type: "integer" },
            rating: { type: "number", format: "float" },
            background_image: { type: "string" },
        },
        },
    },
    },
};

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
