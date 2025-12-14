import { create } from "zustand";
import type Movie from "../entities/Movie";

// Global store for film-data og UI-state
interface MovieStoreState {
    // Movies data
    movies: Movie[];
    selectedMovie: Movie | null;

    // Pagination
    currentPage: number;
    totalPages: number;
    totalResults: number;
    pageSize: number;

    // Loading states
    isLoading: boolean;
    isFetchingMore: boolean;
    isLoadingDetails: boolean;

    // Error handling
    error: string | null;

    // Actions
    setMovies: (movies: Movie[]) => void;
    addMovies: (movies: Movie[]) => void; // For pagination
    setSelectedMovie: (movie: Movie | null) => void;

    setCurrentPage: (page: number) => void;
    setTotalPages: (pages: number) => void;
    setTotalResults: (results: number) => void;
    setPageSize: (size: number) => void;

    setIsLoading: (loading: boolean) => void;
    setIsFetchingMore: (fetching: boolean) => void;
    setIsLoadingDetails: (loading: boolean) => void;

    setError: (error: string | null) => void;

    clearMovies: () => void;
    clearSelectedMovie: () => void;
    clearError: () => void;
    reset: () => void;
}

// Zustand store
const useMovieStore = create<MovieStoreState>((set) => ({
    // Initial state
    movies: [],
    selectedMovie: null,

    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    pageSize: 20,

    isLoading: false,
    isFetchingMore: false,
    isLoadingDetails: false,

    error: null,

    // Actions
    setMovies: (movies) =>
        set({
            movies,
            error: null,
            isFetchingMore: false
        }),

    addMovies: (movies) =>
        set((state) => ({
            movies: [...state.movies, ...movies],
            error: null,
            isFetchingMore: false
        })),

    setSelectedMovie: (movie) =>
        set({
            selectedMovie: movie,
            error: null
        }),

    setCurrentPage: (currentPage) =>
        set({ currentPage }),

    setTotalPages: (totalPages) =>
        set({ totalPages }),

    setTotalResults: (totalResults) =>
        set({ totalResults }),

    setPageSize: (pageSize) =>
        set({ pageSize }),

    setIsLoading: (isLoading) =>
        set({ isLoading }),

    setIsFetchingMore: (isFetchingMore) =>
        set({ isFetchingMore }),

    setIsLoadingDetails: (isLoadingDetails) =>
        set({ isLoadingDetails }),

    setError: (error) =>
        set({ error }),

    clearMovies: () =>
        set({
            movies: [],
            currentPage: 1,
            totalPages: 0,
            totalResults: 0
        }),

    clearSelectedMovie: () =>
        set({
            selectedMovie: null
        }),

    clearError: () =>
        set({ error: null }),

    // Fuld reset (bruges fx ved logout)
    reset: () =>
        set({
            movies: [],
            selectedMovie: null,
            currentPage: 1,
            totalPages: 0,
            totalResults: 0,
            pageSize: 20,
            isLoading: false,
            isFetchingMore: false,
            isLoadingDetails: false,
            error: null,
        }),
}));

export default useMovieStore;