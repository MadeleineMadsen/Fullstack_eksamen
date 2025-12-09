// Service der håndterer alle API-kald til backend for film, genre, skuespillereimport Movie from '../entities/Movie';
import Movie from '../entities/Movie';
import Genre from '../entities/Genre';
import Actor from '../entities/Actor';
import StreamingPlatform from '../entities/StreamingPlatform';
import Trailer from '../entities/Trailer';
// Filtre der kan sendes til backend
export interface MovieFilters {
    genre?: number;
    minRating?: number;
    year?: number;
    search?: string;
    platform?: number;
}

class MovieService {
     // Base URL til backend
    private baseUrl = '/api';

    // GET alle film med filtre
    async getAllMovies(filters?: MovieFilters): Promise<Movie[]> {
        try {
            const queryParams = new URLSearchParams();
            // Tilføj kun parametre der er angivet
            if (filters?.genre) queryParams.append('genre', filters.genre.toString());
            if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString());
            if (filters?.year) queryParams.append('year', filters.year.toString());
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.platform) queryParams.append('platform', filters.platform.toString());

            const response = await fetch(`${this.baseUrl}/movies?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
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
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    }

    // henter alle skuespillere
    async getActors(): Promise<Actor[]> {
        try {
            const response = await fetch(`${this.baseUrl}/actors`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching actors:', error);
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
            
            return await response.json();
        } catch (error) {
            console.error(`Error fetching trailers for movie ${movieId}:`, error);
            throw error;
        }
    }
}

export const movieService = new MovieService();