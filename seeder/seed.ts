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

async function seedDatabase() {
    // Database connection - henter fra environment
    const client = new Client({
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'movie_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
    });

    const TMDB_API_KEY = process.env.TMDB_API_KEY || '';

    try {
        // 1. Connect to database
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected to database');

        // ================ 3. SEED MOVIES ================
        if (TMDB_API_KEY && TMDB_API_KEY !== '') {
            console.log('\n🎬 Seeding movies from TMDB...');
            
            try {
                // Opret movies tabel hvis den ikke eksisterer
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
                
                // Hent film fra TMDB
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=da-DK&page=1`
                );
                
                if (response.ok) {
                    const data = await response.json() as any;
                    const movies: TMDBMovie[] = data.results.slice(0, 10);
                    
                    console.log(`📥 Found ${movies.length} movies from TMDB`);
                    
                    let addedCount = 0;
                    for (const movie of movies) {
                        try {
                            await client.query(
                                `INSERT INTO movies (id, title, overview, released, rating, background_image, poster_image, plot)
                                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                                 ON CONFLICT (id) DO NOTHING`,
                                [
                                    movie.id,
                                    movie.title,
                                    movie.overview || '',
                                    movie.release_date || null,
                                    movie.vote_average || 0,
                                    movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
                                    movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                                    movie.overview || ''
                                ]
                            );
                            addedCount++;
                            console.log(`   ✅ ${movie.title}`);
                        } catch (error) {
                            // Ignore duplicates
                        }
                    }
                    console.log(`🎉 Added ${addedCount} movies`);
                }
            } catch (error) {
                console.log('⚠️ Could not seed movies:', error instanceof Error ? error.message : 'Unknown error');
            }
        } else {
            console.log('\n⚠️ TMDB_API_KEY not set - skipping movie seeding');
        }

        // ================ 4. SUMMARY ================
        console.log('\n========================================');
        console.log('🎉 SEEDING COMPLETE!');
        console.log('========================================');
        console.log('\n📊 Database ready with:');
        console.log('   ✅ Movies table (if TMDB key was set)');
        
        console.log('========================================\n');

    } catch (error) {
        console.error('💥 Seeding failed:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase();
}

// Export for other use
export { seedDatabase };
