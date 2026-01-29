import { Request, Response } from 'express';
import { listService } from '../services/listService.js';
import { z } from 'zod';
import { ApiError } from '../utils/errors.js';

const CreateListSchema = z.object({
    name: z.string().min(1, "List name cannot be empty").max(50, "List name too long"),
});

const ListMovieSchema = z.object({
    movieId: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number().int().positive()),
});

export const listController = {
    getLists: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const lists = await listService.getUserLists(userId);
        res.json(lists);
    },

    getListById: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const listId = parseInt(req.params.id as string);
        const list = await listService.getListDetails(userId, listId);
        
        if (!list) {
            throw ApiError.notFound('List not found');
        }
        res.json(list);
    },

    createList: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const validation = CreateListSchema.safeParse(req.body);
        
        if (!validation.success) {
            throw ApiError.badRequest('Invalid list data', validation.error.issues);
        }

        const list = await listService.createList(userId, validation.data.name);
        res.status(201).json(list);
    },

    deleteList: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const listId = parseInt(req.params.id as string);
        
        try {
            await listService.deleteList(userId, listId);
            res.status(204).send();
        } catch (error) {
            throw new ApiError('Failed to delete list', 500);
        }
    },

    addMovie: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const listId = parseInt(req.params.id as string);
        const validation = ListMovieSchema.safeParse(req.body);
        
        if (!validation.success) {
            throw ApiError.badRequest('Invalid movie ID', validation.error.issues);
        }

        try {
            const result = await listService.addMovieToList(userId, listId, validation.data.movieId);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.message === 'List not found or unauthorized') {
                throw ApiError.forbidden(error.message);
            }
            throw new ApiError('Failed to add movie to list', 500);
        }
    },

    removeMovie: async (req: Request, res: Response) => {
        const userId = (req as any).session.user.id;
        const listId = parseInt(req.params.id as string);
        const movieId = parseInt(req.params.movieId as string);

        try {
            await listService.removeMovieFromList(userId, listId, movieId);
            res.status(204).send();
        } catch (error: any) {
            if (error.message === 'List not found or unauthorized') {
                throw ApiError.forbidden(error.message);
            }
            throw new ApiError('Failed to remove movie from list', 500);
        }
    }
};
