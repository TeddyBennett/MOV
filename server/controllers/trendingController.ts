import { Request, Response } from 'express';
import { TrendingService } from '../services/trendingService.js';
import { z } from 'zod';
import prisma from '../utils/prisma.js';

const IncrementSchema = z.object({
    movieId: z.number(),
    title: z.string(),
    poster_path: z.string().nullable().optional(),
    vote_average: z.number().optional().default(0),
    release_date: z.string().optional().default("N/A"),
});

export class TrendingController {
    static async incrementCount(req: Request, res: Response) {
        try {
            if (!(prisma as any).trendingMovie) {
                console.error('[TrendingController] CRITICAL: trendingMovie model missing from Prisma Client!');
                console.log('[TrendingController] Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
                return res.status(500).json({ error: 'Database model "trendingMovie" not found. Please restart the server.' });
            }

            // console.log('[TrendingController] Incrementing count for:', req.body);
            const movieData = IncrementSchema.parse(req.body);
            const result = await TrendingService.incrementCount(movieData);
            res.json(result);
        } catch (error: any) {
            console.error('[TrendingController] Error incrementing count:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    static async getTopTrending(req: Request, res: Response) {
        try {
            if (!(prisma as any).trendingMovie) {
                return res.status(500).json({ error: 'Database model "trendingMovie" not found. Please restart the server.' });
            }
            const data = await TrendingService.getTopTrending();
            res.json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
