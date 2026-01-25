import prisma from '../utils/prisma';

export const ratingService = {
    async getRatings(userId: string) {
        return await prisma.rating.findMany({
            where: { userId },
        });
    },

    async addRating(userId: string, movieId: number, rating: number) {
        return await prisma.rating.upsert({
            where: {
                userId_movieId: { userId, movieId },
            },
            update: { rating },
            create: { userId, movieId, rating },
        });
    },

    async removeRating(userId: string, movieId: number) {
        // Delete only if it exists
        const existing = await this.checkRating(userId, movieId);
        if (!existing) return;

        return await prisma.rating.delete({
            where: {
                userId_movieId: { userId, movieId },
            },
        });
    },

    async checkRating(userId: string, movieId: number) {
        return await prisma.rating.findUnique({
            where: {
                userId_movieId: { userId, movieId },
            },
        });
    },
};
