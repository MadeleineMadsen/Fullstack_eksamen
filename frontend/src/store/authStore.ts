import { create } from "zustand";

// Types
export interface User {
    id: number;
    email: string;
    name?: string;
    // Tilføj flere felter baseret på dit backend response
}

interface AuthState {
    // State som beskrevet i opgaven
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;

    // Actions som beskrevet i opgaven
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    clearError: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    // Login action med fetch som beskrevet i opgaven
    login: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
            // ========== MOCK VERSION (midlertidig) ==========
            console.log("Login attempt with:", { email, password });

            // Simuler API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simuler validering
            if (!email || !password) {
                throw new Error("Email og password er påkrævet");
            }

            if (password.length < 6) {
                throw new Error("Password skal være mindst 6 tegn");
            }

            // Mock succes response
            const mockUser: User = {
                id: 1,
                email: email,
                name: email.split('@')[0],
            };

            set({
                user: mockUser,
                isAuthenticated: true,
                loading: false
            });

            // Gem mock token i localStorage til fetchMe
            localStorage.setItem("mock_auth_token", "valid_token");
            // ==============================================

            // ========== REAL FETCH VERSION ==========
            /*
            const response = await fetch("http://localhost:3000/auth/login", {
              method: "POST",
              credentials: "include", // Som beskrevet i opgaven
              body: JSON.stringify({ email, password }),
              headers: { 
                "Content-Type": "application/json",
                // Tilføj CSRF token hvis nødvendigt
                // "X-CSRF-Token": getCsrfToken(),
              },
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Login fejlede");
            }
            
            const userData = await response.json();
            
            set({ 
              user: userData.user, 
              isAuthenticated: true, 
              loading: false 
            });
            */
            // ========================================

        } catch (error: any) {
            set({
                error: error.message || "Login fejlede",
                loading: false,
                isAuthenticated: false,
                user: null
            });
        }
    },

    // Register action
    register: async (email: string, password: string, name?: string) => {
        set({ loading: true, error: null });

        try {
            // ========== MOCK VERSION ==========
            console.log("Register attempt with:", { email, password, name });

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Validering
            if (!email || !password) {
                throw new Error("Email og password er påkrævet");
            }

            if (password.length < 6) {
                throw new Error("Password skal være mindst 6 tegn");
            }

            if (!email.includes("@")) {
                throw new Error("Ugyldig email format");
            }

            const mockUser: User = {
                id: Date.now(),
                email,
                name: name || email.split("@")[0],
            };

            set({
                user: mockUser,
                isAuthenticated: true,
                loading: false
            });

            localStorage.setItem("mock_auth_token", "valid_token");
            // =================================

            // ========== REAL FETCH VERSION ==========
            /*
            const response = await fetch("http://localhost:3000/auth/register", {
              method: "POST",
              credentials: "include",
              body: JSON.stringify({ email, password, name }),
              headers: { "Content-Type": "application/json" },
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Registrering fejlede");
            }
            
            const userData = await response.json();
            
            set({ 
              user: userData.user, 
              isAuthenticated: true, 
              loading: false 
            });
            */
            // ========================================

        } catch (error: any) {
            set({
                error: error.message || "Registrering fejlede",
                loading: false,
                isAuthenticated: false,
                user: null
            });
        }
    },

    // Logout action
    logout: async () => {
        set({ loading: true });

        try {
            // ========== MOCK VERSION ==========
            await new Promise(resolve => setTimeout(resolve, 500));

            localStorage.removeItem("mock_auth_token");
            // =================================

            // ========== REAL FETCH VERSION ==========
            /*
            await fetch("http://localhost:3000/auth/logout", {
              method: "POST",
              credentials: "include",
            });
            */
            // ========================================

            set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null
            });

        } catch (error: any) {
            set({
                error: error.message || "Logout fejlede",
                loading: false
            });
        }
    },

    // Fetch current user (fetchMe) - tjekker om bruger er logget ind
    fetchMe: async () => {
        // Skip hvis allerede authenticated
        if (get().isAuthenticated) return;

        set({ loading: true });

        try {
            // ========== MOCK VERSION ==========
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockToken = localStorage.getItem("mock_auth_token");

            if (mockToken === "valid_token") {
                const mockUser: User = {
                    id: 1,
                    email: "test@example.com",
                    name: "Test Bruger",
                };

                set({
                    user: mockUser,
                    isAuthenticated: true,
                    loading: false
                });
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    loading: false
                });
            }
            // =================================

            // ========== REAL FETCH VERSION ==========
            /*
            const response = await fetch("http://localhost:3000/auth/me", {
              method: "GET",
              credentials: "include",
            });
            
            if (response.ok) {
              const userData = await response.json();
              set({ 
                user: userData.user, 
                isAuthenticated: true, 
                loading: false 
              });
            } else {
              // Ikke authenticated
              set({ 
                user: null, 
                isAuthenticated: false, 
                loading: false 
              });
            }
            */
            // ========================================

        } catch (error: any) {
            set({
                error: error.message || "Kunne ikke hente brugerdata",
                loading: false,
                isAuthenticated: false,
                user: null
            });
        }
    },

    // Clear error action
    clearError: () => set({ error: null }),
}));

export default useAuthStore;