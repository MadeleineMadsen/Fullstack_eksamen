-- movie-seed.sql
-- Kun tabeldefinitioner - ingen test data!

-- ======================
-- MAIN TABLES
-- ======================

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    released VARCHAR(50),
    runtime INT,
    rating FLOAT CHECK (rating >= 0 AND rating <= 10),
    background_image VARCHAR(500),
    metacritic INT CHECK (metacritic >= 0 AND metacritic <= 100),
    poster_image VARCHAR(500),
    plot TEXT,
    director VARCHAR(255),
    tmdb_id INTEGER UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS streaming_platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    url VARCHAR(500),
    logo_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS actors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_image VARCHAR(500),
    tmdb_id INTEGER UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);


-- ======================
-- RELATION TABLES
-- ======================

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    genre_id INT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE IF NOT EXISTS movie_streaming (
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    platform_id INT NOT NULL REFERENCES streaming_platforms(id) ON DELETE CASCADE,
    country_code VARCHAR(10) DEFAULT 'DK',
    PRIMARY KEY (movie_id, platform_id, country_code)
);

CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    actor_id INT NOT NULL REFERENCES actors(id) ON DELETE CASCADE,
    character_name VARCHAR(255),
    PRIMARY KEY (movie_id, actor_id)
);

CREATE TABLE IF NOT EXISTS user_watchlist (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(user_id, movie_id)
);

CREATE TABLE IF NOT EXISTS user_reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, movie_id)
);


-- ======================
-- INDEXES for Performance
-- ======================

-- Movies indexes
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_released ON movies(released DESC);
CREATE INDEX IF NOT EXISTS idx_movies_tmdb_id ON movies(tmdb_id);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Relation indexes
CREATE INDEX IF NOT EXISTS idx_movie_genres_movie ON movie_genres(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_genres_genre ON movie_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_user ON user_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_movie ON user_watchlist(movie_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_user_movie ON user_reviews(user_id, movie_id);

-- ======================
-- TRIGGER for auto-update
-- ======================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_movies_timestamp 
    BEFORE UPDATE ON movies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_timestamp 
    BEFORE UPDATE ON user_reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


-- ======================
-- INSERT ADMIN AND SOME USERS
-- ======================

INSERT INTO users (email, username, password_hash, role) 
VALUES 
    ('a@a.com', 'Admin', '$2y$10$bQKa9EDURrR..UVjnedvWeelXnWx929OMSdNcCtWLeIbX46QOacWe', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Indsæt test-brugere
INSERT INTO users (email, username, password_hash, role) 
VALUES 
    ('k@k.com', 'Kamilla', '$2y$10$97tEDh51oTSScOhzCvxgqutHyEprxrzkIJ0vqQDQXyH7Qio.egQ9S', 'user'),
    ('m@m.com', 'Madeleine', '$2y$10$aKoEvrv1yomXr0jFBbJMSuZ7rGuAtnVFl/PoicDKGbrpgacq/ZTOq', 'user'),
    ('n@n.com', 'Naomi', '$2y$10$UbAuEOZCCvVIRinEhO1.FeETyWRjBA9J5.tOOXO2e5lkzuayKEYGG', 'user')
ON CONFLICT (email) DO NOTHING;



-- ======================
-- DATABASE PRIVILEGES
-- ======================

-- -- Create application user (for backend connection)
-- DO $$
-- BEGIN
--     -- Only create if doesn't exist
--     IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'movie_app') THEN
--         CREATE USER movie_app WITH PASSWORD 'password_priv';
--         RAISE NOTICE 'Application user created: movie_app';
--     END IF;
-- END $$;

-- -- Grant privileges to application user
-- GRANT CONNECT ON DATABASE movie_db TO movie_app;
-- GRANT USAGE ON SCHEMA public TO movie_app;

-- -- Grant table privileges
-- GRANT SELECT, INSERT, UPDATE, DELETE ON 
--     movies,
--     genres,
--     streaming_platforms,
--     actors,
--     users,
--     movie_genres,
--     movie_streaming,
--     movie_actors,
--     user_watchlist,
--     user_reviews
-- TO movie_app;

-- -- Grant sequence privileges (for SERIAL columns)
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO movie_app;

-- -- Grant execute privilege on functions
-- GRANT EXECUTE ON FUNCTION update_updated_at_column() TO movie_app;


-- -- ======================
-- -- CREATE PRIVILEGE (for TypeORM synchronize)
-- -- ======================
-- -- Only grant this if TypeORM needs to create/drop tables
-- GRANT CREATE ON SCHEMA public TO movie_app;


-- -- ======================
-- -- SECURITY NOTES
-- -- ======================

-- COMMENT ON DATABASE movie_db IS 'Movie database - application connects as movie_app user';
-- COMMENT ON ROLE movie_app IS 'Application user with CREATE privilege for TypeORM synchronize';