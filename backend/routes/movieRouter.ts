import { Request, Router } from "express";
import { adminMiddleware } from "../middleware/adminMiddleware"; // TILFØJ denne import
import { authMiddleware } from "../middleware/authMiddleware";
//import { Movie } from "../entities/Movie";
import {
    createMovie,
    deleteMovieById,
    getAdminMoviesFromDb,
    getMovie,
    getMovies,
    MovieFilters,
    PaginationOptions,
} from "../services/movieService";

export const DEFAULT_PAGE_SIZE = 20;
export const START_PAGE = 1;
export const MAX_PAGE_SIZE = 40;

interface MoviesResponse {
    count: number;
    next: string | null;
    //results: Movie[];
    results: any[];
}

const movieRouter = Router();

const buildMoviesResponse = (
    movies: any[],
    total: number,
    req: Request
): MoviesResponse => {
    const page = req.query.page ? Number(req.query.page) : START_PAGE;
    const pageSize = req.query.page_size
        ? Number(req.query.page_size)
        : DEFAULT_PAGE_SIZE;
    const totalPages = Math.ceil(total / pageSize);
    const baseUrl = process.env.SERVER_URL ?? "http://localhost:5001";

    return {
        count: total,
        next:
            page < totalPages
            ? `${baseUrl}/api/movies?page=${page + 1}&page_size=${pageSize}`
            : null,
        results: movies,
    };
};

// Tilføj denne midlertidige test route
movieRouter.get("/test-auth", authMiddleware, (req, res) => {
    res.json({ message: "Auth works!", userRole: (req as any).userRole });
});




// GET /api/movies – liste af film (PUBLIC)
movieRouter.get("/", async (req, res, next) => {
    try {
        const filters: MovieFilters = {
            title: req.query.title as string | undefined,
            genre: req.query.genre ? Number(req.query.genre) : undefined,
            minRating: req.query.minRating
                ? Number(req.query.minRating)
                : undefined,
            maxRating: req.query.maxRating
                ? Number(req.query.maxRating)
                : undefined,
            year: req.query.year ? Number(req.query.year) : undefined,
        };

        const pagination: PaginationOptions = {
            page: req.query.page ? Number(req.query.page) : START_PAGE,
            pageSize: req.query.page_size
                ? Number(req.query.page_size)
                : DEFAULT_PAGE_SIZE,
        };

        const { movies, total } = await getMovies(filters, pagination);
        const response = buildMoviesResponse(movies, total, req);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

// GET /api/movies/admin – kun film oprettet af admin i DB (ADMIN ONLY)
movieRouter.get("/admin", authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const movies = await getAdminMoviesFromDb();
        res.json(movies);
    } catch (error) {
        next(error);
    }
});

// GET /api/movies/:id – én film (PUBLIC)
movieRouter.get("/:id", async (req, res, next) => {
    const movieId = Number(req.params.id);

    try {
        const movie = await getMovie(movieId);

        if (movie) {
            res.send(movie);
        } else {
            res.status(404).send({ error: "Movie not found." });
        }
    } catch (error) {
        next(error);
    }
});

// POST /api/movies – opret film (ADMIN ONLY)
movieRouter.post("/", authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
        const data = req.body;

        if (!data.title) {
            return res.status(400).send({ error: "title is required" });
        }

        const movie = await createMovie(data);
        res.status(201).send(movie);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/movies/:id – slet film (ADMIN ONLY)
movieRouter.delete("/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
    const movieId = Number(req.params.id);

    try {
        const deleted = await deleteMovieById(movieId);

        if (!deleted) {
            return res.status(404).send({ error: "Movie not found." });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default movieRouter;