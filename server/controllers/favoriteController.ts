import { Request, Response } from 'express';
import { favoriteService } from '../services/favoriteService.js';
import { z } from 'zod';

// Architect's Note: Fail Fast validation at the controller level
const MovieIdSchema = z.object({
    movieId: z.preprocess(
        (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
        z.number().int().positive()
    ),
});

export const favoriteController = {
    getFavorites: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const favorites = await favoriteService.getFavorites(userId);
            res.json(favorites);
        } catch (error) {
            console.error('Get Favorites Error:', error);
            res.status(500).json({ message: 'Error retrieving favorites' });
        }
    },

    addFavorite: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const validation = MovieIdSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Invalid Movie ID',
                    errors: validation.error.issues
                });
            }

            const favorite = await favoriteService.addFavorite(userId, validation.data.movieId);
            res.status(201).json(favorite);
        } catch (error) {
            console.error('Add Favorite Error:', error);
            res.status(500).json({ message: 'Error adding favorite' });
        }
    },

    removeFavorite: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const validation = MovieIdSchema.safeParse(req.params);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Invalid Movie ID',
                    errors: validation.error.issues
                });
            }

            await favoriteService.removeFavorite(userId, validation.data.movieId);
            res.status(204).send({ message: 'Favorite removed successfully' });
        } catch (error) {
            console.error('Remove Favorite Error:', error);
            res.status(500).json({ message: 'Error removing favorite' });
        }
    },

    checkFavorite: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const validation = MovieIdSchema.safeParse(req.params);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Invalid Movie ID',
                    errors: validation.error.issues
                });
            }

            const isFavorited = await favoriteService.isFavorited(userId, validation.data.movieId);
            res.json({ isFavorited });
        } catch (error) {
            console.error('Check Favorite Error:', error);
            res.status(500).json({ message: 'Error checking favorite status' });
        }
    },
};
