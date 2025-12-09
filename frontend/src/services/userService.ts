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

class UserService {
    private baseUrl = '/api'; // Base URL for backend auth-routes

    // Login → sender email + password til backend
    async login(loginData: LoginData): Promise<{ user: User; token: string }> {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    }

    // Signup → opretter ny bruge
    async signup(signupData: SignupData): Promise<{ user: User; token: string }> {
        const response = await fetch(`${this.baseUrl}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
        });
        
        if (!response.ok) throw new Error('Signup failed');
        return response.json();
    }

     // Hent den nuværende bruger (bruger token)
    async getCurrentUser(token: string): Promise<User> {
        const response = await fetch(`${this.baseUrl}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
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

export const userService = new UserService();