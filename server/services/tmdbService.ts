// server/services/tmdbService.ts
/**
 * Single Responsibility: Interface with the TMDB external API.
 * Follows Backend Agent (Architect) principles: Service Layer logic.
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_BASE_URL_V4 = 'https://api.themoviedb.org/4';
let TMDB_AUTH_KEY = process.env.TMDB_AUTH_KEY;
const TMDB_ACCOUNT_ID = process.env.TMDB_ACCOUNT_ID;

if (!TMDB_AUTH_KEY) {
    console.error('[TmdbService] ERROR: TMDB_AUTH_KEY is not defined in environment variables.');
} else {
    // Robustness: Strip "Bearer " if the user accidentally included it in the .env file
    if (TMDB_AUTH_KEY.startsWith('Bearer ')) {
        TMDB_AUTH_KEY = TMDB_AUTH_KEY.replace('Bearer ', '');
    }
    console.log(`[TmdbService] TMDB_AUTH_KEY loaded: ${TMDB_AUTH_KEY.substring(0, 5)}...${TMDB_AUTH_KEY.substring(TMDB_AUTH_KEY.length - 5)}`);
}

export class TmdbService {
    /**
     * Generic fetch helper for TMDB API with Bearer Token auth
     */
    private static async fetchTmdb(url: string, options: RequestInit = {}) {
        if (!TMDB_AUTH_KEY) {
            throw new Error('TMDB_AUTH_KEY is not configured on the server.');
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TMDB_AUTH_KEY}`,
                ...options.headers,
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[TmdbService] API Error: ${response.status}`, errorData);
            throw new Error(errorData.status_message || `TMDB API error (${response.status})`);
        }

        return response.json();
    }

    // --- READ OPERATIONS ---

    static async getPopularMovies(page: number = 1) {
        return this.fetchTmdb(`${TMDB_BASE_URL}/movie/popular?page=${page}`);
    }

    static async searchMovies(query: string, page: number = 1) {
        return this.fetchTmdb(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
    }

    static async getMoviesByGenre(genreId: string | number, page: number = 1) {
        return this.fetchTmdb(`${TMDB_BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
    }

    static async getMovieDetails(movieId: string | number, params: Record<string, any> = {}) {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${TMDB_BASE_URL}/movie/${movieId}${queryParams ? `?${queryParams}` : ''}`;
        return this.fetchTmdb(url);
    }

    // --- WRITE OPERATIONS (Proxying) ---

    static async updateFavorite(movieId: number, favorite: boolean) {
        if (!TMDB_ACCOUNT_ID) throw new Error('TMDB_ACCOUNT_ID is not configured.');
        
        return this.fetchTmdb(`${TMDB_BASE_URL}/account/${TMDB_ACCOUNT_ID}/favorite`, {
            method: 'POST',
            body: JSON.stringify({
                media_type: 'movie',
                media_id: movieId,
                favorite
            })
        });
    }

    static async updateWatchlist(movieId: number, watchlist: boolean) {
        if (!TMDB_ACCOUNT_ID) throw new Error('TMDB_ACCOUNT_ID is not configured.');

        return this.fetchTmdb(`${TMDB_BASE_URL}/account/${TMDB_ACCOUNT_ID}/watchlist`, {
            method: 'POST',
            body: JSON.stringify({
                media_type: 'movie',
                media_id: movieId,
                watchlist
            })
        });
    }

    static async rateMovie(movieId: number, rating: number) {
        return this.fetchTmdb(`${TMDB_BASE_URL}/movie/${movieId}/rating`, {
            method: 'POST',
            body: JSON.stringify({ value: rating })
        });
    }

    static async deleteRating(movieId: number) {
        return this.fetchTmdb(`${TMDB_BASE_URL}/movie/${movieId}/rating`, {
            method: 'DELETE'
        });
    }

    static async addMovieToList(listId: string | number, movieId: number) {
        return this.fetchTmdb(`${TMDB_BASE_URL_V4}/list/${listId}/items`, {
            method: 'POST',
            body: JSON.stringify({
                items: [{ media_type: 'movie', media_id: movieId }]
            })
        });
    }

    static async removeMovieFromList(listId: string | number, movieId: number) {
        return this.fetchTmdb(`${TMDB_BASE_URL_V4}/list/${listId}/items`, {
            method: 'DELETE',
            body: JSON.stringify({
                items: [{ media_type: 'movie', media_id: movieId }]
            })
        });
    }

    // --- ACCOUNT DATA FETCHING ---

    static async getFavoriteMovies(page: number = 1) {
        if (!TMDB_ACCOUNT_ID) throw new Error('TMDB_ACCOUNT_ID is not configured.');
        return this.fetchTmdb(`${TMDB_BASE_URL}/account/${TMDB_ACCOUNT_ID}/favorite/movies?page=${page}`);
    }

    static async getWatchlistMovies(page: number = 1) {
        if (!TMDB_ACCOUNT_ID) throw new Error('TMDB_ACCOUNT_ID is not configured.');
        return this.fetchTmdb(`${TMDB_BASE_URL}/account/${TMDB_ACCOUNT_ID}/watchlist/movies?page=${page}`);
    }

    static async getRatedMovies(page: number = 1) {
        if (!TMDB_ACCOUNT_ID) throw new Error('TMDB_ACCOUNT_ID is not configured.');
        return this.fetchTmdb(`${TMDB_BASE_URL}/account/${TMDB_ACCOUNT_ID}/rated/movies?page=${page}`);
    }

    static async getLists(page: number = 1) {
        if (!TMDB_ACCOUNT_ID) throw new Error('TMDB_ACCOUNT_ID is not configured.');
        return this.fetchTmdb(`${TMDB_BASE_URL}/account/${TMDB_ACCOUNT_ID}/lists?page=${page}`);
    }

    static async getListDetails(listId: string | number) {
        return this.fetchTmdb(`${TMDB_BASE_URL_V4}/list/${listId}`);
    }
}
