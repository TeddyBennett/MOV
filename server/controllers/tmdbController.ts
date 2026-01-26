// server/controllers/tmdbController.ts
import { Request, Response } from 'express';
import { TmdbService } from '../services/tmdbService';
import { z } from 'zod';

/**
 * Zod Schemas for "Fail Fast" validation
 */
const PageQuerySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
});

const SearchQuerySchema = z.object({
    query: z.string().min(1),
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
});

const GenreParamsSchema = z.object({
    genreId: z.string(),
});

const MovieParamsSchema = z.object({
    movieId: z.string().transform(val => parseInt(val)),
});

const ListParamsSchema = z.object({
    listId: z.string(),
});

const FavoriteBodySchema = z.object({
    movieId: z.number(),
    favorite: z.boolean(),
});

const WatchlistBodySchema = z.object({
    movieId: z.number(),
    watchlist: z.boolean(),
});

const RatingBodySchema = z.object({
    movieId: z.number(),
    rating: z.number().min(0.5).max(10),
});

export class TmdbController {
    static async getPopularMovies(req: Request, res: Response) {
        try {
            const { page } = PageQuerySchema.parse(req.query);
            const data = await TmdbService.getPopularMovies(page);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async searchMovies(req: Request, res: Response) {
        try {
            const { query, page } = SearchQuerySchema.parse(req.query);
            const data = await TmdbService.searchMovies(query, page);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getMoviesByGenre(req: Request, res: Response) {
        try {
            const { genreId } = GenreParamsSchema.parse(req.params);
            const { page } = PageQuerySchema.parse(req.query);
            const data = await TmdbService.getMoviesByGenre(genreId, page);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getMovieDetails(req: Request, res: Response) {
        try {
            const { movieId } = MovieParamsSchema.parse(req.params);
            const data = await TmdbService.getMovieDetails(movieId, req.query);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateFavorite(req: Request, res: Response) {
        try {
            const { movieId, favorite } = FavoriteBodySchema.parse(req.body);
            const data = await TmdbService.updateFavorite(movieId, favorite);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updateWatchlist(req: Request, res: Response) {
        try {
            const { movieId, watchlist } = WatchlistBodySchema.parse(req.body);
            const data = await TmdbService.updateWatchlist(movieId, watchlist);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async rateMovie(req: Request, res: Response) {
        try {
            const { movieId, rating } = RatingBodySchema.parse(req.body);
            const data = await TmdbService.rateMovie(movieId, rating);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteRating(req: Request, res: Response) {
        try {
            const { movieId } = MovieParamsSchema.parse(req.params);
            const data = await TmdbService.deleteRating(movieId);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async addMovieToList(req: Request, res: Response) {
        try {
            const { listId } = ListParamsSchema.parse(req.params);
            const { movieId } = z.object({ movieId: z.number() }).parse(req.body);
            const data = await TmdbService.addMovieToList(listId, movieId);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async removeMovieFromList(req: Request, res: Response) {
        try {
            const { listId } = ListParamsSchema.parse(req.params);
            const { movieId } = z.object({ movieId: z.number() }).parse(req.body);
            const data = await TmdbService.removeMovieFromList(listId, movieId);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getFavoriteMovies(req: Request, res: Response) {
        try {
            const { page } = PageQuerySchema.parse(req.query);
            const data = await TmdbService.getFavoriteMovies(page);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getWatchlistMovies(req: Request, res: Response) {
        try {
            const { page } = PageQuerySchema.parse(req.query);
            const data = await TmdbService.getWatchlistMovies(page);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getRatedMovies(req: Request, res: Response) {
        try {
            const { page } = PageQuerySchema.parse(req.query);
            const data = await TmdbService.getRatedMovies(page);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getLists(req: Request, res: Response) {
        try {
            const { page } = PageQuerySchema.parse(req.query);
            const data = await TmdbService.getLists(page);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getListDetails(req: Request, res: Response) {
        try {
            const { listId } = ListParamsSchema.parse(req.params);
            const data = await TmdbService.getListDetails(listId);
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
