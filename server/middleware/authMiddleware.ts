import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../utils/auth';

/**
 * Middleware to protect routes and attach the session to the request object.
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized: No valid session found' });
        }

        // Attach session to request for use in controllers
        (req as any).session = session;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Internal Server Error during authentication' });
    }
};
