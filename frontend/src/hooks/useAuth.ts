// useAuth.ts
import useAuthStore from '../store/authStore';

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

        // Convenience getters
        isLoggedIn: isAuthenticated && !!user,
        userName: user?.name || user?.email?.split('@')[0] || 'Gæst',

        isAdmin: user?.role === "admin",
    };
};