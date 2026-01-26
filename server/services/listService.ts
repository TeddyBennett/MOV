import prisma from '../utils/prisma.js';

export const listService = {
    /**
     * Get all lists for a user
     */
    async getUserLists(userId: string) {
        return prisma.list.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { listMovies: true }
                }
            },
            orderBy: { id: 'desc' }
        });
    },

    /**
     * Get a specific list with all its movies
     */
    async getListDetails(userId: string, listId: number) {
        return prisma.list.findFirst({
            where: {
                id: listId,
                userId: userId // Ensure user owns the list
            },
            include: {
                listMovies: true
            }
        });
    },

    /**
     * Create a new custom list
     */
    async createList(userId: string, name: string) {
        return prisma.list.create({
            data: {
                userId,
                name
            }
        });
    },

    /**
     * Rename a list
     */
    async updateList(userId: string, listId: number, name: string) {
        return prisma.list.updateMany({
            where: {
                id: listId,
                userId: userId
            },
            data: { name }
        });
    },

    /**
     * Delete a list and all its movie associations (onDelete: Cascade in schema)
     */
    async deleteList(userId: string, listId: number) {
        return prisma.list.deleteMany({
            where: {
                id: listId,
                userId: userId
            }
        });
    },

    /**
     * Add a movie to a specific list
     */
    async addMovieToList(userId: string, listId: number, movieId: number) {
        // First verify ownership of the list
        const list = await prisma.list.findFirst({
            where: { id: listId, userId }
        });

        if (!list) throw new Error('List not found or unauthorized');

        return prisma.listMovie.upsert({
            where: {
                listId_movieId: {
                    listId,
                    movieId
                }
            },
            update: {}, // Ignore if already exists
            create: {
                listId,
                movieId
            }
        });
    },

    /**
     * Remove a movie from a list
     */
    async removeMovieFromList(userId: string, listId: number, movieId: number) {
        // Verify ownership
        const list = await prisma.list.findFirst({
            where: { id: listId, userId }
        });

        if (!list) throw new Error('List not found or unauthorized');

        return prisma.listMovie.delete({
            where: {
                listId_movieId: {
                    listId,
                    movieId
                }
            }
        });
    }
};
