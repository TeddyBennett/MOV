import { Request, Response } from 'express';
import { ApiError } from '../utils/errors.js';

export const userController = {
    /**
     * Get the current authenticated user's session
     */
    getSession: async (req: Request, res: Response) => {
        // The session is attached to the request by our authMiddleware
        const session = (req as any).session;

        if (!session) {
            throw ApiError.unauthorized('Not authenticated');
        }

        // Return only the necessary user details for the frontend
        res.json({
            user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
            },
            session: {
                expiresAt: session.session.expiresAt,
            }
        });
    }
};
