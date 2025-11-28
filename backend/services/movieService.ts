import { AppDataSource } from "../data-source";
import { Movie } from "../entities/Movie";

export interface MovieFilters {
    title?: string;
    genre?: number;
    minRating?: number;
    maxRating?: number;
    year?: number;
}

export interface PaginationOptions {
    page: number;
    pageSize: number;
}

export interface MovieResponse {
    movies: Movie[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

const movieRepository = AppDataSource.getRepository(Movie);

export const getMovies = async (
    filters: MovieFilters = {},
    pagination: PaginationOptions = { page: 1, pageSize: 20 }
): Promise<MovieResponse> => {
    const { page, pageSize } = pagination;
    
    try {
        const queryBuilder = movieRepository
            .createQueryBuilder("movie")
            .leftJoinAndSelect("movie.genres", "genres")
            .leftJoinAndSelect("movie.actors", "actors");

        // Apply filters
        if (filters.title) {
            queryBuilder.andWhere("LOWER(movie.title) LIKE LOWER(:title)", {
                title: `%${filters.title}%`
            });
        }

        if (filters.genre) {
            queryBuilder.andWhere(
                "movie.id IN (SELECT movies_id FROM movies_has_genres WHERE genres_id = :genreId)",
                { genreId: filters.genre }
            );
        }

        if (filters.minRating !== undefined) {
            queryBuilder.andWhere("movie.rating >= :minRating", { minRating: filters.minRating });
        }

        if (filters.maxRating !== undefined) {
            queryBuilder.andWhere("movie.rating <= :maxRating", { maxRating: filters.maxRating });
        }

        if (filters.year) {
            queryBuilder.andWhere("EXTRACT(YEAR FROM movie.released) = :year", { year: filters.year });
        }

        // Apply pagination and ordering
        queryBuilder
            .orderBy("movie.rating", "DESC")
            .skip((page - 1) * pageSize)
            .take(pageSize);

        const [movies, total] = await queryBuilder.getManyAndCount();
        
        return {
            movies,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw new Error("Failed to fetch movies");
    }
};

export const getMovie = async (id: number): Promise<Movie | null> => {
    try {
        const movie = await movieRepository.findOne({
            where: { id },
            relations: ["genres", "actors", "streaming_platforms"],
        });
        return movie;
    } catch (error) {
        console.error(`Error fetching movie with ID ${id}:`, error);
        throw new Error("Failed to fetch movie");
    }
};

export const deleteMovieById = async (id: number): Promise<boolean> => {
    try {
        const result = await movieRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    } catch (error) {
        console.error(`Error deleting movie with ID ${id}:`, error);
        throw new Error("Failed to delete movie");
    }
};

export const createMovie = async (movieData: Partial<Movie>): Promise<Movie> => {
    try {
        const movie = movieRepository.create(movieData);
        return await movieRepository.save(movie);
    } catch (error) {
        console.error("Error creating movie:", error);
        throw new Error("Failed to create movie");
    }
};