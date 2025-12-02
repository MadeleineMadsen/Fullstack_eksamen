import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type Movie from '../entities/Movie';

interface FavoriteStore {
    favorites: Movie[];
    favoriteIds: Set<number>;

    // Actions
    addFavorite: (movie: Movie) => void;
    removeFavorite: (movieId: number) => void;
    toggleFavorite: (movie: Movie) => void;
    isFavorite: (movieId: number) => boolean;
    clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
    persist(
        (set, get) => ({
            favorites: [],
            favoriteIds: new Set<number>([]),

            addFavorite: (movie) =>
                set((state) => {
                    // Tjek om filmen allerede er i favoritter
                    if (state.favoriteIds.has(movie.id)) {
                        return state;
                    }

                    return {
                        favorites: [...state.favorites, movie],
                        favoriteIds: new Set([...state.favoriteIds, movie.id]),
                    };
                }),

            removeFavorite: (movieId) =>
                set((state) => ({
                    favorites: state.favorites.filter(m => m.id !== movieId),
                    favoriteIds: new Set([...state.favoriteIds].filter(id => id !== movieId)),
                })),

            toggleFavorite: (movie) => {
                const state = get();

                if (state.favoriteIds.has(movie.id)) {
                    state.removeFavorite(movie.id);
                } else {
                    state.addFavorite(movie);
                }
            },

            isFavorite: (movieId) => get().favoriteIds.has(movieId),

            clearFavorites: () =>
                set({
                    favorites: [],
                    favoriteIds: new Set<number>([]),
                }),
        }),
        {
            name: 'movie-favorites-storage',
            // Håndter Set til/fra JSON konvertering
            serialize: (state) => JSON.stringify({
                ...state,
                state: {
                    ...state.state,
                    favoriteIds: Array.from(state.state.favoriteIds || []),
                },
            }),
            deserialize: (str) => {
                const parsed = JSON.parse(str);
                return {
                    ...parsed,
                    state: {
                        ...parsed.state,
                        favoriteIds: new Set(parsed.state.favoriteIds || []),
                    },
                };
            },
        }
    )
);

// Hook der kombinerer favorites med movie query
export const useFavorites = () => {
    const favoriteStore = useFavoriteStore();

    return {
        // State
        favorites: favoriteStore.favorites,

        // Actions
        addFavorite: favoriteStore.addFavorite,
        removeFavorite: favoriteStore.removeFavorite,
        toggleFavorite: favoriteStore.toggleFavorite,
        isFavorite: favoriteStore.isFavorite,
        clearFavorites: favoriteStore.clearFavorites,

        // Computed values
        favoriteCount: favoriteStore.favorites.length,
        hasFavorites: favoriteStore.favorites.length > 0,
    };
};