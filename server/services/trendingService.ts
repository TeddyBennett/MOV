import prisma from '../utils/prisma.js';

export class TrendingService {
    /**
     * Increment the search count for a movie or create it if it doesn't exist
     */
    static async incrementCount(movieData: {
        movieId: number;
        title: string;
        poster_path?: string | null;
        vote_average?: number;
        release_date?: string;
    }) {
        const { movieId, title, poster_path, vote_average, release_date } = movieData;

        return prisma.trendingMovie.upsert({
            where: { movieId },
            update: {
                count: { increment: 1 },
                // Update metadata in case it changed (optional)
                title,
                poster_path: poster_path || null,
                vote_average: vote_average ?? 0,
                release_date: release_date || "N/A",
            },
            create: {
                movieId,
                title,
                poster_path: poster_path || null,
                vote_average: vote_average ?? 0,
                release_date: release_date || "N/A",
                count: 1,
            },
        });
    }

    /**
     * Get the top 10 trending movies
     */
    static async getTopTrending() {
        return prisma.trendingMovie.findMany({
            orderBy: {
                count: 'desc',
            },
            take: 10,
        });
    }
}
