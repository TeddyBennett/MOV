import { handleApiResponse, logError } from '../utils/errorHandler';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Service class for handling all API communications with our custom backend
 */
export class BackendApiService {
    /**
     * Helper to perform fetch with session credentials (HttpOnly cookies)
     */
    static async fetchWithAuth(path: string, options: RequestInit = {}) {
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
        return await handleApiResponse(response);
    }

    // --- Auth & User ---

    /**
     * Get current user session
     */
    static async getCurrentUser() {
        try {
            return await this.fetchWithAuth('/api/user/me');
        } catch (error) {
            logError('getCurrentUser', error);
            throw error;
        }
    }

    /**
     * Sign up with email
     */
    static async signUp(email: string, password: string, name: string) {
        try {
            return await this.fetchWithAuth('/api/auth/sign-up/email', {
                method: 'POST',
                body: JSON.stringify({ email, password, name }),
            });
        } catch (error) {
            logError('signUp', error);
            throw error;
        }
    }

    /**
     * Sign in with email
     */
    static async signIn(email: string, password: string) {
        try {
            return await this.fetchWithAuth('/api/auth/sign-in/email', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
        } catch (error) {
            logError('signIn', error);
            throw error;
        }
    }

    /**
     * Sign out
     */
    static async signOut() {
        try {
            return await this.fetchWithAuth('/api/auth/sign-out', {
                method: 'POST',
            });
        } catch (error) {
            logError('signOut', error);
            throw error;
        }
    }

    // --- Favorites ---

    /**
     * Get all favorites
     */
    static async getFavorites() {
        try {
            return await this.fetchWithAuth('/api/favorites');
        } catch (error) {
            logError('getFavorites', error);
            throw error;
        }
    }

    /**
     * Add a movie to favorites
     */
    static async addFavorite(movieId: number) {
        try {
            return await this.fetchWithAuth('/api/favorites', {
                method: 'POST',
                body: JSON.stringify({ movieId }),
            });
        } catch (error) {
            logError('addFavorite', error);
            throw error;
        }
    }

    /**
     * Remove a movie from favorites
     */
    static async removeFavorite(movieId: number) {
        try {
            return await this.fetchWithAuth(`/api/favorites/${movieId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            logError('removeFavorite', error);
            throw error;
        }
    }

    /**
     * Check if movie is favorited
     */
    static async checkFavorite(movieId: number) {
        try {
            return await this.fetchWithAuth(`/api/favorites/check/${movieId}`);
        } catch (error) {
            logError('checkFavorite', error);
            throw error;
        }
    }

    // --- Watchlist ---

    /**
     * Get full watchlist
     */
    static async getWatchlist() {
        try {
            return await this.fetchWithAuth('/api/watchlist');
        } catch (error) {
            logError('getWatchlist', error);
            throw error;
        }
    }

    /**
     * Add to watchlist
     */
    static async addToWatchlist(movieId: number) {
        try {
            return await this.fetchWithAuth('/api/watchlist', {
                method: 'POST',
                body: JSON.stringify({ movieId }),
            });
        } catch (error) {
            logError('addToWatchlist', error);
            throw error;
        }
    }

    /**
     * Remove from watchlist
     */
    static async removeFromWatchlist(movieId: number) {
        try {
            return await this.fetchWithAuth(`/api/watchlist/${movieId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            logError('removeFromWatchlist', error);
            throw error;
        }
    }

    /**
     * Check if movie is in watchlist
     */
    static async checkWatchlist(movieId: number) {
        try {
            return await this.fetchWithAuth(`/api/watchlist/check/${movieId}`);
        } catch (error) {
            logError('checkWatchlist', error);
            throw error;
        }
    }

    // --- Custom Lists ---

    /**
     * Get all user lists
     */
    static async getLists() {
        try {
            return await this.fetchWithAuth('/api/lists');
        } catch (error) {
            logError('getLists', error);
            throw error;
        }
    }

    /**
     * Create a new list
     */
    static async createList(name: string) {
        try {
            return await this.fetchWithAuth('/api/lists', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });
        } catch (error) {
            logError('createList', error);
            throw error;
        }
    }

    /**
     * Delete a list
     */
    static async deleteList(listId: number) {
        try {
            return await this.fetchWithAuth(`/api/lists/${listId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            logError('deleteList', error);
            throw error;
        }
    }

    /**
     * Add movie to a specific list
     */
    static async addMovieToList(listId: number, movieId: number) {
        try {
            return await this.fetchWithAuth(`/api/lists/${listId}/movies`, {
                method: 'POST',
                body: JSON.stringify({ movieId }),
            });
        } catch (error) {
            logError('addMovieToList', error);
            throw error;
        }
    }

    /**
     * Get details (and movies) for a specific list
     */
    static async getListDetails(listId: string) {
        try {
            return await this.fetchWithAuth(`/api/lists/${listId}`);
        } catch (error) {
            logError('getListDetails', error);
            throw error;
        }
    }

    /**
     * Remove movie from a specific list
     */
    static async removeMovieFromList(listId: number, movieId: number) {
        try {
            return await this.fetchWithAuth(`/api/lists/${listId}/movies/${movieId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            logError('removeMovieFromList', error);
            throw error;
        }
    }

    // --- Ratings ---

    /**
     * Get all ratings
     */
    static async getRatings() {
        try {
            return await this.fetchWithAuth('/api/ratings');
        } catch (error) {
            logError('getRatings', error);
            throw error;
        }
    }

    /**
     * Add or update a rating
     */
    static async addRating(movieId: number, rating: number) {
        try {
            return await this.fetchWithAuth('/api/ratings', {
                method: 'POST',
                body: JSON.stringify({ movieId, rating }),
            });
        } catch (error) {
            logError('addRating', error);
            throw error;
        }
    }

    /**
     * Remove a rating
     */
    static async removeRating(movieId: number) {
        try {
            return await this.fetchWithAuth(`/api/ratings/${movieId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            logError('removeRating', error);
            throw error;
        }
    }

    /**
     * Check a rating
     */
    static async checkRating(movieId: number) {
        try {
            return await this.fetchWithAuth(`/api/ratings/check/${movieId}`);
        } catch (error) {
            logError('checkRating', error);
            throw error;
        }
    }
}
