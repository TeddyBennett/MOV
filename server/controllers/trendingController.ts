import { Request, Response } from 'express';
import { TrendingService } from '../services/trendingService.js';
import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { ApiError } from '../utils/errors.js';

const IncrementSchema = z.object({
    movieId: z.number().int().positive(),
    title: z.string().min(1),
    poster_path: z.string().nullable().optional(),
    vote_average: z.number().optional().default(0),
    release_date: z.string().optional().default("N/A"),
});

export class TrendingController {
    static async incrementCount(req: Request, res: Response) {
        if (!(prisma as any).trendingMovie) {
            throw ApiError.internal('Database model "trendingMovie" not found');
        }

        const movieData = IncrementSchema.parse(req.body);
        const result = await TrendingService.incrementCount(movieData);
        res.json(result);
    }

    static async getTopTrending(req: Request, res: Response) {
        if (!(prisma as any).trendingMovie) {
            throw ApiError.internal('Database model "trendingMovie" not found');
        }
        const data = await TrendingService.getTopTrending();
        res.json(data);
    }
}
