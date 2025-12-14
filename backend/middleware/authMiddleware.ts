import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Hemmelig nøgle der bruges til at signere og verificere JWT tokens
// I produktion MÅ dette ikke være hardcoded, men komme fra environment variables
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Definerer den struktur vi forventer at finde inde i JWT-tokenet
interface JwtPayload {
    userId: number;
    email: string;
    role: string;
}

// Middleware der beskytter ruter
// Sikrer at kun brugere med et gyldigt JWT-token har adgang
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Læser JWT-tokenet fra cookie med navnet "auth_token"
    const token = req.cookies?.auth_token;

    // Hvis ingen token findes → brugeren er ikke logget ind
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: no token" });
    }

    try {
         // Verificerer token og dekoder payload
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        
        // Gemmer brugerdata på request-objektet så controllerne kan bruge det
        (req as any).userId = decoded.userId;
        (req as any).userEmail = decoded.email;
        (req as any).userRole = decoded.role;

        // Giv adgang til næste middleware/route handler
        next();
    } catch (err) {
        
        // Token er ugyldig eller udløbet
        console.error("JWT verify error", err);
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
}
