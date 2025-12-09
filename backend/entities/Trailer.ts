import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./Movie";

// Denne klasse repræsenterer "trailers"-tabellen i databasen
@Entity("trailers")
export class Trailer {
    // Primærnøgle for trailer (AUTO_INCREMENT)
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    // Navn eller titel på traileren
    @Column("varchar", { name: "name", length: 255 })
    name: string;

    // Et preview-billede eller kort videoforsmag (URL eller filnavn)
    @Column("varchar", { name: "preview", length: 255 })
    preview: string;

     // Link til 480p version af traileren
    @Column("varchar", { name: "data_480", length: 255 })
    data480: string;

     // Link til højeste kvalitet af traileren (fx 1080p eller 4K)
    @Column("varchar", { name: "data_max", length: 255 })
    dataMax: string;

    
    // Relation: Mange trailers hører til én film.
    // onDelete: "CASCADE" betyder:
    // Hvis filmen slettes, slettes alle dens trailers automatisk.
    @ManyToOne(() => Movie, (movie) => movie.trailers, { onDelete: "CASCADE" })
    movie: Movie;
}