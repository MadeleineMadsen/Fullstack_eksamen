import express from "express";
import cors from "cors";
import { setupSwagger } from "./swagger";
import { setupRouters } from "./startup/setupRouters";

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

// Health-check (god til debugging)
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
