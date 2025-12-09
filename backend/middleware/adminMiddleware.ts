// backend/src/middleware/adminMiddleware.ts
import { NextFunction, Request, Response } from "express";

export function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log('🔍 adminMiddleware called, userRole:', (req as any).userRole);
    const userRole = (req as any).userRole;
    
    if (userRole !== "admin") {
        return res.status(403).json({ 
            message: "Forbidden: Admin access required" 
        });
    }
    
    next();
}