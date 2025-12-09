import { AppDataSource } from "../data-source";
import { Movie } from "../entities/Movie";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

console.log('TMDB_API_KEY configured:', !!TMDB_API_KEY);
// -----------------------------------------
// Interfaces til filtrering, pagination og svar
// -----------------------------------------

export interface MovieFilters {
    title?: string;
    genre?: number;
    minRating?: number;
    maxRating?: number;
    year?: number;
}

export interface PaginationOptions {
    page: number;
    pageSize: number;
}

export interface MovieResponse {
    movies: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================================================
// GET MOVIES — Hent film fra TMDB Popular API (til listevisning)
// ============================================================================

export const getMovies = async (
    filters: MovieFilters = {},
    pagination: PaginationOptions = { page: 1, pageSize: 20 }
): Promise<MovieResponse> => {
    if (!TMDB_API_KEY) {
        throw new Error('TMDB_API_KEY is not configured');
    }

    try {
        console.log(` Fetching movies from TMDB API, page: ${pagination.page}`);

        // Simpel fetch til TMDB Popular API
        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${pagination.page}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();

        // Transformér TMDB respons til vores interne frontend-format
        return {
            movies: data.results || [],
            total: data.total_results || 0,
            page: data.page || 1,
            pageSize: pagination.pageSize,
            totalPages: data.total_pages || 1
        };

    } catch (error) {
        console.error("Error fetching movies from TMDB:", error);
        throw new Error("Failed to fetch movies");
    }
};


// ============================================================================
// GET ONE MOVIE — Hent film fra DB først, hvis ikke, hent fra TMDB
// ============================================================================

export const getMovie = async (id: number): Promise<any> => {
    const movieRepo = AppDataSource.getRepository(Movie);

    // Forsøg først at hente filmen lokalt i database
    const localMovie = await movieRepo.findOne({
        where: { id },
        relations: ["genres", "actors", "streaming_platforms", "trailers"],
    });

    if (localMovie) {
        console.log(` Found movie ${id} in local database`);
        return localMovie; // DONE ✔
    }

    // Hvis filmen ikke findes lokalt → hent fra TMDB
    if (!TMDB_API_KEY) {
        console.error("TMDB_API_KEY is missing");
        throw new Error("Movie not found");
    }

    console.log(` Fetching movie ${id} from TMDB...`);

    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`TMDB API returned ${response.status}`);
        }

        const data = await response.json();

        // Returnér TMDB-data direkte til frontend
        return data;

        
        // gem film i database så den findes lokalt næste gang

    } catch (error) {
        console.error(" Error fetching TMDB movie:", error);
        throw new Error("Movie not found");
    }
};

// ============================================================================
// DELETE MOVIE — Slet film fra databasen
// ============================================================================


export const deleteMovieById = async (id: number): Promise<boolean> => {
    const movieRepo = AppDataSource.getRepository(Movie);

    const result = await movieRepo.delete({ id });

    // result.affected = antal rækker slettet
    return !!result.affected && result.affected > 0;
};

// ============================================================================
// CREATE MOVIE — Opret film i databasen (admin-oprettede film)
// ============================================================================

export const createMovie = async (movieData: any): Promise<Movie> => {
    const movieRepo = AppDataSource.getRepository(Movie);

    // Opret entity-instans baseret på request body
    const movie = movieRepo.create({
        title: movieData.title,
        overview: movieData.overview ?? null,
        released: movieData.released ?? null,
        runtime: movieData.runtime ?? null,
        rating: movieData.rating ?? null,
        background_image: movieData.background_image ?? null,
        metacritic: movieData.metacritic ?? null,
        poster_image: movieData.poster_image ?? null,
        plot: movieData.plot ?? null,
        director: movieData.director ?? null,
        // Flag der markerer filmen som oprettet af en admin (lokal film)
        isAdmin: true,
    } as Partial<Movie>);

     // Gem filmen i Postgres
    const savedMovie = await movieRepo.save(movie as Movie);
    return savedMovie as Movie;
};


// ============================================================================
// GET ADMIN MOVIES — Hent kun film oprettet af admins
// ============================================================================

export const getAdminMoviesFromDb = async (): Promise<Movie[]> => {
    const movieRepo = AppDataSource.getRepository(Movie);

    const movies = await movieRepo.find({
        where: { isAdmin: true },
        order: { id: "DESC" },   // Senest tilføjede film først
        select: ["id", "title", "released"],// Kun disse felter returneres
    });

    return movies;
};

