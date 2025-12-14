import { NextFunction, Request, Response } from "express";

// adminMiddleware

// Bruges til at beskytte routes, som kun må tilgås af admin-brugere.
// Middleware køres FØR controlleren for den route, den er sat på.

export function adminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Viser om middleware bliver kaldt, og hvilken rolle brugeren har
    console.log('🔍 adminMiddleware called, userRole:', (req as any).userRole);

    // "as any" bruges her, fordi Express Request ikke kender feltet userRole som standard
    const userRole = (req as any).userRole;
    
    // Tjek om brugeren IKKE er admin. Hvis ja → stop requesten og send 403 Forbidden
    if (userRole !== "admin") {
        return res.status(403).json({ 
            message: "Forbidden: Admin access required" 
        });
    }
    
    // Hvis brugeren er admin: kald next() for at fortsætte til næste middleware eller controller
    next();
}