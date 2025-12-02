import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        fetchMe,
        clearError
    } = useAuthStore();

    // Fetch bruger ved komponent mount (hvis nødvendigt)
    useEffect(() => {
        // Kun fetch hvis ikke allerede loading og ikke authenticated
        if (!loading && !isAuthenticated) {
            fetchMe();
        }
    }, [fetchMe, loading, isAuthenticated]);

    return {
        // State
        user,
        isAuthenticated,
        loading,
        error,

        // Actions
        login,
        register,
        logout,
        fetchMe,
        clearError,

        // Convenience getters
        isLoggedIn: isAuthenticated && !!user,
        userName: user?.name || user?.email?.split('@')[0] || 'Gæst',
    };
};