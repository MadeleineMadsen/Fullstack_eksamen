import { Request, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

import {
    createMovie,
    deleteMovieById,
    getAdminMoviesFromDb,
    getMovie,
    getMovies,
    MovieFilters,
    PaginationOptions,
} from "../services/movieService";

// Standard værdier til pagination
export const DEFAULT_PAGE_SIZE = 20;
export const START_PAGE = 1;
export const MAX_PAGE_SIZE = 40;

// Typen for det svar vi sender tilbage på liste-endpointet
interface MoviesResponse {
    count: number;          // samlet antal film der matcher filteret
    next: string | null;    // link til næste side (eller null hvis ingen)
    //results: Movie[];
    results: any[];         // her kunne vi bruge Movie-type, men bruger any for simpelt
}

const movieRouter = Router();


// Helper-funktion som bygger et standardiseret svar til /api/movies
const buildMoviesResponse = (
    movies: any[],
    total: number,
    req: Request
): MoviesResponse => {
    // Nuvarande side
    const page = req.query.page ? Number(req.query.page) : START_PAGE;

    // Side-størrelse (antal film per side)
    const pageSize = req.query.page_size
        ? Number(req.query.page_size)
        : DEFAULT_PAGE_SIZE;

    // Samlet antal sider
    const totalPages = Math.ceil(total / pageSize);
    // Base-URL til at bygge "next"-link (fallback til localhost hvis env ikke sat)
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




// GET /api/movies – liste af film (med filters + pagination)
movieRouter.get("/", async (req, res, next) => {
    try {
        // Byg filter-objekt ud fra query params
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
        // Pagination-opsætning baseret på query params
        const pagination: PaginationOptions = {
            page: req.query.page ? Number(req.query.page) : START_PAGE,
            pageSize: req.query.page_size
                ? Number(req.query.page_size)
                : DEFAULT_PAGE_SIZE,
        };

        // Hent film fra service-laget
        const { movies, total } = await getMovies(filters, pagination);
        // Byg standardiseret response (count, next, results)
        const response = buildMoviesResponse(movies, total, req);
        res.send(response);
    } catch (error) {
        // Send fejlen videre til global error handler
        next(error);
    }
});

// GET /api/movies/admin – kun film oprettet af admin i DB
// Beskyttet med authMiddleware + rollecheck
movieRouter.get("/admin", authMiddleware, async (req, res, next) => {
    try {
        const role = (req as any).userRole;
        // Kun admin-brugere må få adgang
        if (role !== "admin") {
            return res.status(403).json({ message: "Forbidden: admin only" });
        }

        const movies = await getAdminMoviesFromDb();
        res.json(movies);
    } catch (error) {
        next(error);
    }
});

// GET /api/movies/:id – hent én film ud fra id
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

// GET /api/movies/:id/trailer – hent trailer key 
movieRouter.get("/:id/trailer", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const movie = await getMovie(id);

        // Ingen TMDB-id → ingen trailer
        if (!movie?.tmdb_id) {
            return res.json({ key: null });
        }

        const apiKey = process.env.TMDB_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "TMDB_API_KEY missing" });
        }

        const tmdbUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`;
        const r = await fetch(tmdbUrl);

        if (!r.ok) {
            return res.status(r.status).json({ error: "Failed to fetch TMDB videos" });
        }

        const data: any = await r.json();

        const trailer =
            data?.results?.find(
                (v: any) => v.site === "YouTube" && v.type === "Trailer"
            ) ??
            data?.results?.find(
                (v: any) => v.site === "YouTube" && (v.type === "Teaser" || v.type === "Clip")
            );

        return res.json({ key: trailer?.key ?? null });
    } catch (error) {
        next(error);
    }
});






// POST /api/movies – opret en ny film
// (pt. uden auth, så alle kan oprette – kan senere begrænses til admin)
movieRouter.post("/", async (req, res, next) => {
    try {
        const data = req.body;

        // Simpel validering: title er påkrævet
        if (!data.title) {
            return res.status(400).send({ error: "title is required" });
        }

        // Opret film via service-laget
        const movie = await createMovie(data);
        res.status(201).send(movie);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/movies/:id – slet film med given id
movieRouter.delete("/:id", async (req, res, next) => {
    const movieId = Number(req.params.id);

    try {
        const deleted = await deleteMovieById(movieId);

        if (!deleted) {
            return res.status(404).send({ error: "Movie not found." });
        }
        // 204 = No Content (ingen body, men succesfuld sletning)
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default movieRouter;