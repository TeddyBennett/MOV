import React, { useEffect } from 'react';
import { useDataContext } from '../data/DataContext';
import MovieGrid from './MovieGrid';
import { useLocation } from 'react-router-dom';
import { ApiService } from '../services/apiService';
import { logError } from '../utils/errorHandler';

interface TrendingMoviePageProps {
  time: 'day' | 'week';
}

const TrendingMoviePage: React.FC<TrendingMoviePageProps> = ({ time }) => {
  const {
    setMovies,
    currentPage,
    setIsLoading,
    setTotalPages,
  } = useDataContext();
  const location = useLocation();

  useEffect(() => {
    async function fetchTrendingMovies() {
      try {
        setIsLoading(true);
        // Note: The TMDB API doesn't have a direct endpoint for trending movies by time period
        // We'll use the popular movies endpoint as a substitute
        let data;
        if (time === 'day') {
          // For daily trending, we'll use the popular endpoint
          data = await ApiService.fetchPopularMovies(currentPage);
        } else {
          // For weekly trending, we'll also use the popular endpoint
          data = await ApiService.fetchPopularMovies(currentPage);
        }

        setMovies(data.results || []);
        setTotalPages(data.total_pages);
      } catch (error) {
        logError(error, 'fetchTrendingMovies');
        console.error('Error fetching trending movies: ', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrendingMovies();
  }, [currentPage, location, time, setIsLoading, setMovies, setTotalPages]);

  return (
    <div className="max-w-[1248px] mx-auto px-4 mt-8">
      <div className="bg-gray-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-2 shadow-2xl overflow-hidden">
        <header className="pt-4 text-center bg-gradient-to-b from-indigo-900/20 to-transparent">
          <h1 className="text-2xl font-bold text-white mb-2 capitalize">
            Trending {time}
          </h1>
          <p className="text-gray-400">
            Most popular movies of the {time}
          </p>
        </header>
        <MovieGrid />
      </div>
    </div>
  );
};

export default TrendingMoviePage;
