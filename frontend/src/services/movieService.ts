// Import af entity-typer (bruges til typning af API-respons)
import Movie from '../entities/Movie';
import Genre from '../entities/Genre';
import StreamingPlatform from '../entities/StreamingPlatform';
import Trailer from '../entities/Trailer';

// MovieFilters: interface der definerer hvilke filtre
// der kan sendes med til backend som query parameters
export interface MovieFilters {
    genre?: number;
    minRating?: number;
    year?: number;
    search?: string;
    platform?: number;
}

// Service-klasse der samler alle API-kald relateret til film
class MovieService {
     // Base URL til backend
    private baseUrl = '/api';

    // GET alle film med filtre
    async getAllMovies(filters?: MovieFilters): Promise<Movie[]> {
        try {

            // URLSearchParams bruges til at opbygge query string
            const queryParams = new URLSearchParams();
            
            // Tilføj kun filtre hvis de er angivet
            if (filters?.genre) queryParams.append('genre', filters.genre.toString());
            if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
            if (filters?.year) queryParams.append('year', filters.year.toString());
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.platform) queryParams.append('platform', filters.platform.toString());

            // Fetch alle film med query parameters
            const response = await fetch(`${this.baseUrl}/movies?${queryParams}`);
            
            // Tjek om HTTP-responsen er OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Returner film som JSON (typed som Movie[])
            return await response.json();
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    }

     // Hent én film baseret på ID
    async getMovieById(id: number): Promise<Movie> {
        try {
            const response = await fetch(`${this.baseUrl}/movies/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Returnerer én Movie
            return await response.json();
        } catch (error) {
            console.error(`Error fetching movie ${id}:`, error);
            throw error;
        }
    }

    // henter alle genres
    async getGenres(): Promise<Genre[]> {
        try {
            const response = await fetch(`${this.baseUrl}/genres`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Returnerer liste af Genre
            return await response.json();
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    }

    // henter alle streaming platforms
    async getStreamingPlatforms(): Promise<StreamingPlatform[]> {
        try {
            const response = await fetch(`${this.baseUrl}/streaming-platforms`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Returnerer liste af StreamingPlatform
            return await response.json();
        } catch (error) {
            console.error('Error fetching streaming platforms:', error);
            throw error;
        }
    }

    // henter trailers for en film
    async getTrailers(movieId: number): Promise<Trailer[]> {
        try {
            const response = await fetch(`${this.baseUrl}/movies/${movieId}/trailers`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Returnerer liste af Trailer
            return await response.json();
        } catch (error) {
            console.error(`Error fetching trailers for movie ${movieId}:`, error);
            throw error;
        }
    }
}

// Eksporterer én instans (Singleton-pattern)
// så samme service bruges overalt i appen
export const movieService = new MovieService();