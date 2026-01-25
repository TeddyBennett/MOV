// src/services/apiService.js
// Single Responsibility: Handle all API communications with TMDB
import { getAuthHeaders } from './authService';
import { handleApiResponse, logError } from '../utils/errorHandler';

const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_URL_V4 = 'https://api.themoviedb.org/4';

/**
 * Service class for handling all API communications with TMDB
 */
export class ApiService {
  /**
   * Fetch popular movies
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} Response from API
   */
  static async fetchPopularMovies(page = 1) {
    try {
      const url = `${BASE_URL}/movie/popular?page=${page}`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('fetchPopularMovies', error);
      throw error;
    }
  }

  /**
   * Search movies by query
   * @param {string} query - Search query
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} Response from API
   */
  static async searchMovies(query, page = 1) {
    try {
      const url = `${BASE_URL}/search/movie?page=${page}&sort_by=popularity.desc&query=${encodeURIComponent(query)}`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('searchMovies', error);
      throw error;
    }
  }

  /**
   * Fetch movies by genre
   * @param {number} genreId - Genre ID to filter by
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} Response from API
   */
  static async fetchMoviesByGenre(genreId, page = 1) {
    try {
      const url = `${BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('fetchMoviesByGenre', error);
      throw error;
    }
  }

  /**
   * Add/remove movie from favorites
   * @param {number} movieId - ID of the movie
   * @param {boolean} favorite - Whether to add or remove from favorites
   * @param {string} title - Title of the movie for notifications
   * @returns {Promise<Object>} Response from API
   */
  static async updateFavorite(movieId, favorite, title) {
    try {
      const url = `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/favorite`;
      const options = {
        method: 'POST',
        headers: getAuthHeaders('write'),
        body: JSON.stringify({
          media_type: 'movie',
          media_id: movieId,
          favorite: favorite
        })
      };

      const response = await fetch(url, options);

      return await handleApiResponse(response);
    } catch (error) {
      logError('updateFavorite', error);
      throw error;
    }
  }

  /**
   * Add/remove movie from watchlist
   * @param {number} movieId - ID of the movie
   * @param {boolean} watchlist - Whether to add or remove from watchlist
   * @param {string} title - Title of the movie for notifications
   * @returns {Promise<Object>} Response from API
   */
  static async updateWatchlist(movieId, watchlist, title) {
    try {
      const url = `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/watchlist`;
      const options = {
        method: 'POST',
        headers: getAuthHeaders('write'),
        body: JSON.stringify({
          media_type: 'movie',
          media_id: movieId,
          watchlist: watchlist
        })
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('updateWatchlist', error);
      throw error;
    }
  }

  /**
   * Rate a movie
   * @param {number} movieId - ID of the movie
   * @param {number} rating - Rating value (0-10)
   * @returns {Promise<Object>} Response from API
   */
  static async rateMovie(movieId, rating) {
    try {
      const url = `${BASE_URL}/movie/${movieId}/rating`;
      const options = {
        method: 'POST',
        headers: getAuthHeaders('write'),
        body: JSON.stringify({ value: rating })
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('rateMovie', error);
      throw error;
    }
  }

  /**
   * Delete movie rating
   * @param {number} movieId - ID of the movie
   * @returns {Promise<Object>} Response from API
   */
  static async deleteRating(movieId) {
    try {
      const url = `${BASE_URL}/movie/${movieId}/rating`;
      const options = {
        method: 'DELETE',
        headers: getAuthHeaders('write')
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('deleteRating', error);
      throw error;
    }
  }

  /**
   * Add movie to a list
   * @param {number} listId - ID of the list
   * @param {number} movieId - ID of the movie
   * @returns {Promise<Object>} Response from API
   */
  static async addMovieToList(listId, movieId) {
    try {
      const url = `${BASE_URL_V4}/list/${listId}/items`;
      const options = {
        method: 'POST',
        headers: getAuthHeaders('write'),
        body: JSON.stringify({
          items: [{
            media_type: 'movie',
            media_id: movieId
          }]
        })
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('addMovieToList', error);
      throw error;
    }
  }

  /**
   * Remove movie from a list
   * @param {number} listId - ID of the list
   * @param {number} movieId - ID of the movie
   * @returns {Promise<Object>} Response from API
   */
  static async removeMovieFromList(listId, movieId) {
    try {
      const url = `${BASE_URL_V4}/list/${listId}/items`;
      const options = {
        method: 'DELETE',
        headers: getAuthHeaders('write'),
        body: JSON.stringify({
          items: [{
            media_type: 'movie',
            media_id: movieId
          }]
        })
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('removeMovieFromList', error);
      throw error;
    }
  }

  /**
   * Check if movie is in a list
   * @param {number} listId - ID of the list
   * @param {number} movieId - ID of the movie
   * @returns {Promise<Object>} Response from API
   */
  static async isMovieInList(listId, movieId) {
    try {
      const url = `${BASE_URL_V4}/list/${listId}/item_status?media_id=${movieId}&media_type=movie`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('isMovieInList', error);
      throw error;
    }
  }

  /**
   * Fetch user's favorite movies
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} Response from API
   */
  static async fetchFavoriteMovies(page = 1) {
    try {
      const url = `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/favorite/movies?page=${page}`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('fetchFavoriteMovies', error);
      throw error;
    }
  }

  /**
   * Fetch user's watchlist movies
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} Response from API
   */
  static async fetchWatchlistMovies(page = 1) {
    try {
      const url = `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/watchlist/movies?page=${page}`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('fetchWatchlistMovies', error);
      throw error;
    }
  }

  /**
   * Fetch user's rated movies
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} Response from API
   */
  static async fetchRatedMovies(page = 1) {
    try {
      const url = `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/rated/movies?page=${page}`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('fetchRatedMovies', error);
      throw error;
    }
  }

  /**
   * Fetch user's movie lists
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} Response from API
   */
  static async fetchMovieLists(page = 1) {
    try {
      const url = `${BASE_URL}/account/${import.meta.env.VITE_TMDB_ACCOUNT_ID}/lists?page=${page}`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('fetchMovieLists', error);
      throw error;
    }
  }

  /**
   * Fetch details of a specific list
   * @param {number} listId - ID of the list
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} Response from API
   */
  static async fetchListDetails(listId, page = 1) {
    try {
      const url = `${BASE_URL_V4}/list/${listId}?page=${page}`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('fetchListDetails', error);
      throw error;
    }
  }

  /**
   * Fetch details for a specific movie
   * @param {number} movieId - ID of the movie
   * @returns {Promise<Object>} Response from API
   */
  static async fetchMovieDetails(movieId) {
    try {
      const url = `${BASE_URL}/movie/${movieId}`;
      const options = {
        method: 'GET',
        headers: getAuthHeaders()
      };

      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      logError('fetchMovieDetails', error);
      throw error;
    }
  }
}