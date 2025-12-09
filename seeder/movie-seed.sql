DROP TABLE IF EXISTS "actors";
DROP SEQUENCE IF EXISTS actors_id_seq;
CREATE SEQUENCE actors_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."actors" (
    "id" integer DEFAULT nextval('actors_id_seq') NOT NULL,
    "name" character varying(255) NOT NULL,
    "profile_image" character varying(255),
    "birth_date" date,
    "nationality" character varying(255),
    CONSTRAINT "PK_d8608598c2c4f907a78de2ae461" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "genres";
DROP SEQUENCE IF EXISTS genres_id_seq;
CREATE SEQUENCE genres_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."genres" (
    "id" integer DEFAULT nextval('genres_id_seq') NOT NULL,
    "name" character varying(255) NOT NULL,
    "image_background" character varying(255),
    CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "movies";
DROP SEQUENCE IF EXISTS movies_id_seq;
CREATE SEQUENCE movies_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

CREATE TABLE "public"."movies" (
    "id" integer DEFAULT nextval('movies_id_seq') NOT NULL,
    "title" character varying(255) NOT NULL,
    "metacritic" integer,
    "poster_image" character varying(255),
    "overview" text,
    "released" character varying,
    "rating" double precision,
    "runtime" integer,
    "background_image" character varying(255),
    "plot" text,
    "director" character varying(255),
    "is_admin" boolean DEFAULT false NOT NULL,
    "tmdb_id" INTEGER UNIQUE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"),
    CONSTRAINT "movies_rating_check" CHECK (rating >= 0 AND rating <= 10),
    CONSTRAINT "movies_metacritic_check" CHECK (metacritic >= 0 AND metacritic <= 100)
)
WITH (oids = false);


DROP TABLE IF EXISTS "movies_has_actors";
CREATE TABLE "public"."movies_has_actors" (
    "movies_id" integer NOT NULL,
    "actors_id" integer NOT NULL,
    CONSTRAINT "PK_17d7f9f02e4c653c7e2b637772e" PRIMARY KEY ("movies_id", "actors_id")
)
WITH (oids = false);

CREATE INDEX "IDX_3f39529b356a56aaa0cd9af2ec" ON public.movies_has_actors USING btree (movies_id);

CREATE INDEX "IDX_a215c23d127a28f730debd54b2" ON public.movies_has_actors USING btree (actors_id);


DROP TABLE IF EXISTS "movies_has_genres";
CREATE TABLE "public"."movies_has_genres" (
    "movies_id" integer NOT NULL,
    "genres_id" integer NOT NULL,
    CONSTRAINT "PK_be0e36d0203b5157849c6c63f97" PRIMARY KEY ("movies_id", "genres_id")
)
WITH (oids = false);

CREATE INDEX "IDX_45af8c327cec3645e862498894" ON public.movies_has_genres USING btree (movies_id);

CREATE INDEX "IDX_3bbac904fed4f7d8a346eb9cdf" ON public.movies_has_genres USING btree (genres_id);


DROP TABLE IF EXISTS "movies_has_streaming_platforms";
CREATE TABLE "public"."movies_has_streaming_platforms" (
    "movies_id" integer NOT NULL,
    "streaming_platforms_id" integer NOT NULL,
    CONSTRAINT "PK_277fa817f9ce2aaac76112ef61c" PRIMARY KEY ("movies_id", "streaming_platforms_id")
)
WITH (oids = false);

CREATE INDEX "IDX_41f39bf4d5ded5c495823b35dc" ON public.movies_has_streaming_platforms USING btree (movies_id);

CREATE INDEX "IDX_781a23a8098e1639fb2ae32e72" ON public.movies_has_streaming_platforms USING btree (streaming_platforms_id);


DROP TABLE IF EXISTS "streaming_platforms";
DROP SEQUENCE IF EXISTS streaming_platforms_id_seq;
CREATE SEQUENCE streaming_platforms_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."streaming_platforms" (
    "id" integer DEFAULT nextval('streaming_platforms_id_seq') NOT NULL,
    "name" character varying(255) NOT NULL,
    "logo" character varying(255),
    "website" character varying(255),
    CONSTRAINT "PK_6633915364bbbb9463ed22fa435" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "trailers";
DROP SEQUENCE IF EXISTS trailers_id_seq;
CREATE SEQUENCE trailers_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."trailers" (
    "id" integer DEFAULT nextval('trailers_id_seq') NOT NULL,
    "name" character varying(255) NOT NULL,
    "preview" character varying(255) NOT NULL,
    "data_480" character varying(255) NOT NULL,
    "data_max" character varying(255) NOT NULL,
    "movieId" integer,
    CONSTRAINT "PK_598af6bec45fafbf70437f32b8b" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP FUNCTION IF EXISTS "update_updated_at_column";;
CREATE FUNCTION "update_updated_at_column" () RETURNS trigger LANGUAGE plpgsql AS '
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
';

DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "email" character varying(255) NOT NULL,
    "username" character varying(100) NOT NULL,
    "password" character varying(255) NOT NULL,
    "role" character varying(20) NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "last_login" timestamp,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

CREATE INDEX idx_users_email ON public.users USING btree (email);

CREATE INDEX idx_users_username ON public.users USING btree (username);

INSERT INTO "users" ("id", "email", "username", "password", "role", "created_at", "last_login", "is_active") VALUES
(1000,	'a@a.com',	'Admin',	'$2b$10$bQKa9EDURrR..UVjnedvWeelXnWx929OMSdNcCtWLeIbX46QOacWe',	'admin',	'2025-12-09 11:01:31.582145',	NULL,	'true'),
(1001,	'k@k.com',	'Kamilla',	'$2b$10$97tEDh51oTSScOhzCvxgqutHyEprxrzkIJ0vqQDQXyH7Qio.egQ9S',	'user',	'2025-12-09 11:01:31.582729',	NULL,	'true'),
(1002,	'm@m.com',	'Madeleine',	'$2b$10$aKoEvrv1yomXr0jFBbJMSuZ7rGuAtnVFl/PoicDKGbrpgacq/ZTOq',	'user',	'2025-12-09 11:01:31.582729',	NULL,	'true'),
(1003,	'n@n.com',	'Naomi',	'$2b$10$UbAuEOZCCvVIRinEhO1.FeETyWRjBA9J5.tOOXO2e5lkzuayKEYGG',	'user',	'2025-12-09 11:01:31.582729',	NULL,	'true');

-- -- Fix sequences after inserting data
-- SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 0) + 1);

ALTER TABLE ONLY "public"."movies_has_actors" ADD CONSTRAINT "FK_3f39529b356a56aaa0cd9af2ec6" FOREIGN KEY (movies_id) REFERENCES movies(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."movies_has_actors" ADD CONSTRAINT "FK_a215c23d127a28f730debd54b2d" FOREIGN KEY (actors_id) REFERENCES actors(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."movies_has_genres" ADD CONSTRAINT "FK_3bbac904fed4f7d8a346eb9cdf1" FOREIGN KEY (genres_id) REFERENCES genres(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."movies_has_genres" ADD CONSTRAINT "FK_45af8c327cec3645e862498894c" FOREIGN KEY (movies_id) REFERENCES movies(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."movies_has_streaming_platforms" ADD CONSTRAINT "FK_41f39bf4d5ded5c495823b35dc3" FOREIGN KEY (movies_id) REFERENCES movies(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."movies_has_streaming_platforms" ADD CONSTRAINT "FK_781a23a8098e1639fb2ae32e728" FOREIGN KEY (streaming_platforms_id) REFERENCES streaming_platforms(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."trailers" ADD CONSTRAINT "FK_00e72f453c7bab48f3cb0cadf5a" FOREIGN KEY ("movieId") REFERENCES movies(id) ON DELETE CASCADE NOT DEFERRABLE;


-- ======================
-- SIMPLE PRIVILEGES SEPARATION
-- ======================

-- Create application user with limited privileges
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'movie_app') THEN
        CREATE USER movie_app WITH PASSWORD 'movie_app_password';
        RAISE NOTICE 'Application user created: movie_app';
    END IF;
END $$;

-- Grant ONLY necessary privileges
GRANT CONNECT ON DATABASE movie_db TO movie_app;
GRANT USAGE ON SCHEMA public TO movie_app;

-- Grant access to tables (but NOT structure changes)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO movie_app;

-- Grant access to sequences (for auto-increment IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO movie_app;