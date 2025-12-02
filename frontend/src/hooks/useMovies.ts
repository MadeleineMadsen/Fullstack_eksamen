import { useQuery } from '@tanstack/react-query';
import { movieService, MovieFilters } from '../services/movieService';
import Movie from '../entities/Movie';

export const useMovies = (filters?: MovieFilters) => {
    return useQuery<Movie[], Error>({
        queryKey: ['movies', filters],
        queryFn: () => movieService.getAllMovies(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

// Optional: Separate hook for search
export const useMovieSearch = (searchQuery: string) => {
    return useQuery<Movie[], Error>({
        queryKey: ['movies', 'search', searchQuery],
        queryFn: () => movieService.getAllMovies({ search: searchQuery }),
        enabled: searchQuery.length > 0, // Only run if there's a search query
        staleTime: 2 * 60 * 1000, // 2 minutes for search results
    });
};

// Optional: Hook for movies by genre
export const useMoviesByGenre = (genreId: number) => {
    return useQuery<Movie[], Error>({
        queryKey: ['movies', 'genre', genreId],
        queryFn: () => movieService.getAllMovies({ genre: genreId }),
        enabled: !!genreId, // Only run if genreId is provided
    });
};