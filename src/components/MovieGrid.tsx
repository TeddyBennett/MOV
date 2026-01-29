import React from 'react';
import MovieCard from './MovieCard';
import { useDataContext } from '../data/DataContext';
import NoPosterH from '../assets/No-Poster-h.png';
import { useLocation } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';

export const MovieGridSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-8 max-w-[1248px] mx-auto">
        {[...Array(12)].map((_, i) => (
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

const MovieGrid: React.FC = () => {
    const { movies, isLoading, isInitializing, movieDataOperations } = useDataContext();
    const location = useLocation();
    const isHome = location.pathname === '/';

    if (isLoading || isInitializing) {
        return <MovieGridSkeleton />;
    }

    // Get processed movies with user status
    const processedMovies = movieDataOperations.getProcessedMovies(movies, NoPosterH);

    return (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-5 max-w-[1248px] w-full mx-auto ${!isHome ? 'pt-5' : ''}`}>
            {processedMovies.length > 0 ? (
                processedMovies.map((movie: any) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-20">
                    <p className='text-white text-xl'>No movies available to display.</p>
                </div>
            )}
        </div>
    );
};

export default MovieGrid;
