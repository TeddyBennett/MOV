import { Request, Response } from 'express';
import { ratingService } from '../services/ratingService.js';
import { z } from 'zod';

const RatingSchema = z.object({
    movieId: z.number(),
    rating: z.number().min(0.5).max(10),
});

export const getRatings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).session.user.id;
        const ratings = await ratingService.getRatings(userId);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
};

export const addRating = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).session.user.id;
        const validation = RatingSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }

        const rating = await ratingService.addRating(
            userId,
            validation.data.movieId,
            validation.data.rating
        );
        res.json(rating);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add rating' });
    }
};

export const removeRating = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).session.user.id;
        const movieId = parseInt(req.params.movieId as string);
        if (isNaN(movieId)) return res.status(400).json({ error: 'Invalid movieId' });

        await ratingService.removeRating(userId, movieId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove rating' });
    }
};

export const checkRating = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).session.user.id;
        const movieId = parseInt(req.params.movieId as string);
        if (isNaN(movieId)) return res.status(400).json({ error: 'Invalid movieId' });

        const rating = await ratingService.checkRating(userId, movieId);
        res.json({ rating: rating ? rating.rating : null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check rating' });
    }
};
