import { create } from "zustand";
import type Genre from "../entities/Genre";
import type StreamingPlatform from "../entities/StreamingPlatform";

// Et MovieQuery-objekt repræsenterer ALLE filtre brugeren kan vælge
export interface MovieQuery {
    genre?: Genre;
    streamingPlatform?: StreamingPlatform;
    year?: number;
    minRating?: number;
    minMetacritic?: number;
    sortOrder?: string;
    searchText?: string;
    page?: number;
    director?: string;
    actor?: string;
}

interface MovieQueryStore {
    movieQuery: MovieQuery;  // Alle aktuelle filtre
    setGenre: (genre?: Genre) => void;
    setStreamingPlatform: (platform?: StreamingPlatform) => void;
    setYear: (year?: number) => void;
    setMinRating: (minRating?: number) => void;
    setMinMetacritic: (minMetacritic?: number) => void;
    setSortOrder: (sortOrder?: string) => void;
    setSearchText: (searchText?: string) => void;
    setPage: (page: number) => void;
    setDirector: (director?: string) => void;
    setActor: (actor?: string) => void;
    reset: () => void;
    getQueryParams: () => Record<string, any>;// Konverterer filters → URL params
}

const useMovieQueryStore = create<MovieQueryStore>((set, get) => ({
    // Standard query (starter på side 1)
    movieQuery: {
        page: 1,
    },
     // Opdater genre + reset pagination
    setGenre: (genre) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, genre, page: 1 },
        })),
    // Opdater streaming platform + reset pagination
    setStreamingPlatform: (streamingPlatform) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, streamingPlatform, page: 1 },
        })),
    // Opdater år
    setYear: (year) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, year, page: 1 },
        })),
        
    // Minimum rating filter    
    setMinRating: (minRating) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, minRating, page: 1 },
        })),
    // Minimum rating filter    
    setMinMetacritic: (minMetacritic) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, minMetacritic, page: 1 },
        })),
    // Sortering
    setSortOrder: (sortOrder) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, sortOrder, page: 1 },
        })),
    // Søgetekst → nulstil alle andre filtre    
    setSearchText: (searchText) =>
        set(() => ({
            movieQuery: {
                searchText,
                page: 1,
                // Når vi søger, nulstilles alle filtre
                genre: undefined,
                streamingPlatform: undefined,
                year: undefined,
                minRating: undefined,
                minMetacritic: undefined,
                sortOrder: undefined,
                director: undefined,
                actor: undefined,
            },
        })),

    setPage: (page) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, page },
        })),

    setDirector: (director) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, director, page: 1 },
        })),

    setActor: (actor) =>
        set((state) => ({
            movieQuery: { ...state.movieQuery, actor, page: 1 },
        })),

    reset: () =>
        set(() => ({
            movieQuery: { page: 1 },
        })),

    getQueryParams: () => {
        const query = get().movieQuery;
        const params: Record<string, any> = {};

        // Tilføj pagination
        if (query.page) params.page = query.page;

        // Tilføj søgetekst (hvis den findes)
        if (query.searchText) {
            params.search = query.searchText;
        } else {
            // Tilføj filtre kun hvis vi ikke søger
            if (query.genre?.id) params.genreId = query.genre.id;
            if (query.streamingPlatform?.id) params.platformId = query.streamingPlatform.id;
            if (query.year) params.year = query.year;
            if (query.minRating) params.minRating = query.minRating;
            if (query.minMetacritic) params.minMetacritic = query.minMetacritic;
            if (query.director) params.director = query.director;
            if (query.actor) params.actor = query.actor;
        }

        // Tilføj sortering
        if (query.sortOrder) params.sort = query.sortOrder;

        return params;
    },
}));

export default useMovieQueryStore;