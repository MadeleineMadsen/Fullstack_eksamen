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
            movies: (data.results || []).map((movie: any) => ({
                ...movie,
                rating: Number(movie.vote_average?.toFixed(1)),
                metacritic: null,
            })),
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

    // 1. Tjek om filmen er i din egen database
    const localMovie = await movieRepo.findOne({
        where: { id },
        relations: ["genres", "streaming_platforms", "trailers"],
    });

    if (localMovie) {
        console.log(` Found movie ${id} in local database`);

        // Hvis runtime eller director mangler → hent fra TMDB
        if (!localMovie.runtime || !localMovie.director) {
            const tmdbId = (localMovie as any).tmdb_id ?? id;

            const [movieRes, creditsRes] = await Promise.all([
                fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`),
                fetch(`${TMDB_BASE_URL}/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}`)
            ]);

            if (movieRes.ok && creditsRes.ok) {
                const movieData = await movieRes.json();
                const credits = await creditsRes.json();

                const director = credits.crew?.find(
                    (person: any) => person.job === "Director"
                );

                // NYT: Hent også streaming data
                let streamingPlatforms = [];
                try {
                    const providersResponse = await fetch(
                        `${TMDB_BASE_URL}/movie/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`
                    );

                    if (providersResponse.ok) {
                        const providersData = await providersResponse.json();
                        const countryData = providersData.results?.[countryCode] || providersData.results?.US;

                        if (countryData?.flatrate) {
                            streamingPlatforms = countryData.flatrate.map((provider: any) => ({
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
                    console.log("Could not load streaming data for local movie");
                }

                return {
                    ...localMovie,
                    tmdb_id: localMovie.tmdb_id ?? null,
                    metacritic: localMovie.metacritic ?? null,
                    runtime: movieData.runtime ?? localMovie.runtime,
                    director: director?.name ?? localMovie.director,
                    rating: Number(
                        (localMovie.rating ?? movieData.vote_average)?.toFixed(1)
                    ),
                    // NYT: Tilføj streaming data
                    streaming_platforms: streamingPlatforms,
                    has_streaming_info: streamingPlatforms.length > 0
                };
            }
        }

        // Returnér localMovie med eventuel streaming data fra databasen
        return {
            ...localMovie,
            metacritic: localMovie.metacritic ?? null,
            has_streaming_info: localMovie.streaming_platforms?.length > 0
        };
    }

    // Hvis filmen ikke findes lokalt → hent fra TMDB
    if (!TMDB_API_KEY) {
        throw new Error("TMDB_API_KEY is missing");
    }

    console.log(`Fetching movie ${id} from TMDB...`);

    try {
        // Hent filmdata, credits OG streaming data samtidig
        const [movieRes, creditsRes, providersRes] = await Promise.all([
            fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`),
            fetch(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`),
            fetch(`${TMDB_BASE_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`)
        ]);

        if (!movieRes.ok || !creditsRes.ok) {
            throw new Error("TMDB API returned error");
        }

        const data = await movieRes.json();
        const credits = await creditsRes.json();

        const director = credits.crew?.find(
            (person: any) => person.job === "Director"
        );

        // Behandling af streaming data
        let streamingPlatforms = [];
        let has_streaming_info = false;

        if (providersRes.ok) {
            const providersData = await providersRes.json();
            const countryData = providersData.results?.[countryCode] || providersData.results?.US;

            if (countryData?.flatrate) {
                streamingPlatforms = countryData.flatrate.map((provider: any) => ({
                    id: provider.provider_id,
                    name: provider.provider_name,
                    logo_path: provider.logo_path,
                    logo_url: provider.logo_path
                        ? `https://image.tmdb.org/t/p/w200${provider.logo_path}`
                        : null
                }));
                has_streaming_info = streamingPlatforms.length > 0;
            }
        }

        // Returnér komplet filmdata med streaming
        return {
            id: data.id,
            tmdb_id: data.id,
            title: data.title,
            overview: data.overview,
            released: data.release_date,
            runtime: data.runtime,
            rating: Number(data.vote_average?.toFixed(1)),
            metacritic: null,
            poster_image: data.poster_path
                ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                : null,
            background_image: data.backdrop_path
                ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
                : null,
            director: director?.name ?? null,
            // Streaming data
            streaming_platforms: streamingPlatforms,
            has_streaming_info: has_streaming_info,
            // Ekstra felter
            genres: data.genres || [],
            original_language: data.original_language,
            popularity: data.popularity,
            vote_count: data.vote_count
        };

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
        select: ["id", "title", "released", "metacritic"],// Kun disse felter returneres
    });

    return movies;
};

