import User from '../entities/User';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

class UserService {
    private baseUrl = '/api';

    // Login
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

    // Register
    async register(registerData: RegisterData): Promise<{ user: User; token: string }> {
        const response = await fetch(`${this.baseUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        });
        
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    }

    // Get current user
    async getCurrentUser(token: string): Promise<User> {
        const response = await fetch(`${this.baseUrl}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) throw new Error('Failed to get user data');
        return response.json();
    }

    // Logout (client-side)
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Save token to localStorage
    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    // Get token from localStorage
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Save user to localStorage
    saveUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Get user from localStorage
    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

export const userService = new UserService();