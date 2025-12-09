import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// ============================================================================
// GET /api/tmdb/movies
// Henter film fra TMDB (The Movie Database)
// Bruges i frontend til HomePage for søgning og listevisning
// ============================================================================

router.get('/movies', async (req, res) => {
    try {
        // Query-parametre fra frontend
        const { query, sort_by, with_genres } = req.query;
         // API-key fra .env
        const apiKey = process.env.TMDB_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'TMDB API key not configured' });
        }
         // Base URL til TMDB API
        let tmdbUrl = 'https://api.themoviedb.org/3/';
        
        // Hvis der søges på tekst, brug TMDB’s search endpoint
        if (query) {
            tmdbUrl += `search/movie?query=${query}`;
        // Ellers brug discover endpoint (filtre + sortering)           
        } else {
            tmdbUrl += 'discover/movie?';
            // Mapping mellem vores sorterings-navne og TMDB’s sorteringsformat
            if (sort_by) {
                const sortMap: Record<string, string> = {
                    'rating': 'vote_average.desc',
                    'released': 'primary_release_date.desc',
                    'title': 'original_title.asc'
                };
                tmdbUrl += `&sort_by=${sortMap[sort_by as string] || 'popularity.desc'}`;
            }
             // Filtrer efter genre
            if (with_genres) {
                tmdbUrl += `&with_genres=${with_genres}`;
            }
        }
        // Tilføj API-nøgle og sprog
        tmdbUrl += `&api_key=${apiKey}&language=en-US`;
        
        // Kald TMDB API
        console.log('Fetching from TMDB:', tmdbUrl);
        const response = await fetch(tmdbUrl);
        const data = await response.json();
        // Send data videre til frontend
        res.json(data);
    } catch (error) {
        console.error('TMDB fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch movies from TMDB' });
    }
});

// ============================================================================
// GET /api/tmdb/movies/:id
// Henter én specifik film fra TMDB baseret på id
// Bruges af MovieDetailPage
// ============================================================================

router.get('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const apiKey = process.env.TMDB_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'TMDB API key not configured' });
        }
         // URL til én film ud fra TMDB's movie/ID endpoint
        const tmdbUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
        
        console.log('Fetching movie details from TMDB:', tmdbUrl);
        const response = await fetch(tmdbUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('TMDB fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch movie details from TMDB' });
    }
});

export default router;