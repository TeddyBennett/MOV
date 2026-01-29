import { useEffect } from 'react';
import { useDataContext } from '../data/DataContext';
import MovieGrid from './MovieGrid';
import { BackendApiService } from '../services/backendApiService';
import { ApiService } from '../services/apiService';
import { logError } from '../utils/errorHandler';
import { Skeleton } from './ui/skeleton';
import { Movie } from '../types';

interface FavoritesSkeletonProps {
    count: number;
}

const FavoritesSkeleton: React.FC<FavoritesSkeletonProps> = ({ count }) => (
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

const FavoritesPage: React.FC = () => {
    const { setMovies, setIsLoading, setTotalPages, isLoading, userStatsVersion, movieDataOperations } = useDataContext();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setIsLoading(true);
                const favoriteData = await BackendApiService.getFavorites();

                // Fetch full details for each favorite from TMDB
                const moviePromises = favoriteData.map((f: { movieId: number }) =>
                    ApiService.fetchMovieDetails(f.movieId).catch(() => null)
                );

                const results = await Promise.all(moviePromises);
                const validMovies: Movie[] = results.filter((m): m is Movie => m !== null);

                setMovies(validMovies);
                setTotalPages(1); // Backend favorites currently not paginated
            } catch (error) {
                logError(error, 'fetchFavoritesFromBackend');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [setMovies, setIsLoading, setTotalPages, userStatsVersion]);

    const favoriteCount = movieDataOperations.getFavorites().size;
    const skeletonCount = favoriteCount > 0 ? favoriteCount : 12; // Default to 12 if no favorites

    return (
        <div className="max-w-[1248px] mx-auto px-4 mt-8">
            <div className="bg-gray-900/30 backdrop-blur-sm border border-white/5 rounded-3xl shadow-2xl overflow-hidden pb-8">
                <header className="p-8 text-center bg-gradient-to-b from-indigo-900/20 to-transparent">
                    <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
                    <p className="text-gray-400">Movies you've saved to your collection</p>
                </header>

                {isLoading ? (
                    <FavoritesSkeleton count={skeletonCount} />
                ) : (
                    <MovieGrid />
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
