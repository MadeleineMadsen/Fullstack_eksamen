import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";


// ============================================================================
// MOCK movieService FØR movieRouter importeres
// ============================================================================
// Vitest erstatter hele "../services/movieService" med disse mock-funktioner.
// Det betyder, at når movieRouter kalder getMovies/getMovie, bruger den mock-data,
// så testen IKKE rammer TMDB eller databasen.
vi.mock("../services/movieService", () => {
    return {
        // Mock getMovies: returnér en liste med 1 film
        getMovies: vi.fn(async () => ({
            movies: [{ id: 1, title: "Mock Movie" }],
            total: 1,
            page: 1,
            pageSize: 20,
            totalPages: 1,
        })),

        // Mock getMovie: returnér 1 film baseret på ID
        getMovie: vi.fn(async (id: number) => ({
            id,
            title: `Mock Movie ${id}`,
        })),

        // Følgende mocks skal eksistere for at undgå import-fejl:
        createMovie: vi.fn(),
        deleteMovieById: vi.fn(),
        
    };
});

// ============================================================================
// IMPORTÉR NU movieRouter — efter mocking!
// ============================================================================
// Routeren vil nu bruge mockede services i stedet for rigtige TMDB-kald
import movieRouter from "../routes/movieRouter";

// ============================================================================
// Opret en mini-Express app til test
// ============================================================================
const app = express();
app.use(express.json());
app.use("/api/movies", movieRouter);

// ============================================================================
// TESTSUITE FOR MOVIE ROUTES
// ============================================================================

describe("Movies API routes", () => {

     // ------------------------------------------------------------------------
    // Test 1: GET /api/movies
    // Skal returnere 200 OK og results-array fra mock
    // ------------------------------------------------------------------------

    it("GET /api/movies should return 200 and a results array", async () => {
        const res = await request(app).get("/api/movies");

         // Statuskode OK
        expect(res.status).toBe(200);

        // Routeren skal have en "results"-nøgle
        expect(res.body).toHaveProperty("results");

        // Results skal være et array
        expect(Array.isArray(res.body.results)).toBe(true);

        // Første element skal matche vores mockede film
        expect(res.body.results[0].title).toBe("Mock Movie");
    });

    // ------------------------------------------------------------------------
    // Test 2: GET /api/movies/:id
    // Skal returnere én film med det ID vi beder om
    // ------------------------------------------------------------------------


    it("GET /api/movies/:id should return a single movie", async () => {
        const res = await request(app).get("/api/movies/123");

         // Statuskode OK
        expect(res.status).toBe(200);
         // Routeren skal returnere et objekt med ID og titel
        expect(res.body).toHaveProperty("id");
        expect(res.body.id).toBe(123);
        expect(res.body.title).toBe("Mock Movie 123");
    });
});
