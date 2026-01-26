// src/data/DataContext.jsx
// Single Responsibility: Provide global state management for the application
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import genres from './genres';
import { MovieDataService } from '../services/movieDataService';
import { BackendApiService } from '../services/backendApiService';

// Create a Context
const DataContext = createContext();

// Create a Provider component
export const DataContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true); // Track user data initialization
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [userStatsVersion, setUserStatsVersion] = useState(0); // Trigger re-renders
  const [trendMovies, setTrendMovies] = useState([]);

  // Initialize the movie data service - use useMemo to persist across renders
  const movieDataService = useMemo(() => new MovieDataService(), []);

  // Helper to trigger a re-render when user data changes
  const triggerUpdate = useCallback(() => {
    setUserStatsVersion(v => v + 1);
  }, []);

  // Initialize user and trending data when the app loads
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch User specific data (favs, etc)
        await movieDataService.initializeUserData();
        
        // Fetch Global Trending data from DB
        const trending = await BackendApiService.getTrending().catch(() => []);
        const formattedTrending = (trending || []).map(m => ({
            ...m,
            id: m.movieId // Map movieId to id for frontend compatibility
        }));
        setTrendMovies(formattedTrending);

        setIsInitializing(false);
        triggerUpdate(); // Refresh components with loaded data
      } catch (error) {
        console.error('Error initializing data:', error);
        setIsInitializing(false);
      }
    };

    initializeData();
  }, [movieDataService, triggerUpdate]);

  const updateTrendMovies = async (firstIndexMovie) => {
    if (!firstIndexMovie || !firstIndexMovie.id) return;
    
    try {
        // Increment count in DB
        await BackendApiService.incrementTrending({
            movieId: Number(firstIndexMovie.id),
            title: firstIndexMovie.title || firstIndexMovie.name || "N/A",
            poster_path: firstIndexMovie.poster_path || null,
            vote_average: Number(firstIndexMovie.vote_average) || 0,
            release_date: firstIndexMovie.release_date || "N/A"
        }).catch(err => console.warn('[DataContext] Trending increment failed:', err));

        // Re-fetch trending list to keep UI in sync
        const trending = await BackendApiService.getTrending().catch(() => []);
        const formattedTrending = (trending || []).map(m => ({
            ...m,
            id: m.movieId // Map movieId to id for frontend compatibility
        }));
        setTrendMovies(formattedTrending);
    } catch (error) {
        console.error('Error updating trending movies:', error);
    }
  };

  // Expose the movie data service methods, wrapped to trigger re-renders
  const movieDataOperations = useMemo(() => ({
    addToFavorites: async (...args) => {
      const result = await movieDataService.addToFavorites(...args);
      if (result) triggerUpdate();
      return result;
    },
    removeFromFavorites: async (...args) => {
      const result = await movieDataService.removeFromFavorites(...args);
      if (result) triggerUpdate();
      return result;
    },
    addToWatchlist: async (...args) => {
      const result = await movieDataService.addToWatchlist(...args);
      if (result) triggerUpdate();
      return result;
    },
    removeFromWatchlist: async (...args) => {
      const result = await movieDataService.removeFromWatchlist(...args);
      if (result) triggerUpdate();
      return result;
    },
    rateMovie: async (...args) => {
      const result = await movieDataService.rateMovie(...args);
      if (result) triggerUpdate();
      return result;
    },
    deleteRating: async (...args) => {
      const result = await movieDataService.deleteRating(...args);
      if (result) triggerUpdate();
      return result;
    },
    addMovieToList: async (...args) => {
      const result = await movieDataService.addMovieToList(...args);
      if (result) triggerUpdate();
      return result;
    },
    removeMovieFromList: async (...args) => {
      const result = await movieDataService.removeMovieFromList(...args);
      if (result) triggerUpdate();
      return result;
    },
    createList: async (...args) => {
      const result = await movieDataService.createList(...args);
      if (result) triggerUpdate();
      return result;
    },
    deleteList: async (...args) => {
      const result = await movieDataService.deleteList(...args);
      if (result) triggerUpdate();
      return result;
    },
    getProcessedMovies: movieDataService.getProcessedMovies.bind(movieDataService),
    getFavorites: movieDataService.getFavorites.bind(movieDataService),
    getWatchlist: movieDataService.getWatchlist.bind(movieDataService),
    getRatings: movieDataService.getRatings.bind(movieDataService),
    getLists: movieDataService.getLists.bind(movieDataService),
    getMoviesInLists: movieDataService.getMoviesInLists.bind(movieDataService),
  }), [movieDataService, triggerUpdate, userStatsVersion]);

  return (
    <DataContext.Provider value={{
      // State variables
      isLoading, setIsLoading,
      isInitializing, // Exposed initialization status
      currentPage, setCurrentPage,
      movies, setMovies,
      totalPages, setTotalPages,
      trendMovies, setTrendMovies,
      userStatsVersion, // Included so consumers can depend on it if needed

      // Static data
      genres,

      // Operations
      updateTrendMovies,
      movieDataOperations
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useDataContext = () => useContext(DataContext);