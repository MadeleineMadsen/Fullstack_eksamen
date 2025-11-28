import fetch from 'node-fetch';
import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function seedMovies() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Hent 20 populære film
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=da-DK&page=1`
        );
        const data = await response.json();
        const movies = data.results.slice(0, 20);

        for (const movie of movies) {
            await client.query(
                `INSERT INTO Movie (id, title, overview, released, rating, background_image) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 ON CONFLICT (id) DO UPDATE SET 
                   title = EXCLUDED.title,
                   overview = EXCLUDED.overview,
                   released = EXCLUDED.released,
                   rating = EXCLUDED.rating,
                   background_image = EXCLUDED.background_image`,
                [
                    movie.id,
                    movie.title,
                    movie.overview,
                    movie.release_date,
                    movie.vote_average,
                    movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null
                ]
            );
            console.log(`Added: ${movie.title}`);
        }

        console.log(`✅ Added ${movies.length} popular movies!`);
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await client.end();
    }
}

seedMovies();