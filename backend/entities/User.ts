import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "username", length: 255 })
    username: string;

    @Column("varchar", { name: "email", length: 255 })
    email: string;

    @Column("varchar", { name: "password", length: 255 })
    password: string;

    @Column("varchar", { 
        name: "role", 
        length: 20, 
        default: "user"  // Dette sikrer at nye brugere får 'user' som default
    })
    role: string;

    @CreateDateColumn()
    created_at: Date;
}