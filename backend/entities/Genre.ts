import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie";

@Entity("genres")
export class Genre {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "name", length: 255 })
    name: string;

    @Column("varchar", { name: "image_background", nullable: true, length: 255 })
    image_background?: string;

    @ManyToMany(() => Movie, (movie) => movie.genres)
    movies: Movie[];
}