// frontend/src/entities/Movie.ts
export interface Movie {
    id: number;
    title: string;
    overview?: string;
    released?: string;
    rating?: number;
    poster_image?: string;
    background_image?: string;
}