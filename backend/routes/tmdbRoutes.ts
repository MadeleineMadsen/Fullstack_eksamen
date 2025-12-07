import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Endpoint for at søge/hente film (bruges af HomePage)
router.get('/movies', async (req, res) => {
    try {
        const { query, sort_by, with_genres } = req.query;
        const apiKey = process.env.TMDB_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'TMDB API key not configured' });
        }
        
        let tmdbUrl = 'https://api.themoviedb.org/3/';
        
        if (query) {
            tmdbUrl += `search/movie?query=${query}`;
        } else {
            tmdbUrl += 'discover/movie?';
            if (sort_by) {
                const sortMap: Record<string, string> = {
                    'rating': 'vote_average.desc',
                    'released': 'primary_release_date.desc',
                    'title': 'original_title.asc'
                };
                tmdbUrl += `&sort_by=${sortMap[sort_by as string] || 'popularity.desc'}`;
            }
            if (with_genres) {
                tmdbUrl += `&with_genres=${with_genres}`;
            }
        }
        
        tmdbUrl += `&api_key=${apiKey}&language=en-US`;
        
        console.log('Fetching from TMDB:', tmdbUrl);
        const response = await fetch(tmdbUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('TMDB fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch movies from TMDB' });
    }
});

// Endpoint for filmdetaljer (bruges af MovieDetailPage)
router.get('/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const apiKey = process.env.TMDB_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'TMDB API key not configured' });
        }
        
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