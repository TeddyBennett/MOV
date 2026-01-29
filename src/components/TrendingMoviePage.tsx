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

  return <MovieGrid />;
};

export default TrendingMoviePage;
