// Custom hook til at gøre autentifikations-state og actions nemme at bruge i React-komponenter.
// Hooket fungerer som et "lag" ovenpå Zustand-authStore og giver et samlet API
// til login, logout, hent nuværende bruger osv.

import useAuthStore from '../store/authStore';

// Henter state og actions direkte fra Zustand-storen
export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        signup,
        logout,
        fetchMe,
        clearError
    } = useAuthStore();

    return {
        // State
        user,
        isAuthenticated,
        loading,
        error,

        // Actions
        login,
        signup,
        logout,
        fetchMe,
        clearError,

        // ---------- DERIVED / CONVENIENCE VALUES ----------
        // Bruges når komponenter bare vil vide "er der en bruger?"
        isLoggedIn: isAuthenticated && !!user,

        // Brugervenligt fallback-navn hvis brugeren ikke har username
        userName: user?.name || user?.email?.split('@')[0] || 'Gæst',

         // Admin-check som bruges bl.a. i NavBar og AdminRoute
        isAdmin: user?.role === "admin",
    };
};