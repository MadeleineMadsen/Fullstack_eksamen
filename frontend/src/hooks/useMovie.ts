import { useQuery } from '@tanstack/react-query';
import { movieService, MovieFilters } from '../services/movieService';
import Movie from '../entities/Movie';

// --------------------------------------------------------------
// useMovies — custom hook til at hente en liste af film
// via React Query med caching, staleTime og retries.
//
// filters?: MovieFilters → gør det muligt at filtrere listen
// (f.eks. søgning, genre, sortering)
//
// React Query håndterer:
// - Automatisk caching
// - Automatisk gen-fetching når filters ændrer sig
// - Fejlhåndtering i UI
// --------------------------------------------------------------
export const useMovies = (filters?: MovieFilters) => {
    return useQuery<Movie[], Error>({
        queryKey: ['movies', filters],
          // queryKey bestemmer caching — skifter når filters ændres
        queryFn: () => movieService.getAllMovies(filters),
         // Funktion der kalder vores movieService for at hente data
        staleTime: 5 * 60 * 1000,

        // Data regnes som “frisk” i 5 min (ingen refetch på fokus)
        cacheTime: 10 * 60 * 1000,

        // Data gemmes i cache i 10 min efter ingen bruger det længere
        retry: 2,
        // Ved fejl prøver React Query igen op til 2 gange
    });
};

// --------------------------------------------------------------
// useMovie — custom hook til at hente én specifik film
// baseret på dens ID.
//
// enabled: !!id → query kører kun, hvis ID'et faktisk findes.
// (Dette forhindrer fejl når komponenten loader første gang)
//
// React Query caches film per ID, så samme film ikke hentes igen.
// --------------------------------------------------------------
export const useMovie = (id: number) => {
    return useQuery<Movie, Error>({
        queryKey: ['movie', id],
        queryFn: () => movieService.getMovieById(id),
        enabled: !!id, // Kører kun hvis id findes
        staleTime: 10 * 60 * 1000,
    });
};