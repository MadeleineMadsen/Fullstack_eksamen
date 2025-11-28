import cors from "cors";
import express from "express";
import { setupRouters } from "./startup/setupRouters";
import { setupSwagger } from "./swagger";

const app = express();

// Middleware
app.use(express.json());

// CORS – gør den strammere senere (når I ved hvor frontend hostes)
app.use(
    cors({
    origin: "*", // midlertidigt åbent – kan strammes til fx http://localhost:3000
    credentials: true,
    })
);

// Swagger
setupSwagger(app);

// Routers
setupRouters(app);



app.get("/", (req, res) => {
    res.json({ 
        message: "Movie API Backend is running! 🎬",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        endpoints: {
            docs: "/api-docs",
            health: "/health", 
            movies: "/api/movies"
        }
    });
});


// Health-check (god til debugging)
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
