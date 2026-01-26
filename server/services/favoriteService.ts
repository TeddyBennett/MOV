import prisma from '../utils/prisma.js';

export const favoriteService = {
    /**
     * Get all favorite movies for a user
     */
    async getFavorites(userId: string) {
        return prisma.favorite.findMany({
            where: { userId },
            orderBy: { id: 'desc' },
        });
    },

    /**
     * Add a movie to favorites
     */
    async addFavorite(userId: string, movieId: number) {
        return prisma.favorite.upsert({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
            update: {}, // Do nothing if it already exists
            create: {
                userId,
                movieId,
            },
        });
    },

    /**
     * Remove a movie from favorites
     */
    async removeFavorite(userId: string, movieId: number) {
        return prisma.favorite.delete({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
    },

    /**
     * Check if a movie is favorited by a user
     */
    async isFavorited(userId: string, movieId: number) {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
        return !!favorite;
    },
};
