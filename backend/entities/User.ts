import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Denne klasse repræsenterer "users"-tabellen i databasen
@Entity("users")
export class User {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    // Primærnøgle (AUTO_INCREMENT). Unikt ID for hver bruger
    @Column("varchar", { name: "email", length: 255, unique: true })
    email: string;

    // Brugerens email
    // Skal være unik i databasen (unique: true)
    @Column("varchar", { name: "username", length: 100, unique: true })
    username: string;

    // Hashed password (ikke plaintext)
    @Column("varchar", { name: "password", length: 255 })
    password: string;

     // Brugerens rolle – fx "user" eller "admin"
    @Column("varchar", { 
        name: "role", 
        length: 20
    })
    role: string;

    // Dato for hvornår brugeren blev oprettet
    @Column({ name: "created_at" })
    created_at: Date;

     // Tidspunkt for seneste login
    // Må være null hvis brugeren aldrig har logget ind
    @Column({ name: "last_login", type: "timestamp", nullable: true })
    last_login: Date;

    // Om brugerens konto er aktiv
    // Default = true → brugeren er aktiv fra start
    @Column({ name: "is_active", type: "boolean", default: true })
    is_active: boolean;
}