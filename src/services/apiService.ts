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
  static async fetchViaProxy(path: string, options: RequestInit = {}, context: string = 'TMDB_PROXY'): Promise<any> {
    return BackendApiService.fetchWithAuth(`${PROXY_BASE_URL}${path}`, options, context);
  }

  /**
   * Fetch popular movies
   */
  static async fetchPopularMovies(page: number = 1): Promise<any> {
    return await this.fetchViaProxy(`/popular?page=${page}`, {}, 'FETCH_POPULAR_MOVIES');
  }

  /**
   * Search movies by query
   */
  static async searchMovies(query: string, page: number = 1): Promise<any> {
    return await this.fetchViaProxy(`/search?query=${encodeURIComponent(query)}&page=${page}`, {}, 'SEARCH_MOVIES');
  }

  /**
   * Fetch movies by genre
   */
  static async fetchMoviesByGenre(genreId: number | string, page: number = 1): Promise<any> {
    return await this.fetchViaProxy(`/genre/${genreId}?page=${page}`, {}, 'FETCH_BY_GENRE');
  }

  /**
   * Add/remove movie from favorites (TMDB)
   */
  static async updateFavorite(movieId: number, favorite: boolean): Promise<any> {
    return await this.fetchViaProxy(`/favorite`, {
      method: 'POST',
      body: JSON.stringify({ movieId, favorite })
    }, 'UPDATE_FAVORITE_TMDB');
  }

  /**
   * Add/remove movie from watchlist (TMDB)
   */
  static async updateWatchlist(movieId: number, watchlist: boolean): Promise<any> {
    return await this.fetchViaProxy(`/watchlist`, {
      method: 'POST',
      body: JSON.stringify({ movieId, watchlist })
    }, 'UPDATE_WATCHLIST_TMDB');
  }

  /**
   * Rate a movie (TMDB)
   */
  static async rateMovie(movieId: number, rating: number): Promise<any> {
    return await this.fetchViaProxy(`/rating`, {
      method: 'POST',
      body: JSON.stringify({ movieId, rating })
    }, 'RATE_MOVIE_TMDB');
  }

  /**
   * Delete movie rating (TMDB)
   */
  static async deleteRating(movieId: number): Promise<any> {
    return await this.fetchViaProxy(`/rating/${movieId}`, {
      method: 'DELETE'
    }, 'DELETE_RATING_TMDB');
  }

  /**
   * Add movie to a list (TMDB)
   */
  static async addMovieToList(listId: number | string, movieId: number): Promise<any> {
    return await this.fetchViaProxy(`/list/${listId}/movies`, {
      method: 'POST',
      body: JSON.stringify({ movieId })
    }, 'ADD_TO_LIST_TMDB');
  }

  /**
   * Remove movie from a list (TMDB)
   */
  static async removeMovieFromList(listId: number | string, movieId: number): Promise<any> {
    return await this.fetchViaProxy(`/list/${listId}/movies`, {
      method: 'DELETE',
      body: JSON.stringify({ movieId })
    }, 'REMOVE_FROM_LIST_TMDB');
  }

  /**
   * Check if movie is in a list (TMDB)
   */
  static async isMovieInList(listId: number | string, movieId: number): Promise<any> {
    return await this.fetchViaProxy(`/account/list/${listId}`, {}, 'CHECK_MOVIE_IN_LIST');
  }

  /**
   * Fetch user's favorite movies (TMDB)
   */
  static async fetchFavoriteMovies(page: number = 1): Promise<any> {
    return await this.fetchViaProxy(`/account/favorites?page=${page}`, {}, 'FETCH_FAVORITES_TMDB');
  }

  /**
   * Fetch user's watchlist movies (TMDB)
   */
  static async fetchWatchlistMovies(page: number = 1): Promise<any> {
    return await this.fetchViaProxy(`/account/watchlist?page=${page}`, {}, 'FETCH_WATCHLIST_TMDB');
  }

  /**
   * Fetch user's rated movies (TMDB)
   */
  static async fetchRatedMovies(page: number = 1): Promise<any> {
    return await this.fetchViaProxy(`/account/ratings?page=${page}`, {}, 'FETCH_RATINGS_TMDB');
  }

  /**
   * Fetch user's movie lists (TMDB)
   */
  static async fetchMovieLists(page: number = 1): Promise<any> {
    return await this.fetchViaProxy(`/account/lists?page=${page}`, {}, 'FETCH_LISTS_TMDB');
  }

  /**
   * Fetch details of a specific list (TMDB)
   */
  static async fetchListDetails(listId: number | string, page: number = 1): Promise<any> {
    return await this.fetchViaProxy(`/account/list/${listId}?page=${page}`, {}, 'FETCH_LIST_DETAILS_TMDB');
  }

  /**
   * Fetch details for a specific movie (TMDB)
   */
  static async fetchMovieDetails(movieId: number | string, params: Record<string, string> = {}): Promise<any> {
    const queryParams = new URLSearchParams(params).toString();
    const path = `/movie/${movieId}${queryParams ? `?${queryParams}` : ''}`;
    return await this.fetchViaProxy(path, {}, 'FETCH_MOVIE_DETAILS');
  }
}
