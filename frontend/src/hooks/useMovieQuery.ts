import { useCallback, useEffect } from 'react';
import useMovieQueryStore from '../store/movieQueryStore';
import useMovieStore from '../store/movieStore';
import { useMovie, useMovies } from './useMovies'; // Dine eksisterende hooks

export const useMovieQuery = () => {
    // --------------------------------------------------------------
    // Zustand stores
    // --------------------------------------------------------------
    const movieQueryStore = useMovieQueryStore();
    const movieStore = useMovieStore();

    // --------------------------------------------------------------
    // React Query hooks
    // --------------------------------------------------------------
    const moviesQuery = useMovies(movieQueryStore.getQueryParams());
    const movieQuery = useMovie(movieStore.selectedMovie?.id || 0);

    // --------------------------------------------------------------
    // SIDE EFFECT:
    // Når moviesQuery data ændres, opdater movieStore
    // --------------------------------------------------------------
    useEffect(() => {
        if (!moviesQuery.data) return;

        // Hvis det er første side, erstat listen
        if (movieQueryStore.movieQuery.page === 1) {
            movieStore.setMovies(moviesQuery.data);
        } else {
            // Hvis det er pagination, tilføj til listen
            movieStore.addMovies(moviesQuery.data);
        }

        // Opdater pagination info
        movieStore.setCurrentPage(movieQueryStore.movieQuery.page || 1);

        // Stop "fetch more"-loading
        movieStore.setIsFetchingMore(false);
    }, [moviesQuery.data]);

    // --------------------------------------------------------------
    // SIDE EFFECT:
    // Når movieQuery (single movie) ændres, opdater selectedMovie i store
    // --------------------------------------------------------------
    useEffect(() => {
        if (!movieQuery.data) return;

        if (movieQuery.data !== movieStore.selectedMovie) {
            movieStore.setSelectedMovie(movieQuery.data);
        }
    }, [movieQuery.data]);

    // --------------------------------------------------------------
    // Action: Fetch movies med nuværende query
    // Denne returnerer params – React Query reagerer automatisk
    // --------------------------------------------------------------
    const fetchMovies = useCallback(() => {
        const params = movieQueryStore.getQueryParams();
        return params;
    }, [movieQueryStore]);

    // --------------------------------------------------------------
    // Action: Set og fetch movie details
    // React Query vil automatisk fetche via useMovie hook
    // --------------------------------------------------------------
    const fetchMovieDetails = useCallback((movieId: number) => {
        movieStore.setSelectedMovie(
            movieStore.movies.find(m => m.id === movieId) || null
        );
    }, [movieStore]);

    // --------------------------------------------------------------
    // Action: Load more (pagination)
    // --------------------------------------------------------------
    const loadMore = useCallback(() => {
        if (movieStore.currentPage >= movieStore.totalPages) return;

        const nextPage = movieStore.currentPage + 1;
        movieQueryStore.setPage(nextPage);

        // Simuler loading state for pagination
        movieStore.setIsFetchingMore(true);

        // Næste side vil blive fetchet automatisk via useMovies når movieQuery ændrer sig
    }, [movieQueryStore, movieStore]);

    // --------------------------------------------------------------
    // Action: Update query og fetch
    // --------------------------------------------------------------
    const updateQueryAndFetch = useCallback(
        (updates: Partial<typeof movieQueryStore.movieQuery>) => {

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
        },
        [movieQueryStore, movieStore]
    );

// Loading states
    const isLoading = moviesQuery.isLoading || movieStore.isLoading;
    const isFetchingMore = movieStore.isFetchingMore;
    const isLoadingDetails = movieQuery.isLoading || movieStore.isLoadingDetails;

// Errors
    const error =
        moviesQuery.error?.message ||
        movieQuery.error?.message ||
        movieStore.error;

// Public API
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
