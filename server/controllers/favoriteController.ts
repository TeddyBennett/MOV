import { Request, Response } from 'express';
import { favoriteService } from '../services/favoriteService.js';
import { z } from 'zod';
import { ApiError } from '../utils/errors.js';

// Architect's Note: Fail Fast validation at the controller level
const MovieIdSchema = z.object({
    movieId: z.preprocess(
        (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
        z.number().int().positive()
    ),
});

export const favoriteController = {
    getFavorites: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const favorites = await favoriteService.getFavorites(userId);
        res.json(favorites);
    },

    addFavorite: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const validation = MovieIdSchema.safeParse(req.body);

        if (!validation.success) {
            throw ApiError.badRequest('Invalid Movie ID', validation.error.issues);
        }

        const favorite = await favoriteService.addFavorite(userId, validation.data.movieId);
        res.status(201).json(favorite);
    },

    removeFavorite: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const validation = MovieIdSchema.safeParse(req.params);

        if (!validation.success) {
            throw ApiError.badRequest('Invalid Movie ID', validation.error.issues);
        }

        await favoriteService.removeFavorite(userId, validation.data.movieId);
        res.status(204).send();
    },

    checkFavorite: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const validation = MovieIdSchema.safeParse(req.params);

        if (!validation.success) {
            throw ApiError.badRequest('Invalid Movie ID', validation.error.issues);
        }

        const isFavorited = await favoriteService.isFavorited(userId, validation.data.movieId);
        res.json({ isFavorited });
    },
};
