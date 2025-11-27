import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Actor } from "./Actor";
import { StreamingPlatform } from "./StreamingPlatform";
import { Genre } from "./Genre";
import { Trailer } from "./Trailer";

@Entity("movies")
export class Movie {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "title", length: 255 })
    title: string;

    @Column("int", { name: "metacritic", nullable: true })
    metacritic?: number;

    @Column("varchar", { name: "poster_image", nullable: true, length: 255 })
    poster_image?: string;

    @Column({ nullable: true })
    released?: string;

    @Column("float", { nullable: true })
    rating?: number;

    @Column("int", { nullable: true })
    runtime?: number;

    @Column({ type: "text", nullable: true })
    plot?: string;

    @Column("varchar", { name: "director", nullable: true, length: 255 })
    director?: string;

    @ManyToMany(() => Genre, (genre) => genre.movies)
    @JoinTable({
        name: "movies_has_genres",
        joinColumns: [{ name: "movies_id", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "genres_id", referencedColumnName: "id" }],
    })
    genres: Genre[];

    @ManyToMany(() => Actor, (actor) => actor.movies)
    @JoinTable({
        name: "movies_has_actors",
        joinColumns: [{ name: "movies_id", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "actors_id", referencedColumnName: "id" }],
    })
    actors: Actor[];

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