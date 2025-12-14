import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie";

//Genre-entiteten repræsenterer tabellen "genres" i databasen.
//Bruges til at kategorisere film (fx Action, Comedy, Drama).
@Entity("genres")
export class Genre {
    // Primærnøgle (AUTO_INCREMENT). Unikt ID for hver genre
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    // Genrens navn (fx Action, Comedy). Obligatorisk felt
    @Column("varchar", { name: "name", length: 255 })
    name: string;

    // Valgfrit felt til et baggrundsbillede (bruges ofte i UI som banner)
    @Column("varchar", { name: "image_background", nullable: true, length: 255 })
    image_background?: string;

    // Many-to-many relation:
    // En genre kan tilhøre mange film,
    // og en film kan have flere genrer.
    @ManyToMany(() => Movie, (movie) => movie.genres)
    movies: Movie[];
}