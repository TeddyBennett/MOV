import { Request, Response } from 'express';

export const userController = {
    /**
     * Get the current authenticated user's session
     */
    getSession: async (req: Request, res: Response) => {
        try {
            // The session is attached to the request by our authMiddleware
            const session = (req as any).session;

            if (!session) {
                return res.status(401).json({ message: 'Not authenticated' });
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
        } catch (error) {
            console.error('Get Session Error:', error);
            res.status(500).json({ message: 'Error retrieving session' });
        }
    }
};
