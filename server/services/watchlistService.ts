import prisma from '../utils/prisma';

export const watchlistService = {
    async getWatchlist(userId: string) {
        return prisma.watchlist.findMany({
            where: { userId },
            orderBy: { id: 'desc' },
        });
    },

    async addWatchlist(userId: string, movieId: number) {
        return prisma.watchlist.upsert({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
            update: {},
            create: {
                userId,
                movieId,
            },
        });
    },

    async removeWatchlist(userId: string, movieId: number) {
        return prisma.watchlist.delete({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
    },

    async isInWatchlist(userId: string, movieId: number) {
        const item = await prisma.watchlist.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
        return !!item;
    },
};
