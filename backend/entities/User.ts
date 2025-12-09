import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "email", length: 255, unique: true })
    email: string;

    @Column("varchar", { name: "username", length: 100, unique: true })
    username: string;

    @Column("varchar", { name: "password", length: 255 })
    password: string;

    @Column("varchar", { 
        name: "role", 
        length: 20
    })
    role: string;

    @Column({ name: "created_at" })
    created_at: Date;

    @Column({ name: "last_login", type: "timestamp", nullable: true })
    last_login: Date;

    @Column({ name: "is_active", type: "boolean", default: true })
    is_active: boolean;
}