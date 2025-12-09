import { Express } from "express";
import movieRouter from "../routes/movieRouter";
import authRouter from "../routes/authRouter";

// Denne funktion modtager Express-app'en og registrerer alle API-routes.
// Det gør main-serverfilen (fx server.ts / app.ts) renere og mere overskuelig.

export function setupRouters(app: Express) {
    

    // Router til alt der handler om film
    // Eksempler:
    // GET    /api/movies
    // POST   /api/movies
    // GET    /api/movies/:id
    // DELETE /api/movies/:id
    app.use("/api/movies", movieRouter);
    
    // Router til authentication:
    // POST   /api/auth/login
    // POST   /api/auth/signup
    // GET    /api/auth/profile
    // POST   /api/auth/logout
    app.use("/api/auth", authRouter);
}


