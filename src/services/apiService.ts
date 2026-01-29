// src/services/apiService.ts
// Single Responsibility: Handle all API communications with TMDB via Backend Proxy
import { logError } from '../utils/errorHandler';
import { BackendApiService } from './backendApiService';

const PROXY_BASE_URL = '/api/tmdb';

/**
 * Service class for handling all API communications with TMDB (Proxied through Backend)
 */
export class ApiService {
  /**
   * Helper to perform fetch via backend proxy
   */
  static async fetchViaProxy(path: string, options: RequestInit = {}): Promise<any> {
    return BackendApiService.fetchWithAuth(`${PROXY_BASE_URL}${path}`, options);
  }

  /**
   * Fetch popular movies
   */
  static async fetchPopularMovies(page: number = 1): Promise<any> {
    try {
      return await this.fetchViaProxy(`/popular?page=${page}`);
    } catch (error) {
      logError('fetchPopularMovies', error);
      throw error;
    }
  }

  /**
   * Search movies by query
   */
  static async searchMovies(query: string, page: number = 1): Promise<any> {
    try {
      return await this.fetchViaProxy(`/search?query=${encodeURIComponent(query)}&page=${page}`);
    } catch (error) {
      logError('searchMovies', error);
      throw error;
    }
  }

  /**
   * Fetch movies by genre
   */
  static async fetchMoviesByGenre(genreId: number | string, page: number = 1): Promise<any> {
    try {
      return await this.fetchViaProxy(`/genre/${genreId}?page=${page}`);
    } catch (error) {
      logError('fetchMoviesByGenre', error);
      throw error;
    }
  }

  /**
   * Add/remove movie from favorites (TMDB)
   */
  static async updateFavorite(movieId: number, favorite: boolean): Promise<any> {
    try {
      return await this.fetchViaProxy(`/favorite`, {
        method: 'POST',
        body: JSON.stringify({ movieId, favorite })
      });
    } catch (error) {
      logError('updateFavorite', error);
      throw error;
    }
  }

  /**
   * Add/remove movie from watchlist (TMDB)
   */
  static async updateWatchlist(movieId: number, watchlist: boolean): Promise<any> {
    try {
      return await this.fetchViaProxy(`/watchlist`, {
        method: 'POST',
        body: JSON.stringify({ movieId, watchlist })
      });
    } catch (error) {
      logError('updateWatchlist', error);
      throw error;
    }
  }

  /**
   * Rate a movie (TMDB)
   */
  static async rateMovie(movieId: number, rating: number): Promise<any> {
    try {
      return await this.fetchViaProxy(`/rating`, {
        method: 'POST',
        body: JSON.stringify({ movieId, rating })
      });
    } catch (error) {
      logError('rateMovie', error);
      throw error;
    }
  }

  /**
   * Delete movie rating (TMDB)
   */
  static async deleteRating(movieId: number): Promise<any> {
    try {
      return await this.fetchViaProxy(`/rating/${movieId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      logError('deleteRating', error);
      throw error;
    }
  }

  /**
   * Add movie to a list (TMDB)
   */
  static async addMovieToList(listId: number | string, movieId: number): Promise<any> {
    try {
      return await this.fetchViaProxy(`/list/${listId}/movies`, {
        method: 'POST',
        body: JSON.stringify({ movieId })
      });
    } catch (error) {
      logError('addMovieToList', error);
      throw error;
    }
  }

  /**
   * Remove movie from a list (TMDB)
   */
  static async removeMovieFromList(listId: number | string, movieId: number): Promise<any> {
    try {
      return await this.fetchViaProxy(`/list/${listId}/movies`, {
        method: 'DELETE',
        body: JSON.stringify({ movieId })
      });
    } catch (error) {
      logError('removeMovieFromList', error);
      throw error;
    }
  }

  /**
   * Check if movie is in a list (TMDB)
   */
  static async isMovieInList(listId: number | string, movieId: number): Promise<any> {
    try {
      return await this.fetchViaProxy(`/account/list/${listId}`); // We can filter client-side or add endpoint
    } catch (error) {
      logError('isMovieInList', error);
      throw error;
    }
  }

  /**
   * Fetch user's favorite movies (TMDB)
   */
  static async fetchFavoriteMovies(page: number = 1): Promise<any> {
    try {
      return await this.fetchViaProxy(`/account/favorites?page=${page}`);
    } catch (error) {
      logError('fetchFavoriteMovies', error);
      throw error;
    }
  }

  /**
   * Fetch user's watchlist movies (TMDB)
   */
  static async fetchWatchlistMovies(page: number = 1): Promise<any> {
    try {
      return await this.fetchViaProxy(`/account/watchlist?page=${page}`);
    } catch (error) {
      logError('fetchWatchlistMovies', error);
      throw error;
    }
  }

  /**
   * Fetch user's rated movies (TMDB)
   */
  static async fetchRatedMovies(page: number = 1): Promise<any> {
    try {
      return await this.fetchViaProxy(`/account/ratings?page=${page}`);
    } catch (error) {
      logError('fetchRatedMovies', error);
      throw error;
    }
  }

  /**
   * Fetch user's movie lists (TMDB)
   */
  static async fetchMovieLists(page: number = 1): Promise<any> {
    try {
      return await this.fetchViaProxy(`/account/lists?page=${page}`);
    } catch (error) {
      logError('fetchMovieLists', error);
      throw error;
    }
  }

  /**
   * Fetch details of a specific list (TMDB)
   */
  static async fetchListDetails(listId: number | string, page: number = 1): Promise<any> {
    try {
      return await this.fetchViaProxy(`/account/list/${listId}?page=${page}`);
    } catch (error) {
      logError('fetchListDetails', error);
      throw error;
    }
  }

  /**
   * Fetch details for a specific movie (TMDB)
   */
  static async fetchMovieDetails(movieId: number | string, params: Record<string, string> = {}): Promise<any> {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const path = `/movie/${movieId}${queryParams ? `?${queryParams}` : ''}`;
      return await this.fetchViaProxy(path);
    } catch (error) {
      logError('fetchMovieDetails', error);
      throw error;
    }
  }
}
