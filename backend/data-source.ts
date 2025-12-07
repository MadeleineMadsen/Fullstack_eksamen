import "dotenv/config"; 
import { DataSource } from "typeorm";
import { Movie } from "./entities/Movie";
import { Actor } from "./entities/Actor";
import { StreamingPlatform } from "./entities/StreamingPlatform";
import { Genre } from "./entities/Genre";
import { Trailer } from "./entities/Trailer";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Movie, Actor, StreamingPlatform, Genre, Trailer, User],
    synchronize: true,
    logging: true,
});