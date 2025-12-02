import { Express } from "express";
import movieRouter from "../routes/movieRouter";
import authRouter from "../routes/authRouter";

export function setupRouters(app: Express) {
    app.use("/api/movies", movieRouter);
    app.use("/api/auth", authRouter);
}

    // Tilføj andre routers her senere:
    // app.use('/api/users', userRouter);
    // app.use('/api/auth', authRouter);

