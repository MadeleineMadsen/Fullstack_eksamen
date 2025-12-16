import { useQuery } from '@tanstack/react-query';
import Movie from '../entities/Movie';
import { MovieFilters, movieService } from '../services/movieService';

// Henter liste af film (med filtre)
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

// Henter film baseret på søgetekst
export const useMovieSearch = (searchQuery: string) => {
    return useQuery<Movie[], Error>({
        queryKey: ['movies', 'search', searchQuery],
        queryFn: () => movieService.getAllMovies({ search: searchQuery }),
        enabled: searchQuery.length > 0, 
        staleTime: 2 * 60 * 1000, 
    });
};

// Henter film baseret på genre
export const useMoviesByGenre = (genreId: number) => {
    return useQuery<Movie[], Error>({
        queryKey: ['movies', 'genre', genreId],
        queryFn: () => movieService.getAllMovies({ genre: genreId }),
        enabled: !!genreId,  // Kør kun hvis genre er valgt
    });
};

// Henter én specifik film baseret på ID
export const useMovie = (id: number) => {
    return useQuery<Movie, Error>({
        queryKey: ['movie', id],
        queryFn: () => movieService.getMovieById(id),
        enabled: !!id, // Kører kun hvis id findes
        staleTime: 10 * 60 * 1000,
    });
};