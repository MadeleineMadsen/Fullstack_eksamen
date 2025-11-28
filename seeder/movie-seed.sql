-- PostgreSQL
-- ======================
-- TABLES
-- ======================

CREATE TABLE Movie (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    released DATE,
    runtime INT,
    rating FLOAT,
    background_image VARCHAR(500)
);

CREATE TABLE Genre (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE StreamingPlatform (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    url VARCHAR(500)
);

CREATE TABLE Actor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_image VARCHAR(500)
);

-- ======================
-- ONE-TO-MANY RELATION
-- ======================

CREATE TABLE Trailer (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    name VARCHAR(255) NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES Movie(id) ON DELETE CASCADE
);

CREATE TABLE User (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin'))
);

-- ======================
-- MANY-TO-MANY RELATIONS (Join Tables)
-- ======================

CREATE TABLE movies_has_genres (
    movies_id INT NOT NULL,
    genres_id INT NOT NULL,
    PRIMARY KEY (movies_id, genres_id),
    FOREIGN KEY (movies_id) REFERENCES Movie(id) ON DELETE CASCADE,
    FOREIGN KEY (genres_id) REFERENCES Genre(id) ON DELETE CASCADE
);

CREATE TABLE movies_has_streaming_platforms (
    movies_id INT NOT NULL,
    streaming_platforms_id INT NOT NULL,
    PRIMARY KEY (movies_id, streaming_platforms_id),
    FOREIGN KEY (movies_id) REFERENCES Movie(id) ON DELETE CASCADE,
    FOREIGN KEY (streaming_platforms_id) REFERENCES StreamingPlatform(id) ON DELETE CASCADE
);

CREATE TABLE movies_has_actors (
    movies_id INT NOT NULL,
    actors_id INT NOT NULL,
    PRIMARY KEY (movies_id, actors_id),
    FOREIGN KEY (movies_id) REFERENCES Movie(id) ON DELETE CASCADE,
    FOREIGN KEY (actors_id) REFERENCES Actor(id) ON DELETE CASCADE
);

CREATE TABLE users_favorite_movies (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movie(id) ON DELETE CASCADE
);

-- ======================
-- INDEXES for better performance
-- ======================

CREATE INDEX idx_trailer_movie_id ON Trailer(movie_id);
CREATE INDEX idx_movies_has_genres_movies ON movies_has_genres(movies_id);
CREATE INDEX idx_movies_has_genres_genres ON movies_has_genres(genres_id);
CREATE INDEX idx_movies_has_platforms_movies ON movies_has_streaming_platforms(movies_id);
CREATE INDEX idx_movies_has_platforms_platforms ON movies_has_streaming_platforms(streaming_platforms_id);
CREATE INDEX idx_movies_has_actors_movies ON movies_has_actors(movies_id);
CREATE INDEX idx_movies_has_actors_actors ON movies_has_actors(actors_id);
CREATE INDEX idx_users_favorites_user ON users_favorite_movies(user_id);
CREATE INDEX idx_users_favorites_movie ON users_favorite_movies(movie_id);
CREATE INDEX idx_movie_title ON Movie(title);
CREATE INDEX idx_actor_name ON Actor(name);
CREATE INDEX idx_user_email ON User(email);

-- ======================
-- STATIC SEEDER DATA
-- ======================

-- Insert genres (TMDB standard genres)
INSERT INTO Genre (id, name) VALUES
(28, 'Action'),
(12, 'Eventyr'),
(16, 'Animation'),
(35, 'Komedie'),
(80, 'Krimi'),
(99, 'Dokumentar'),
(18, 'Drama'),
(10751, 'Familie'),
(14, 'Fantasi'),
(36, 'Historie'),
(27, 'Gys'),
(10402, 'Musik'),
(9648, 'Mystik'),
(10749, 'Romantik'),
(878, 'Science Fiction'),
(10770, 'TV-film'),
(53, 'Thriller'),
(10752, 'Krig'),
(37, 'Western')
ON CONFLICT (id) DO NOTHING;

-- Insert streaming platforms
INSERT INTO StreamingPlatform (name, url) VALUES
('Netflix', 'https://netflix.com'),
('Viaplay', 'https://viaplay.com'),
('Disney+', 'https://disneyplus.com'),
('HBO Max', 'https://hbomax.com'),
('Amazon Prime Video', 'https://primevideo.com')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users
INSERT INTO "User" (email, password_hash, role) VALUES
('admin@movieapp.dk', '$2b$10$ExampleHashedPassword123', 'admin'),
('user@movieapp.dk', '$2b$10$ExampleHashedPassword456', 'user')
ON CONFLICT (email) DO NOTHING;