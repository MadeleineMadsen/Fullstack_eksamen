import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

// Repository giver adgang til users-tabellen i databasen
const userRepository = AppDataSource.getRepository(User);

// Input-type til oprettelse af ny bruger
export interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    role?: string;// standard = "user"
}

// -------------------------------------------------------------------
// HASHING FUNKTIONER (sikkerhed)
// -------------------------------------------------------------------

// Hasher et plaintext password med bcrypt (saltRounds = 10)
// Bruges før gem i DB, så vi aldrig lagrer plaintext passwords
export async function hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plain, saltRounds);
}


// -------------------------------------------------------------------
// CREATE USER
// -------------------------------------------------------------------
export async function comparePassword(
    plain: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

export async function createUser(input: CreateUserInput): Promise<User> {
    const user = new User();
    
    // Brugerdetaljer
    user.username = input.username;
    user.email = input.email;

    // Hasher password automatisk inden gem
    user.password = await hashPassword(input.password);

     // Standardrolle = "user", eller brugerens valgte rolle
    user.role = input.role || 'user';
    
    // created_at + default values håndteres af DB / entity
    return userRepository.save(user);
}


// -------------------------------------------------------------------
// FIND USER BY EMAIL
// Bruges ved login og signup-check
// -------------------------------------------------------------------
export async function findUserByEmail(email: string): Promise<User | null> {
    return userRepository.findOne({ where: { email } });
}

// -------------------------------------------------------------------
// FIND USER BY ID
// Bruges i /profile endpointet
// -------------------------------------------------------------------

export async function findUserById(id: number): Promise<User | null> {
    return userRepository.findOne({ where: { id } });
}
