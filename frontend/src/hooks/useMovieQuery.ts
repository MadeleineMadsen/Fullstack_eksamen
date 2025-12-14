import { useCallback } from 'react';
import { useMovies, useMovie } from './useMovies'; // Dine eksisterende hooks
import useMovieQueryStore from '../store/movieQueryStore';
import useMovieStore from '../store/movieStore';

export const useMovieQuery = () => {
    // Zustand stores
    const movieQueryStore = useMovieQueryStore();
    const movieStore = useMovieStore();

    // React Query hooks
    const moviesQuery = useMovies(movieQueryStore.getQueryParams());
    const movieQuery = useMovie(movieStore.selectedMovie?.id || 0);

    // Action: Fetch movies med nuværende query
    const fetchMovies = useCallback(() => {
        const params = movieQueryStore.getQueryParams();
        // Denne vil automatisk trigge useMovies hook
        return params;
    }, [movieQueryStore]);

    // Action: Set og fetch movie details
    const fetchMovieDetails = useCallback((movieId: number) => {
        movieStore.setSelectedMovie(
            movieStore.movies.find(m => m.id === movieId) || null
        );
        // React Query vil automatisk fetche via useMovie hook
    }, [movieStore]);

    // Action: Load more (pagination)
    const loadMore = useCallback(() => {
        if (movieStore.currentPage >= movieStore.totalPages) return;

        const nextPage = movieStore.currentPage + 1;
        movieQueryStore.setPage(nextPage);

        // Simuler loading state for pagination
        movieStore.setIsFetchingMore(true);

        // Næste side vil blive fetchet automatisk via useMovies
        // når movieQuery ændrer sig
    }, [movieQueryStore, movieStore]);

    // Action: Update query og fetch
    const updateQueryAndFetch = useCallback((updates: Partial<typeof movieQueryStore.movieQuery>) => {
        // Update query state
        if (updates.genre !== undefined) movieQueryStore.setGenre(updates.genre);
        if (updates.streamingPlatform !== undefined) movieQueryStore.setStreamingPlatform(updates.streamingPlatform);
        if (updates.year !== undefined) movieQueryStore.setYear(updates.year);
        if (updates.minRating !== undefined) movieQueryStore.setMinRating(updates.minRating);
        if (updates.minMetacritic !== undefined) movieQueryStore.setMinMetacritic(updates.minMetacritic);
        if (updates.sortOrder !== undefined) movieQueryStore.setSortOrder(updates.sortOrder);
        if (updates.searchText !== undefined) movieQueryStore.setSearchText(updates.searchText);
        if (updates.director !== undefined) movieQueryStore.setDirector(updates.director);

        // Reset pagination ved nye filtre (undtagen page)
        if (Object.keys(updates).some(key => key !== 'page')) {
            movieStore.clearMovies();
        }

        // Fetch vil ske automatisk via React Query
    }, [movieQueryStore, movieStore]);

    // Combine loading states
    const isLoading = moviesQuery.isLoading || movieStore.isLoading;
    const isFetchingMore = movieStore.isFetchingMore;
    const isLoadingDetails = movieQuery.isLoading || movieStore.isLoadingDetails;

    // Combine errors
    const error = moviesQuery.error?.message || movieQuery.error?.message || movieStore.error;

    // Når moviesQuery data ændres, opdater movieStore
    if (moviesQuery.data && !movieStore.isFetchingMore) {
        // Hvis det er første side, erstat listen
        if (movieQueryStore.movieQuery.page === 1) {
            movieStore.setMovies(moviesQuery.data);
        } else {
            // Hvis det er pagination, tilføj til listen
            movieStore.addMovies(moviesQuery.data);
        }

        // Update pagination info (antag at API returnerer disse)
        // NOTE: Du skal muligvis justere dette baseret på dit API response
        movieStore.setCurrentPage(movieQueryStore.movieQuery.page || 1);
        movieStore.setIsFetchingMore(false);
    }

    // Når movieQuery data ændres, opdater selectedMovie
    if (movieQuery.data && movieQuery.data !== movieStore.selectedMovie) {
        movieStore.setSelectedMovie(movieQuery.data);
    }

    return {
        // State fra stores
        movieQuery: movieQueryStore.movieQuery,
        movies: movieStore.movies,
        selectedMovie: movieStore.selectedMovie,

        // Loading states
        isLoading,
        isFetchingMore,
        isLoadingDetails,
        error,

        // Pagination
        currentPage: movieStore.currentPage,
        totalPages: movieStore.totalPages,
        totalResults: movieStore.totalResults,
        hasMore: movieStore.currentPage < movieStore.totalPages,

        // Query actions
        setGenre: movieQueryStore.setGenre,
        setStreamingPlatform: movieQueryStore.setStreamingPlatform,
        setYear: movieQueryStore.setYear,
        setMinRating: movieQueryStore.setMinRating,
        setMinMetacritic: movieQueryStore.setMinMetacritic,
        setSortOrder: movieQueryStore.setSortOrder,
        setSearchText: movieQueryStore.setSearchText,
        setPage: movieQueryStore.setPage,
        setDirector: movieQueryStore.setDirector,
        resetQuery: movieQueryStore.reset,

        // Movie actions
        fetchMovies,
        fetchMovieDetails,
        loadMore,
        updateQueryAndFetch,

        // Store actions
        clearMovies: movieStore.clearMovies,
        clearSelectedMovie: movieStore.clearSelectedMovie,
        clearError: movieStore.clearError,

        // Query info fra React Query
        refetchMovies: moviesQuery.refetch,
        refetchMovieDetails: movieQuery.refetch,
    };
};

// Optional: Hook til at hente alle query params som URL query string
export const useMovieQueryParams = () => {
    const getQueryParams = useMovieQueryStore(state => state.getQueryParams);

    return useCallback(() => {
        const params = getQueryParams();
        return new URLSearchParams(params as Record<string, string>).toString();
    }, [getQueryParams]);
};