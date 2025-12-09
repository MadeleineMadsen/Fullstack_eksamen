import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie";

//  Denne klasse repræsenterer "actors"-tabellen i databasen
@Entity("actors")
export class Actor {
    // Primærnøgle (AUTO_INCREMENT). Unikt ID for hver skuespiller
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    // Skuespillerens navn (obligatorisk felt)
    @Column("varchar", { name: "name", length: 255 })
    name: string;

    // Valgfrit felt til profilbillede. Gemmer fx filnavn eller URL
    @Column("varchar", { name: "profile_image", nullable: true, length: 255 })
    profile_image?: string;

     // Valgfrit felt til fødselsdato
    @Column("date", { nullable: true })
    birth_date?: string;

    // Valgfrit felt til nationalitet
    @Column("varchar", { name: "nationality", nullable: true, length: 255 })
    nationality?: string;


    // Many-to-many relation:
    // En skuespiller kan være med i mange film,
    // og en film kan have mange skuespillere.
    @ManyToMany(() => Movie, (movie) => movie.actors)
    movies: Movie[];
}