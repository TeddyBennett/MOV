// src/data/DataContext.jsx
// Single Responsibility: Provide global state management for the application
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import genres from './genres';
import { MovieDataService } from '../services/movieDataService';

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
  const [trendMovies, setTrendMovies] = useState(() => {
    const storedMovie = localStorage.getItem("trendMovies");
    return storedMovie ? JSON.parse(storedMovie) : [];
  });

  // Initialize the movie data service - use useMemo to persist across renders
  const movieDataService = useMemo(() => new MovieDataService(), []);

  // Helper to trigger a re-render when user data changes
  const triggerUpdate = useCallback(() => {
    setUserStatsVersion(v => v + 1);
  }, []);

  // Initialize user data when the app loads
  useEffect(() => {
    const initializeData = async () => {
      try {
        await movieDataService.initializeUserData();
        setIsInitializing(false);
        triggerUpdate(); // Refresh components with loaded data
      } catch (error) {
        console.error('Error initializing user data:', error);
        setIsInitializing(false);
      }
    };

    initializeData();
  }, [movieDataService, triggerUpdate]);

  const updateTrendMovies = (firstIndexMovie) => {
    const isTrendMovieExist = trendMovies.find(movie => movie.id === firstIndexMovie.id);
    let updatedTrendMovies = [];
    if (isTrendMovieExist) {
      updatedTrendMovies = trendMovies.map(movie =>
        movie.id === firstIndexMovie.id ? { ...movie, count: movie.count + 1 } : movie
      );
      setTrendMovies(updatedTrendMovies);
    } else {
      const newMovie = { ...firstIndexMovie, count: 1 };
      updatedTrendMovies = [...trendMovies, newMovie];
      setTrendMovies(updatedTrendMovies);
    }
    localStorage.setItem('trendMovies', JSON.stringify(updatedTrendMovies));
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