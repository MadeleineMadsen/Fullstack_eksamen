import "dotenv/config";
import { DataSource } from "typeorm";
import { Actor } from "./entities/Actor";
import { Genre } from "./entities/Genre";
import { Movie } from "./entities/Movie";
import { StreamingPlatform } from "./entities/StreamingPlatform";
import { Trailer } from "./entities/Trailer";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Movie, Actor, StreamingPlatform, Genre, Trailer, User],
    synchronize: false,
    logging: true,
});



