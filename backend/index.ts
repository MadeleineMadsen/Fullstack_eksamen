import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import { setupRouters } from "./startup/setupRouters";
import { setupSwagger } from "./swagger";
import { AppDataSource } from "./data-source";

const app = express();

// JSON body parser
app.use(express.json());

// Cookie parser (NØDVENDIG for auth!)
app.use(cookieParser());

// CORS – strammet til Vite frontend
app.use(
    cors({
        origin: "http://localhost:5173",  // din frontend
        credentials: true,                // gør cookies mulige
    })
);

// Swagger
setupSwagger(app);

// Routers
setupRouters(app);

// Test route
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

// Health-check
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// ==== IMPORTANT: Start server only after DB is ready ====
const PORT = process.env.PORT || 5000;

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
