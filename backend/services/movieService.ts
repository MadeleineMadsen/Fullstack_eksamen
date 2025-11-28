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
        console.log(`🎬 Fetching movies from TMDB API, page: ${pagination.page}`);
        
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

// These functions would need to be implemented if you want to use your database
export const deleteMovieById = async (id: number): Promise<boolean> => {
    throw new Error("Not implemented - using TMDB API");
};

export const createMovie = async (movieData: any): Promise<any> => {
    throw new Error("Not implemented - using TMDB API");
};