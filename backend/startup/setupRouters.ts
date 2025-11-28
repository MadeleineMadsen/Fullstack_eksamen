import { Express } from "express";
import movieRouter from "../routes/movieRouter";

export function setupRouters(app: Express) {
    app.use("/api/movies", movieRouter);
}
