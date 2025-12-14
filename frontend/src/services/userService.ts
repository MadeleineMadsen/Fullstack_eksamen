import User from '../entities/User';

// Data til login
export interface LoginData {
    email: string;
    password: string;
}

// Data til signup
export interface SignupData {
    username: string;
    email: string;
    password: string;
}

// UserService samler al auth-relateret kommunikation med backend
class UserService {
    private baseUrl = '/api'; // Base URL for backend auth-routes

    // Login → sender email + password til backend → Returnerer bruger + JWT token
    async login(loginData: LoginData): Promise<{ user: User; token: string }> {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',     // HTTP POST request
            headers: {
                'Content-Type': 'application/json',     // Sender JSON
            },
            body: JSON.stringify(loginData),    // Konverter data til JSON
        });
        
        // Hvis login fejler (fx forkert login)
        if (!response.ok) throw new Error('Login failed');
        
        // Returnerer JSON som { user, token }
        return response.json();
    }

    // Signup → opretter ny bruge og eturnerer bruger + JWT token
    async signup(signupData: SignupData): Promise<{ user: User; token: string }> {
        const response = await fetch(`${this.baseUrl}/auth/signup`, {
            method: 'POST',     // HTTP POST request
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
        });
        
        // Fejl hvis brugeren ikke kunne oprettes
        if (!response.ok) throw new Error('Signup failed');
        return response.json();
    }

     // Henter den aktuelt loggede bruger (Kræver JWT token i Authorization-header)
    async getCurrentUser(token: string): Promise<User> {
        const response = await fetch(`${this.baseUrl}/auth/me`, {
            headers: {

                // Bearer token bruges til beskyttede routes
                'Authorization': `Bearer ${token}`,
            },
        });
        
        // Fejl hvis token er ugyldigt/udløbet
        if (!response.ok) throw new Error('Failed to get user data');
        return response.json();
    }

    // Fjern brugerdata lokalt (frontend logout)
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Gem token localStoragealt
    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    // Hent token lokalt localStorage
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Gem brugerinfo localStorage
    saveUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // // Hent brugerinfo localStorage
    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

// Eksporterer én instans af UserService
// Bruges som singleton i hele appen
export const userService = new UserService();