import { handleApiResponse, logError } from '../utils/errorHandler';

const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
// Smart fallback: use provided URL, or localhost in dev, or empty string (relative) in production
const BACKEND_BASE_URL = typeof envBackendUrl !== 'undefined' 
    ? envBackendUrl 
    : (import.meta.env.DEV ? 'http://localhost:5000' : '');

/**
 * Service class for handling all API communications with our custom backend
 */
export class BackendApiService {
    /**
     * Helper to perform fetch with session credentials (HttpOnly cookies)
     */
    static async fetchWithAuth(path: string, options: RequestInit = {}, context: string = 'BACKEND_API') {
        const url = `${BACKEND_BASE_URL}${path}`;
        const defaultOptions: RequestInit = {
            ...options,
            credentials: 'include', // CRITICAL: Allows sending/receiving session cookies
            headers: {
                'Content-Type': "application/json",
                ...options.headers,
            },
        };

        const response = await fetch(url, defaultOptions);
        return await handleApiResponse(response, context);
    }

    // --- Auth & User ---

    /**
     * Get current user session
     */
    static async getCurrentUser() {
        return await this.fetchWithAuth('/api/user/me', {}, 'GET_CURRENT_USER');
    }

    /**
     * Sign up with email
     */
    static async signUp(email: string, password: string, name: string) {
        return await this.fetchWithAuth('/api/auth/sign-up/email', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        }, 'SIGN_UP');
    }

    /**
     * Sign in with email
     */
    static async signIn(email: string, password: string) {
        return await this.fetchWithAuth('/api/auth/sign-in/email', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }, 'SIGN_IN');
    }

    /**
     * Sign out
     */
    static async signOut() {
        return await this.fetchWithAuth('/api/auth/sign-out', {
            method: 'POST',
        }, 'SIGN_OUT');
    }

    // --- Favorites ---

    /**
     * Get all favorites
     */
    static async getFavorites() {
        return await this.fetchWithAuth('/api/favorites', {}, 'GET_FAVORITES');
    }

    /**
     * Add a movie to favorites
     */
    static async addFavorite(movieId: number) {
        return await this.fetchWithAuth('/api/favorites', {
            method: 'POST',
            body: JSON.stringify({ movieId }),
        }, 'ADD_FAVORITE');
    }

    /**
     * Remove a movie from favorites
     */
    static async removeFavorite(movieId: number) {
        return await this.fetchWithAuth(`/api/favorites/${movieId}`, {
            method: 'DELETE',
        }, 'REMOVE_FAVORITE');
    }

    /**
     * Check if movie is favorited
     */
    static async checkFavorite(movieId: number) {
        return await this.fetchWithAuth(`/api/favorites/check/${movieId}`, {}, 'CHECK_FAVORITE');
    }

    // --- Watchlist ---

    /**
     * Get full watchlist
     */
    static async getWatchlist() {
        return await this.fetchWithAuth('/api/watchlist', {}, 'GET_WATCHLIST');
    }

    /**
     * Add to watchlist
     */
    static async addToWatchlist(movieId: number) {
        return await this.fetchWithAuth('/api/watchlist', {
            method: 'POST',
            body: JSON.stringify({ movieId }),
        }, 'ADD_TO_WATCHLIST');
    }

    /**
     * Remove from watchlist
     */
    static async removeFromWatchlist(movieId: number) {
        return await this.fetchWithAuth(`/api/watchlist/${movieId}`, {
            method: 'DELETE',
        }, 'REMOVE_FROM_WATCHLIST');
    }

    /**
     * Check if movie is in watchlist
     */
    static async checkWatchlist(movieId: number) {
        return await this.fetchWithAuth(`/api/watchlist/check/${movieId}`, {}, 'CHECK_WATCHLIST');
    }

    // --- Custom Lists ---

    /**
     * Get all user lists
     */
    static async getLists() {
        return await this.fetchWithAuth('/api/lists', {}, 'GET_LISTS');
    }

    /**
     * Create a new list
     */
    static async createList(name: string) {
        return await this.fetchWithAuth('/api/lists', {
            method: 'POST',
            body: JSON.stringify({ name }),
        }, 'CREATE_LIST');
    }

    /**
     * Delete a list
     */
    static async deleteList(listId: number) {
        return await this.fetchWithAuth(`/api/lists/${listId}`, {
            method: 'DELETE',
        }, 'DELETE_LIST');
    }

    /**
     * Add movie to a specific list
     */
    static async addMovieToList(listId: number, movieId: number) {
        return await this.fetchWithAuth(`/api/lists/${listId}/movies`, {
            method: 'POST',
            body: JSON.stringify({ movieId }),
        }, 'ADD_MOVIE_TO_LIST');
    }

    /**
     * Get details (and movies) for a specific list
     */
    static async getListDetails(listId: string | number) {
        return await this.fetchWithAuth(`/api/lists/${listId}`, {}, 'GET_LIST_DETAILS');
    }

    /**
     * Remove movie from a specific list
     */
    static async removeMovieFromList(listId: number, movieId: number) {
        return await this.fetchWithAuth(`/api/lists/${listId}/movies/${movieId}`, {
            method: 'DELETE',
        }, 'REMOVE_MOVIE_FROM_LIST');
    }

    // --- Ratings ---

    /**
     * Get all ratings
     */
    static async getRatings() {
        return await this.fetchWithAuth('/api/ratings', {}, 'GET_RATINGS');
    }

    /**
     * Add or update a rating
     */
    static async addRating(movieId: number, rating: number) {
        return await this.fetchWithAuth('/api/ratings', {
            method: 'POST',
            body: JSON.stringify({ movieId, rating }),
        }, 'ADD_RATING');
    }

    /**
     * Remove a rating
     */
    static async removeRating(movieId: number) {
        return await this.fetchWithAuth(`/api/ratings/${movieId}`, {
            method: 'DELETE',
        }, 'REMOVE_RATING');
    }

    /**
     * Check a rating
     */
    static async checkRating(movieId: number) {
        return await this.fetchWithAuth(`/api/ratings/check/${movieId}`, {}, 'CHECK_RATING');
    }

    // --- Trending (Global) ---

    /**
     * Get top trending movies from DB
     */
    static async getTrending() {
        return await this.fetchWithAuth('/api/trending', {}, 'GET_TRENDING');
    }

    /**
     * Increment search count for a movie
     */
    static async incrementTrending(movieData: any) {
        return await this.fetchWithAuth('/api/trending/increment', {
            method: 'POST',
            body: JSON.stringify(movieData),
        }, 'INCREMENT_TRENDING');
    }
}
