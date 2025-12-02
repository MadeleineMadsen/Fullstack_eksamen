import { useQuery } from '@tanstack/react-query';
import { movieService, MovieFilters } from '../services/movieService';
import Movie from '../entities/Movie';

// Hook for at hente alle film (med filtre)
export const useMovies = (filters?: MovieFilters) => {
    return useQuery<Movie[], Error>({
        queryKey: ['movies', filters],
        queryFn: () => movieService.getAllMovies(filters),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
    });
};

// Hook for at hente en enkelt film
export const useMovie = (id: number) => {
    return useQuery<Movie, Error>({
        queryKey: ['movie', id],
        queryFn: () => movieService.getMovieById(id),
        enabled: !!id, // Kører kun hvis id findes
        staleTime: 10 * 60 * 1000,
    });
};