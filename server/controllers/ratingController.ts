import { Request, Response } from 'express';
import { ratingService } from '../services/ratingService.js';
import { z } from 'zod';
import { ApiError } from '../utils/errors.js';

const RatingSchema = z.object({
    movieId: z.number().int().positive(),
    rating: z.number().min(0.5).max(10),
});

export const ratingController = {
    getRatings: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const ratings = await ratingService.getRatings(userId);
        res.json(ratings);
    },

    addRating: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const validation = RatingSchema.safeParse(req.body);
        if (!validation.success) {
            throw ApiError.badRequest('Invalid rating data', validation.error.issues);
        }

        const rating = await ratingService.addRating(
            userId,
            validation.data.movieId,
            validation.data.rating
        );
        res.json(rating);
    },

    removeRating: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const movieId = parseInt(req.params.movieId as string);
        
        if (isNaN(movieId)) {
            throw ApiError.badRequest('Invalid movieId');
        }

        await ratingService.removeRating(userId, movieId);
        res.json({ success: true });
    },

    checkRating: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const movieId = parseInt(req.params.movieId as string);
        
        if (isNaN(movieId)) {
            throw ApiError.badRequest('Invalid movieId');
        }

        const rating = await ratingService.checkRating(userId, movieId);
        res.json({ rating: rating ? rating.rating : null });
    }
};
