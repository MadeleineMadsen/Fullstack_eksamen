import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Actor } from "./Actor";
import { Genre } from "./Genre";
import { StreamingPlatform } from "./StreamingPlatform";
import { Trailer } from "./Trailer";

@Entity("movies")
// Denne klasse repræsenterer "movies"-tabellen i databasen
export class Movie {
    // Denne klasse repræsenterer "movies"-tabellen i databasen
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    // Filmens titel (obligatorisk)
    @Column("varchar", { name: "title", length: 255 })
    title: string;

    // Metacritic score (valgfrit tal)
    @Column("int", { name: "metacritic", nullable: true })
    metacritic?: number;

    // URL eller filnavn til filmens poster-billede
    @Column("varchar", { name: "poster_image", nullable: true, length: 255 })
    poster_image?: string;

    // Filmens beskrivelse / overview (fra seeder)
    @Column({ type: "text", nullable: true })
    overview?: string;

    // Udgivelsesdato
    @Column({ nullable: true })
    released?: string;

    // Filmens rating (fx IMDB rating)
    @Column("float", { nullable: true })
    rating?: number;

     // Filmlængde i minutter
    @Column("int", { nullable: true })
    runtime?: number;

    // Baggrundsbillede til UI (valgfrit)
    @Column("varchar", { name: "background_image", nullable: true, length: 255 })
    background_image?: string;

    // Uddybende plottekst
    @Column({ type: "text", nullable: true })
    plot?: string;

    // Instruktørens navn
    @Column("varchar", { name: "director", nullable: true, length: 255 })
    director?: string;

    // Flag – bruges hvis nogle film kun må ses af admin
    @Column({ type: "boolean", name: "is_admin", default: false })
    isAdmin!: boolean;
    


    // ----------- RELATIONER -----------

    // Many-to-many relation til genrer.
    // En film kan have mange genrer, og en genre kan tilhøre mange film.
    @ManyToMany(() => Genre, (genre) => genre.movies)
    @JoinTable({
        name: "movies_has_genres",
        joinColumns: [{ name: "movies_id", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "genres_id", referencedColumnName: "id" }],
    })
    genres: Genre[];


   // Many-to-many relation til skuespillere.
   // Join-tabel binder film og actors sammen.
    // Join-tabel binder film og actors sammen.
    @ManyToMany(() => Actor, (actor) => actor.movies)
    @JoinTable({
        name: "movies_has_actors",
        joinColumns: [{ name: "movies_id", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "actors_id", referencedColumnName: "id" }],
    })
    actors: Actor[];


     // Many-to-many relation til streamingplatforme.
    // En film kan findes på flere platforme (Netflix, HBO, osv.)
    @ManyToMany(() => StreamingPlatform, (platform) => platform.movies)
    @JoinTable({
        name: "movies_has_streaming_platforms",
        joinColumns: [{ name: "movies_id", referencedColumnName: "id" }],
        inverseJoinColumns: [
            { name: "streaming_platforms_id", referencedColumnName: "id" },
        ],
    })
    streaming_platforms: StreamingPlatform[];

    @OneToMany(() => Trailer, (trailer) => trailer.movie)
    trailers: Trailer[];
}
