import { Router, Request } from "express";
import { Movie } from "../entities/Movie";
import { StreamingPlatform } from "../entities/StreamingPlatform";
import {
    //getMovies,
    //getMovie,
    //getMovieTrailers,
    //deleteMovieById,
    //createMovie,
} from "../services/movieService";

export type ModifiedMovie = Omit<Movie, "streaming_platforms"> & {
    streaming_platforms: { platform: StreamingPlatform }[];
};

export const DEFAULT_PAGE_SIZE = 20;
export const START_PAGE = 1;
export const MAX_PAGE_SIZE = 40;

interface MoviesResponse {
    count: number;
    next: string | null;
    results: ModifiedMovie[];
}

const movieRouter = Router();

const buildMoviesResponse = (
    movies: ModifiedMovie[],
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

    const baseUrl = process.env.SERVER_URL ?? "http://localhost:5000";

    return {
    count: total,
    next:
        page < totalPages
        ? `${baseUrl}/api/movies?page=${page + 1}&page_size=${pageSize}`
        : null,
    results: movies,
    };
};

// GET /api/movies – liste af film (data kan komme fra TMDB + jeres DB)
movieRouter.get("/", async (req, res, next) => {
    try {
    const { modifiedMovies, total } = await getMovies(req); // service snakker med TMDB/DB
    const response = buildMoviesResponse(modifiedMovies, total, req);
    res.send(response);
    } catch (error) {
    next(error);
    }
});

// GET /api/movies/:id – én film
movieRouter.get("/:id", async (req, res, next) => {
    const movieId = req.params.id;
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

// GET /api/movies/:id/trailers – trailers/videoer til en film (TMDB)
movieRouter.get("/:id/trailers", async (req, res, next) => {
    try {
    const movieId = Number(req.params.id);
    const trailers = await getMovieTrailers(movieId);
    res.send({ count: trailers.length, results: trailers });
    } catch (error) {
    next(error);
    }
});

// POST /api/movies – opret film (senere: beskyttet af auth)
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
    await deleteMovieById(movieId);
    res.status(204).send();
    } catch (error) {
    next(error);
    }
});

export default movieRouter;
