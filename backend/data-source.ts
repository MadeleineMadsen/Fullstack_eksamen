import "dotenv/config";
import { DataSource } from "typeorm";
import { Genre } from "./entities/Genre";
import { Movie } from "./entities/Movie";
import { StreamingPlatform } from "./entities/StreamingPlatform";
import { Trailer } from "./entities/Trailer";
import { User } from "./entities/User";

// ---------------------------------------------------------------------------
// AppDataSource
// Dette er hele TypeORM's databasekonfiguration.
// Den bruges til at oprette forbindelse til Postgres og registrere alle entities.
// Når AppDataSource.initialize() kaldes i server.ts, oprettes forbindelsen.
// 
export const AppDataSource = new DataSource({
     // Database-type
    type: "postgres",
     // Forbinder til databasen via DATABASE_URL i .env
    // Format: postgres://user:password@host:port/database
    url: process.env.DATABASE_URL,

     // Alle entities (tabeller) der skal være en del af ORM-modellen
    entities: [Movie, StreamingPlatform, Genre, Trailer, User],

    // synchronize = false betyder:
    // TypeORM ændrer IKKE tabeller automatisk.
    //
    // Dette er vigtigt i produktion, så TypeORM ikke sletter eller ændrer tabeller
    // når appen genstartes.
    //
    // Hvis man vil opdatere schema, gør man det via migrations.
    synchronize: false,
    // logging = true gør at SQL statements printes i terminalen.
    // Det er nyttigt til debugging.
    logging: true,
});



