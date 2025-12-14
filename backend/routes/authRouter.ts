import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    comparePassword,
    createUser,
    findUserByEmail,
    findUserById,
} from "../services/userService";

const router = Router();

// Hemmelig nøgle til at signere JWT (burde komme fra env i produktion)
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
// Hvor længe token er gyldigt
const JWT_EXPIRES_IN = "7d";

// Helper-funktion til at oprette en JWT med brugerens id, email og rolle
function signToken(userId: number, email: string, role: string) {
    return jwt.sign({ userId, email, role }, JWT_SECRET, { 
        expiresIn: JWT_EXPIRES_IN 
    });
}


// Helper-funktion til at sætte JWT-tokenet som httpOnly-cookie
function setAuthCookie(res: Response, token: string) {
    res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dage
    });
}

// POST /api/auth/signup
// Opretter en ny bruger, gemmer i DB og logger automatisk ind med cookie
router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // Simpel backend-validering
        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email og password er påkrævet" });
        }

        // Tjek om email allerede bruges
        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(409).json({ message: "Email er allerede i brug" });
        }

        // Opret bruger (createUser hasher password og sætter default role)
        const newUser = await createUser({ username, email, password });
        
        // Lav JWT-token og sæt cookie
        const token = signToken(newUser.id, newUser.email, newUser.role);
        setAuthCookie(res, token);

        // Returnér brugerinfo (uden password)
        return res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            created_at: newUser.created_at,
        });
    } catch (err) {
        console.error("Signup error", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/auth/login
// Logger bruger ind ved at tjekke email + password, og sætter JWT-cookie
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log(" Login attempt for email:", email);

        // Simpel backend-validering
        if (!email || !password) {
            return res.status(400).json({ message: "email og password er påkrævet" });
        }

        // Find bruger ud fra email
        const user = await findUserByEmail(email);
        console.log(" User found:", user ? "Yes" : "No");
        
        if (!user) {
            return res.status(401).json({ message: "Forkert email eller password" });
        }

        console.log(" User object:", {
            id: user.id,
            email: user.email,
            role: user.role,  
            hasRoleProperty: "role" in user
        });

         // Sammenlign plaintext password med hashed password i DB
        const valid = await comparePassword(password, user.password);
        console.log(" Password valid:", valid);
        
        if (!valid) {
            return res.status(401).json({ message: "Forkert email eller password" });
        }

        // Hvis login er OK → generer JWT og sæt cookie
        const token = signToken(user.id, user.email, user.role);
        setAuthCookie(res, token);

        console.log(" Login successful, returning:", {
            id: user.id,
            email: user.email,
            role: user.role
        });

        // Returnér brugerinfo (uden password)
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        });
    } catch (err) {
        console.error("Login error", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/auth/profile (beskyttet route)
// Returnerer den nuværende logged-in brugers info
router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
    try {
        // userId er sat i authMiddleware efter JWT-verify
        const userId = (req as any).userId as number | undefined;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Hent bruger fra DB
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User ikke fundet" });
        }

         // Returnér brugerinfo (igen uden password)
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        });
    } catch (err) {
        console.error("Profile error", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


// POST /api/auth/logout
// Logger brugeren ud ved at rydde JWT-cookien
router.post("/logout", (req: Request, res: Response) => {
    // Fjern JWT-cookien
    res.clearCookie("auth_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    return res.json({ message: "Logged out" });
});


export default router;
