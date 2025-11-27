import { DataSource } from "typeorm";
import { Movie } from "./entities/Movie";
import { Actor } from "./entities/Actor";
import { StreamingPlatform } from "./entities/StreamingPlatform";
import { Genre } from "./entities/Genre";
import { Trailer } from "./entities/Trailer";
// import { User } from "./entities/User"; // hvis du bruger User

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as "mysql" | "postgres",
    url: process.env.DATABASE_URL,
    entities: [Movie, Actor, StreamingPlatform, Genre, Trailer], // Tilføj User her hvis nødvendigt
    synchronize: true,
    logging: true,
});