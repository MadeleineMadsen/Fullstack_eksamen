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

export const getMovie = async (id: number, countryCode: string = 'DK'): Promise<any> => {
    const movieRepo = AppDataSource.getRepository(Movie);

    // 1. Tjek om filmen er i din egen database (valgfrit)
    const localMovie = await movieRepo.findOne({
        where: { id },
        relations: ["genres", "actors", "streaming_platforms", "trailers"],
    });

    if (localMovie) {
        console.log(`Found movie ${id} in local database`);
        // Hvis du har streaming data i din egen database, returnér det
        return localMovie;
    }

    // 2. Hent fra TMDB
    if (!TMDB_API_KEY) {
        throw new Error("TMDB_API_KEY is missing");
    }

    try {
        console.log(`Fetching movie ${id} from TMDB...`);

        // 2A. HENT FILMDATA
        const movieResponse = await fetch(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        if (!movieResponse.ok) {
            throw new Error(`TMDB API returned ${movieResponse.status}`);
        }

        const movieData = await movieResponse.json();

        // 2B. HENT STREAMING-DATA
        let streamingPlatforms = [];
        try {
            const providersResponse = await fetch(
                `${TMDB_BASE_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`
            );

            if (providersResponse.ok) {
                const providersData = await providersResponse.json();
                const countryData = providersData.results?.[countryCode] || providersData.results?.US;

                if (countryData?.flatrate) {
                    // Formatér streamingdata til dit interne format
                    streamingPlatforms = countryData.flatrate.map(provider => ({
                        id: provider.provider_id,
                        name: provider.provider_name,
                        logo_path: provider.logo_path,
                        logo_url: provider.logo_path
                            ? `https://image.tmdb.org/t/p/w200${provider.logo_path}`
                            : null
                    }));
                }
            }
        } catch (streamingError) {
            console.log("Could not load streaming data, continuing without it");
            // Fortsæt uden streaming data - ikke fatal fejl
        }

        // 2C. KOMBINER DATA
        const enhancedMovie = {
            // Filmens basisdata fra TMDB
            id: movieData.id,
            title: movieData.title,
            overview: movieData.overview,
            released: movieData.release_date,
            rating: movieData.vote_average,
            runtime: movieData.runtime,
            poster_image: movieData.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                : null,
            backdrop_image: movieData.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
                : null,

            // Streaming data vi lige har hentet
            streaming_platforms: streamingPlatforms,

            // Info om kilden til data
            data_source: "tmdb",
            has_streaming_info: streamingPlatforms.length > 0
        };

        // 3. (VALGFRIT) Gem filmen i din egen database til næste gang
        if (!localMovie && streamingPlatforms.length > 0) {
            // Her kunne du gemme filmen i din database
            // sammen med streaming platform info
        }

        return enhancedMovie;

    } catch (error) {
        console.error("Error fetching TMDB movie:", error);
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

