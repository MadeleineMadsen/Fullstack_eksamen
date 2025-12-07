// index.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";

import { AppDataSource } from "./data-source";
import tmdbRoutes from './routes/tmdbRoutes';
import { setupRouters } from "./startup/setupRouters";
import { setupSwagger } from "./swagger";

const app = express();

// ====== Middleware ======
app.use(express.json());
app.use(cookieParser());

// CORS – tillad både lokal udvikling og din Render-frontend
const allowedOrigins = [
    "http://localhost:5173",                        // lokal Vite
    "https://fullstack-eksamen.onrender.com/", // frontend-URL
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true, // gør cookies mulige
    })
);

// ====== Swagger & Routes ======
setupSwagger(app);
setupRouters(app);
app.use('/api/tmdb', tmdbRoutes);

// Root route (info)
app.get("/", (req, res) => {
    res.json({
        message: "Movie API Backend is running! 🎬",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            docs: "/api-docs",
            health: "/health",
            movies: "/api/movies",
            auth: "/api/auth",
        },
    });
});

// Health-check – viser også om TMDB API key er sat
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        tmdbApiKey: !!process.env.TMDB_API_KEY,
    });
});

// ====== Start server KUN når DB er klar ======
const PORT = process.env.PORT || 5000;

// Log lige om TMDB key er sat
console.log("TMDB_API_KEY configured:", !!process.env.TMDB_API_KEY);

AppDataSource.initialize()
    .then(() => {
        console.log(" Database connected successfully!");

        app.listen(PORT, () => {
            console.log(` Backend server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(" Error initializing database:", err);
    });

