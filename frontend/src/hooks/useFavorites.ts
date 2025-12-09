import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type Movie from '../entities/Movie';

// Zustand-store interface for favoritfilm.
// favorites    → selve film-objekterne
// favoriteIds  → Set med IDs for hurtig lookup (O(1) for has)
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

// Zustand-store med persist-middleware, så favorites gemmes i localStorage
export const useFavoriteStore = create<FavoriteStore>()(
    persist(
        (set, get) => ({
            // Start med tom liste og tomt Set
            favorites: [],
            favoriteIds: new Set<number>([]),

            // Tilføj en film til favoritter
            addFavorite: (movie) =>
                set((state) => {
                    // Tjek om filmen allerede er i favoritter
                    if (state.favoriteIds.has(movie.id)) {
                        return state;
                    }

                    return {
                        favorites: [...state.favorites, movie],
                         // Tilføj id til Set (kopieret for at undgå mutation)
                        favoriteIds: new Set([...state.favoriteIds, movie.id]),
                    };
                }),

            // Fjern en film fra favoritter ud fra id
            removeFavorite: (movieId) =>
                // Filtrer den ud af favorites-listen
                set((state) => ({
                    favorites: state.favorites.filter(m => m.id !== movieId),
                    // Og fjern id'et fra Set
                    favoriteIds: new Set([...state.favoriteIds].filter(id => id !== movieId)),
                })),

            // Toggle: hvis filmen er favorit → fjern den, ellers tilføj den 
            toggleFavorite: (movie) => {
                const state = get();

                if (state.favoriteIds.has(movie.id)) {
                    state.removeFavorite(movie.id);
                } else {
                    state.addFavorite(movie);
                }
            },
             // Hjælpefunktion til at tjekke om en film er favorit
            isFavorite: (movieId) => get().favoriteIds.has(movieId),

            clearFavorites: () =>
                set({
                    favorites: [],
                    favoriteIds: new Set<number>([]),
                }),
        }),
        {
            name: 'movie-favorites-storage',
            // Special serialize: laver favoriteIds (Set) om til Array, 
            // da JSON ikke understøtter Set direkte
            serialize: (state) => JSON.stringify({
                ...state,
                state: {
                    ...state.state,
                    favoriteIds: Array.from(state.state.favoriteIds || []),
                },
            }),
            // Special deserialize: laver favoriteIds tilbage til Set igen,
            // når vi læser fra localStorage.
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

// Convenience-hook der giver et nemmere API til favoritter.
// I stedet for at kalde useFavoriteStore direkte i alle komponenter,
// bruger vi dette hook, som også beregner antal favoritter osv.
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