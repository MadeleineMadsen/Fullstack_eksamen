import type Genre from "./Genre";
import type StreamingPlatform from "./StreamingPlatform";
import type Actor from "./Actor";
import type Trailer from "./Trailer";

export default interface Movie {
    id: number;
    title: string;
    metacritic?: number;
    poster_image?: string;
    released?: string;
    rating?: number;
    runtime?: number;
    plot?: string;
    director?: string;
    isAdmin: boolean;
    genres: Genre[];
    actors: Actor[];
    streaming_platforms?: StreamingPlatform[];
    has_streaming_info?: boolean;
    data_source?: string;
    trailers: Trailer[];
}