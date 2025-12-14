import { create } from "zustand";

// User-interface (frontend-version)
// Matcher typisk backend-brugeren, men kun felter der bruges i frontend
export interface User {
    id: number;
    email: string;
    name?: string;
    username?: string; // Tilføj username
    role?: string;
}

// AuthState:
// Definerer både state (data) og actions (funktioner)
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;       // Global loading-state for auth
    error: string | null;

// Auth funktioner
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; message: string }>; // Ændret return type
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    clearError: () => void;
}

// Backend base URL
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Zustand store
// create() opretter global state som kan bruges i hele appen
const useAuthStore = create<AuthState>((set) => ({ // Fjern 'get', brug kun 'set'
    // Initial state
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

   // ---------------------- LOGIN ----------------------

    login: async (email: string, password: string) => {

        // Sætter loading og rydder tidligere fejl
        set({ loading: true, error: null });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                credentials: "include",     // Sender cookies (session/JWT-cookie)
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            // Hvis login fejler
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login fejlede");
            }

            // Backend returnerer brugerdata
            const userData = await response.json();
            // Gem bruger i Zustand
            set({ 
                user: userData,
                isAuthenticated: true, 
                loading: false 
            });

            
        } catch (error: any) {

            // Gem bruger i Zustand state
            set({
                error: error.message || "Login fejlede",
                loading: false,
                isAuthenticated: false,
                user: null
            });
            throw error;    // Sender fejlen videre til LoginPage
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

                    // Hvis navn ikke findes → brug del af email som username
                    username: name || email.split('@')[0] 
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Signup fejlede");
            }

            // Signup logger IKKE automatisk brugeren ind
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
            // Kalder backend logout (hvis endpoint findes)
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            }).catch(() => {}); // Ignorer fejl hvis endpoint ikke findes

            // Rydder auth-state i frontend
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

            // Henter nuværende bruger baseret på cookie/session
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const userData = await response.json();
                
                // Bruger er authenticated
                set({ 
                    user: userData, 
                    isAuthenticated: true, 
                    loading: false 
                });
            } else {

                // Bruger er kke logget ind
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

    // Bruges fx når en fejl-luk-knap trykkes
    clearError: () => set({ error: null }),
}));

// Eksporter Zustand hook
// Bruges fx: const { user, login } = useAuthStore();
export default useAuthStore;