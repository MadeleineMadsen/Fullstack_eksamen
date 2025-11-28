import { Express } from 'express';
import movieRouter from '../routes/movieRouter';

export function setupRouters(app: Express) {
    app.use('/api/movies', movieRouter);
    
    // Tilføj andre routers her senere:
    // app.use('/api/users', userRouter);
    // app.use('/api/auth', authRouter);
}