import { AppDataSource } from "../data-source";
import { Movie } from "../entities/Movie";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

console.log('TMDB_API_KEY configured:', !!TMDB_API_KEY);

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

export const getMovies = async (
    filters: MovieFilters = {},
    pagination: PaginationOptions = { page: 1, pageSize: 20 }
): Promise<MovieResponse> => {
    if (!TMDB_API_KEY) {
        throw new Error('TMDB_API_KEY is not configured');
    }

    try {
        console.log(` Fetching movies from TMDB API, page: ${pagination.page}`);

        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${pagination.page}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform TMDB response to match your expected format
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

export const getMovie = async (id: number): Promise<any> => {
    if (!TMDB_API_KEY) {
        throw new Error('TMDB_API_KEY is not configured');
    }

    try {
        console.log(`🎬 Fetching movie details for ID: ${id}`);

        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching movie with ID ${id}:`, error);
        throw new Error("Failed to fetch movie");
    }
};

// ===============
//  DB CRUD (Create + Delete)
// ===============

// SLET film i databasen
export const deleteMovieById = async (id: number): Promise<boolean> => {
    const movieRepo = AppDataSource.getRepository(Movie);

    const result = await movieRepo.delete({ id });

    // result.affected = antal rækker der blev slettet
    return !!result.affected && result.affected > 0;
};

// OPRET film i databasen
export const createMovie = async (movieData: any): Promise<Movie> => {
    const movieRepo = AppDataSource.getRepository(Movie);

    // Lav en ny Movie-entity ud fra request body
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
    } as Partial<Movie>); //  cast så TypeScript slapper af

    // Gem i databasen (id bliver sat automatisk)
    const savedMovie = await movieRepo.save(movie as Movie);
    return savedMovie as Movie;
};
