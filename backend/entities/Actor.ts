import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie";

@Entity("actors")
export class Actor {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "name", length: 255 })
    name: string;

    @Column("varchar", { name: "profile_image", nullable: true, length: 255 })
    profile_image?: string;

    @Column("date", { nullable: true })
    birth_date?: string;

    @Column("varchar", { name: "nationality", nullable: true, length: 255 })
    nationality?: string;

    @ManyToMany(() => Movie, (movie) => movie.actors)
    movies: Movie[];
}