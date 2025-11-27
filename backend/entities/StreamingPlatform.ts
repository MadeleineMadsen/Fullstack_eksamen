import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie";

@Entity("streaming_platforms")
export class StreamingPlatform {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "name", length: 255 })
    name: string;

    @Column("varchar", { name: "logo", nullable: true, length: 255 })
    logo?: string;

    @Column("varchar", { name: "website", nullable: true, length: 255 })
    website?: string;

    @ManyToMany(() => Movie, (movie) => movie.streaming_platforms)
    movies: Movie[];
}