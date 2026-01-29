import { useEffect } from 'react';
import { useDataContext } from '../data/DataContext';
import MovieGrid from './MovieGrid';
import { BackendApiService } from '../services/backendApiService';
import { ApiService } from '../services/apiService';
import { logError } from '../utils/errorHandler';
import { Skeleton } from './ui/skeleton';
import { Movie, Rating } from '../types';
import React from 'react';

interface RatedMoviesSkeletonProps {
    count: number;
}

const RatedMoviesSkeleton: React.FC<RatedMoviesSkeletonProps> = ({ count }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-8 max-w-[1248px] mx-auto">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[40%]" />
                </div>
            </div>
        ))}
    </div>
);

const RatedMoviesPage: React.FC = () => {
    const { setMovies, isLoading, setIsLoading, setTotalPages, userStatsVersion, movieDataOperations } = useDataContext();

    useEffect(() => {
        const fetchRatedMovies = async () => {
            try {
                setIsLoading(true);
                const ratings: Rating[] = await BackendApiService.getRatings();

                if (ratings && ratings.length > 0) {
                    const moviePromises = ratings.map((r: Rating) =>
                        ApiService.fetchMovieDetails(r.movieId).catch(() => null)
                    );

                    const results = await Promise.all(moviePromises);
                    const validMovies: Movie[] = results.filter((m): m is Movie => m !== null);
                    setMovies(validMovies);
                } else {
                    setMovies([]);
                }

                setTotalPages(1); // Backend ratings currently not paginated
            } catch (error) {
                logError(error, 'fetchRatedMovies');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRatedMovies();
    }, [setIsLoading, setMovies, setTotalPages, userStatsVersion]);

    const ratedMoviesCount = movieDataOperations.getRatings().size;
    const skeletonCount = ratedMoviesCount > 0 ? ratedMoviesCount : 12; // Default to 12 if no ratings

    return (
        <div className="min-h-screen bg-transparent">
            <header className="p-8 text-center bg-gradient-to-b from-indigo-900/20 to-transparent">
                <h1 className="text-4xl font-bold text-white mb-2">My Rated Movies</h1>
                <p className="text-gray-400">Movies you have shared your thoughts on.</p>
            </header>

            {isLoading ? (
                <RatedMoviesSkeleton count={skeletonCount} />
            ) : (
                <MovieGrid />
            )}
        </div>
    );
};

export default RatedMoviesPage;
