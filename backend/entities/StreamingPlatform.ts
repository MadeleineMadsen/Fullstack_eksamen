import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie";

// Denne klasse repræsenterer "streaming_platforms"-tabellen i databasen
@Entity("streaming_platforms")
export class StreamingPlatform {
     // Primærnøgle (AUTO_INCREMENT). Unikt ID for hver streamingplatform
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    // Navnet på platformen (fx Netflix, HBO, Disney+)
    @Column("varchar", { name: "name", length: 255 })
    name: string;

    // Valgfrit logo-billede (URL eller filnavn)
    @Column("varchar", { name: "logo", nullable: true, length: 255 })
    logo?: string;

    // Valgfri URL til platformens officielle website
    @Column("varchar", { name: "website", nullable: true, length: 255 })
    website?: string;

    // Many-to-many relation:
    // En streamingplatform kan have mange film,
    // og en film kan ligge på flere platforme.
    @ManyToMany(() => Movie, (movie) => movie.streaming_platforms)
    movies: Movie[];
}