import { Request, Router } from "express";
//import { Movie } from "../entities/Movie";
import {
    createMovie,
    deleteMovieById,
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
    movies: Movie[],
    total: number,
    req: Request
): MoviesResponse => {
    const page = req.query.page ? Number(req.query.page) : START_PAGE;

    let pageSize = req.query.page_size
    ? Number(req.query.page_size)
    : DEFAULT_PAGE_SIZE;

    if (pageSize > MAX_PAGE_SIZE) {
    pageSize = MAX_PAGE_SIZE;
    }

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

// GET /api/movies – liste af film
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

// GET /api/movies/:id – én film
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

// !!! Trailers-route fjernet for nu, da getMovieTrailers ikke findes i service
// Når I har en TMDB-service, kan I tilføje den igen.

// POST /api/movies – opret film
movieRouter.post("/", async (req, res, next) => {
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

// DELETE /api/movies/:id – slet film
movieRouter.delete("/:id", async (req, res, next) => {
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
