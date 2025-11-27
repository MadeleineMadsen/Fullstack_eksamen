import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    created_at: Date;
}