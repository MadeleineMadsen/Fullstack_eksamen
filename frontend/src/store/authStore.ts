import { create } from "zustand";

// Bruger-typen (frontend)
export interface User {
    id: number;
    email: string;
    name?: string;
    username?: string; // Tilføj username
    role?: string;
}

// Zustand state + actions
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;

// Auth funktioner
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; message: string }>; // Ændret return type
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    clearError: () => void;
}

// Backend base URL
const API_BASE_URL = "http://localhost:5001/api"; 

const useAuthStore = create<AuthState>((set) => ({ // Fjern 'get', brug kun 'set'
    // Initial state
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

   // ---------------------- LOGIN ----------------------

    login: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                credentials: "include",// Sender cookie med
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login fejlede");
            }

            const userData = await response.json();
            // Gem bruger i Zustand
            set({ 
                user: userData,
                isAuthenticated: true, 
                loading: false 
            });

        } catch (error: any) {
            set({
                error: error.message || "Login fejlede",
                loading: false,
                isAuthenticated: false,
                user: null
            });
            throw error;// Sender fejl tilbage til LoginPage
        }
    },

     // ---------------------- SIGNUP ----------------------
    signup: async (email: string, password: string, name?: string) => {
        set({ loading: true, error: null });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ 
                    email, 
                    password, 
                    username: name || email.split('@')[0] 
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Signup fejlede");
            }

             // Koden logger IKKE automatisk brugeren ind
            set({ loading: false });
            
            return { 
                success: true, 
                message: "Bruger oprettet! Log venligst ind." 
            };

        } catch (error: any) {
            const errorMsg = error.message || "Signup fejlede";
            set({
                error: errorMsg,
                loading: false
            });
            
            return { 
                success: false, 
                message: errorMsg 
            };
        }
    },

    // ---------------------- LOGOUT ----------------------
    logout: async () => {
        set({ loading: true });

        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            }).catch(() => {}); // Ignorer fejl hvis endpoint ikke findes

            // Ryd frontend state
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

    // ---------------------- FETCH ME ----------------------
    fetchMe: async () => {
        set({ loading: true });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const userData = await response.json();
                set({ 
                    user: userData, 
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

        } catch (error: any) {
            set({
                error: error.message || "Kunne ikke hente brugerdata",
                loading: false,
                isAuthenticated: false,
                user: null
            });
        }
    },

     // ---------------------- CLEAR ERROR ----------------------
    clearError: () => set({ error: null }),
}));

export default useAuthStore;