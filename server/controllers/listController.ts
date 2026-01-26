import { Request, Response } from 'express';
import { listService } from '../services/listService.js';
import { z } from 'zod';

const CreateListSchema = z.object({
    name: z.string().min(1).max(50),
});

const ListMovieSchema = z.object({
    movieId: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number().int().positive()),
});

export const listController = {
    getLists: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const lists = await listService.getUserLists(userId);
            res.json(lists);
        } catch (error) {
            console.error('Get Lists Error:', error);
            res.status(500).json({ message: 'Error retrieving lists' });
        }
    },

    getListById: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const listId = parseInt(req.params.id as string);
            const list = await listService.getListDetails(userId, listId);
            if (!list) return res.status(404).json({ message: 'List not found' });
            res.json(list);
        } catch (error) {
            console.error('Get List Error:', error);
            res.status(500).json({ message: 'Error retrieving list' });
        }
    },

    createList: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const validation = CreateListSchema.safeParse(req.body);
            if (!validation.success) return res.status(400).json({ errors: validation.error.issues });

            const list = await listService.createList(userId, validation.data.name);
            res.status(201).json(list);
        } catch (error) {
            console.error('Create List Error:', error);
            res.status(500).json({ message: 'Error creating list' });
        }
    },

    deleteList: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const listId = parseInt(req.params.id as string);
            await listService.deleteList(userId, listId);
            res.status(204).send();
        } catch (error) {
            console.error('Delete List Error:', error);
            res.status(500).json({ message: 'Error deleting list' });
        }
    },

    addMovie: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const listId = parseInt(req.params.id as string);
            const validation = ListMovieSchema.safeParse(req.body);
            if (!validation.success) return res.status(400).json({ errors: validation.error.issues });

            const result = await listService.addMovieToList(userId, listId, validation.data.movieId);
            res.status(201).json(result);
        } catch (error: any) {
            console.error('Add Movie to List Error:', error);
            if (error.message === 'List not found or unauthorized') return res.status(403).json({ message: error.message });
            res.status(500).json({ message: 'Error adding movie to list' });
        }
    },

    removeMovie: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).session.user.id;
            const listId = parseInt(req.params.id as string);
            const movieId = parseInt(req.params.movieId as string);

            await listService.removeMovieFromList(userId, listId, movieId);
            res.status(204).send();
        } catch (error: any) {
            console.error('Remove Movie from List Error:', error);
            if (error.message === 'List not found or unauthorized') return res.status(403).json({ message: error.message });
            res.status(500).json({ message: 'Error removing movie from list' });
        }
    }
};
