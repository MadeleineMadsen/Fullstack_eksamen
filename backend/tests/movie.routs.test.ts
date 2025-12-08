import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";

// 👇 MOCK movieService FØR vi importerer movieRouter
vi.mock("../services/movieService", () => {
    return {
        // Mock getMovies: svarer som om TMDB/DB har 1 film
        getMovies: vi.fn(async () => ({
            movies: [{ id: 1, title: "Mock Movie" }],
            total: 1,
            page: 1,
            pageSize: 20,
            totalPages: 1,
        })),

        // Mock getMovie: svarer med én film
        getMovie: vi.fn(async (id: number) => ({
            id,
            title: `Mock Movie ${id}`,
        })),

        // Vi skal også eksportere de her, selvom vi ikke bruger dem i testen
        createMovie: vi.fn(),
        deleteMovieById: vi.fn(),
        // Hvis dine constants bruges i movieRouter, kan de komme her,
        // men i din router er de defineret lokalt, så de er egentlig ikke nødvendige.
    };
});

// 👈 movieRouter importeres først EFTER vi har mocket movieService
import movieRouter from "../routes/movieRouter";

// Mini-app til test
const app = express();
app.use(express.json());
app.use("/api/movies", movieRouter);

describe("Movies API routes", () => {
    it("GET /api/movies should return 200 and a results array", async () => {
        const res = await request(app).get("/api/movies");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("results");
        expect(Array.isArray(res.body.results)).toBe(true);
        expect(res.body.results[0].title).toBe("Mock Movie");
    });

    it("GET /api/movies/:id should return a single movie", async () => {
        const res = await request(app).get("/api/movies/123");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id");
        expect(res.body.id).toBe(123);
        expect(res.body.title).toBe("Mock Movie 123");
    });
});
