import { Request, Response } from 'express';
import { watchlistService } from '../services/watchlistService';
import { z } from 'zod';

// Architect's Note: Reusing the same validation logic for consistency
const MovieIdSchema = z.object({
    movieId: z.preprocess(
        (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
        z.number().int().positive()
    ),
});

export const watchlistController = {
    getWatchlist: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const items = await watchlistService.getWatchlist(userId);
            res.json(items);
        } catch (error) {
            console.error('Get Watchlist Error:', error);
            res.status(500).json({ message: 'Error retrieving watchlist' });
        }
    },

    addToWatchlist: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const validation = MovieIdSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Invalid Movie ID',
                    errors: validation.error.issues
                });
            }

            const item = await watchlistService.addWatchlist(userId, validation.data.movieId);
            res.status(201).json(item);
        } catch (error) {
            console.error('Add Watchlist Error:', error);
            res.status(500).json({ message: 'Error adding to watchlist' });
        }
    },

    removeFromWatchlist: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const validation = MovieIdSchema.safeParse(req.params);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Invalid Movie ID',
                    errors: validation.error.issues
                });
            }

            await watchlistService.removeWatchlist(userId, validation.data.movieId);
            res.status(204).send();
        } catch (error) {
            console.error('Remove Watchlist Error:', error);
            res.status(500).json({ message: 'Error removing from watchlist' });
        }
    },

    checkWatchlist: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const validation = MovieIdSchema.safeParse(req.params);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Invalid Movie ID',
                    errors: validation.error.issues
                });
            }

            const inWatchlist = await watchlistService.isInWatchlist(userId, validation.data.movieId);
            res.json({ inWatchlist });
        } catch (error) {
            console.error('Check Watchlist Error:', error);
            res.status(500).json({ message: 'Error checking watchlist status' });
        }
    },
};
