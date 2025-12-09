import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

interface JwtPayload {
    userId: number;
    email: string;
    role: string;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log('🔍 authMiddleware called');
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: no token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (req as any).userId = decoded.userId;
        (req as any).userEmail = decoded.email;
        (req as any).userRole = decoded.role;
        next();
    } catch (err) {
        console.error("JWT verify error", err);
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
}
