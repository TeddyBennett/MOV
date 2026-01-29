import { useEffect } from 'react';
import { useDataContext } from '../data/DataContext';
import MovieGrid from './MovieGrid';
import { BackendApiService } from '../services/backendApiService';
import { ApiService } from '../services/apiService';
import { logError } from '../utils/errorHandler';
import { Skeleton } from './ui/skeleton';
import { Movie } from '../types';

interface WatchlistSkeletonProps {
    count: number;
}

const WatchlistSkeleton: React.FC<WatchlistSkeletonProps> = ({ count }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 p-3 sm:p-8 w-full">
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

const WatchlistPage: React.FC = () => {
    const { setMovies, setIsLoading, setTotalPages, isLoading, userStatsVersion, movieDataOperations } = useDataContext();

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                setIsLoading(true);
                const watchlistData = await BackendApiService.getWatchlist();

                // Fetch full details for each watchlist item from TMDB
                const moviePromises = watchlistData.map((w: { movieId: number }) =>
                    ApiService.fetchMovieDetails(w.movieId).catch(() => null)
                );

                const results = await Promise.all(moviePromises);
                const validMovies: Movie[] = results.filter((m): m is Movie => m !== null);

                setMovies(validMovies);
                setTotalPages(1); // Backend watchlist currently not paginated
            } catch (error) {
                logError(error, 'fetchWatchlistFromBackend');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWatchlist();
    }, [setMovies, setIsLoading, setTotalPages, userStatsVersion]);

    const watchlistCount = movieDataOperations.getWatchlist().size;
    const skeletonCount = watchlistCount > 0 ? watchlistCount : 12; // Default to 12 if no watchlist items

    return (
        <div className="max-w-[1248px] mx-auto px-4 mt-8">
            <div className="bg-gray-900/30 backdrop-blur-sm border border-white/5 rounded-3xl shadow-2xl overflow-hidden pb-8">
                <header className="p-8 text-center bg-gradient-to-b from-indigo-900/20 to-transparent">
                    <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
                    <p className="text-gray-400">Movies you're planning to watch</p>
                </header>

                {isLoading ? (
                    <WatchlistSkeleton count={skeletonCount} />
                ) : (
                    <MovieGrid />
                )}
            </div>
        </div>
    );
};

export default WatchlistPage;
