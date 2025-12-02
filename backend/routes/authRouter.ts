import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
    comparePassword,
    createUser,
    findUserByEmail,
    findUserById,
} from "../services/userService";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

function signToken(userId: number, email: string) {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function setAuthCookie(res: Response, token: string) {
    res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true i produktion (https)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dage
    });
}

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email og password er påkrævet" });
        }

        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(409).json({ message: "Email er allerede i brug" });
        }

        const newUser = await createUser({ username, email, password });
        const token = signToken(newUser.id, newUser.email);
        setAuthCookie(res, token);

        return res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            created_at: newUser.created_at,
        });
    } catch (err) {
        console.error("Signup error", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email og password er påkrævet" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Forkert email eller password" });
        }

        const valid = await comparePassword(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Forkert email eller password" });
        }

        const token = signToken(user.id, user.email);
        setAuthCookie(res, token);

        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
        });
    } catch (err) {
        console.error("Login error", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/auth/profile (beskyttet)
router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId as number | undefined;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User ikke fundet" });
        }

        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
        });
    } catch (err) {
        console.error("Profile error", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
