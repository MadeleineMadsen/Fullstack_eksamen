// seed.ts - Fixed version
import fetch from 'node-fetch';
import { Client } from 'pg';

// Interface for TMDB data
interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    backdrop_path: string | null;
    poster_path: string | null;
}

async function seedMovies() {
    // Use environment variables from docker-compose.yml
    const client = new Client({
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'movie_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
    });

    const TMDB_API_KEY = process.env.TMDB_API_KEY;

    try {
        // 1. Connect to database
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected to database');

        // 2. Create movies table if it doesn't exist
        console.log('📊 Checking movies table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS movies (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                overview TEXT,
                released VARCHAR(50),
                runtime INT,
                rating FLOAT,
                background_image VARCHAR(500),
                metacritic INT,
                poster_image VARCHAR(255),
                plot TEXT,
                director VARCHAR(255)
            )
        `);
        console.log('✅ Movies table is ready');

        // 3. Check TMDB API key
        if (!TMDB_API_KEY || TMDB_API_KEY === '') {
            console.error('❌ TMDB_API_KEY is not set');
            process.exit(1);
        }

        // 4. Fetch movies from TMDB API
        console.log('🎬 Fetching movies from TMDB API...');
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=da-DK&page=1`
        );

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json() as any;
        const movies: TMDBMovie[] = data.results.slice(0, 10); // First 10 movies
        
        console.log(`📥 Found ${movies.length} movies`);

        // 5. Insert movies into database
        let insertedCount = 0;
        
        for (const movie of movies) {
            try {
                await client.query(
                    `INSERT INTO movies (title, overview, released, rating, background_image, poster_image, plot)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        movie.title,
                        movie.overview || '',
                        movie.release_date || null,
                        movie.vote_average || 0,
                        movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
                        movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                        movie.overview || ''
                    ]
                );
                console.log(`✅ Added: ${movie.title}`);
                insertedCount++;
            } catch (error: any) {
                console.log(`⚠️ Could not add ${movie.title}: ${error.message}`);
            }
        }

        console.log(`🎉 Seeding complete! ${insertedCount}/${movies.length} movies added`);

    } catch (error: any) {
        console.error('💥 Seeding error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

// Run the seeder
seedMovies();