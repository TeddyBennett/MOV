import { Request, Response } from 'express';
import { watchlistService } from '../services/watchlistService.js';
import { z } from 'zod';
import { ApiError } from '../utils/errors.js';

// Architect's Note: Reusing the same validation logic for consistency
const MovieIdSchema = z.object({
    movieId: z.preprocess(
        (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
        z.number().int().positive()
    ),
});

export const watchlistController = {
    getWatchlist: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const items = await watchlistService.getWatchlist(userId);
        res.json(items);
    },

    addToWatchlist: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const validation = MovieIdSchema.safeParse(req.body);

        if (!validation.success) {
            throw ApiError.badRequest('Invalid Movie ID', validation.error.issues);
        }

        const item = await watchlistService.addWatchlist(userId, validation.data.movieId);
        res.status(201).json(item);
    },

    removeFromWatchlist: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const validation = MovieIdSchema.safeParse(req.params);

        if (!validation.success) {
            throw ApiError.badRequest('Invalid Movie ID', validation.error.issues);
        }

        await watchlistService.removeWatchlist(userId, validation.data.movieId);
        res.status(204).send();
    },

    checkWatchlist: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const validation = MovieIdSchema.safeParse(req.params);

        if (!validation.success) {
            throw ApiError.badRequest('Invalid Movie ID', validation.error.issues);
        }

        const inWatchlist = await watchlistService.isInWatchlist(userId, validation.data.movieId);
        res.json({ inWatchlist });
    },
};
