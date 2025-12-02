import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export interface CreateUserInput {
    username: string;
    email: string;
    password: string;
}

export async function hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plain, saltRounds);
}

export async function comparePassword(
    plain: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

export async function createUser(input: CreateUserInput): Promise<User> {
    const user = new User();
    user.username = input.username;
    user.email = input.email;
    user.password = await hashPassword(input.password);
    return userRepository.save(user);
}

export async function findUserByEmail(email: string): Promise<User | null> {
    return userRepository.findOne({ where: { email } });
}

export async function findUserById(id: number): Promise<User | null> {
    return userRepository.findOne({ where: { id } });
}
