import { ApiService } from './apiService';
import { BackendApiService } from './backendApiService';

/**
 * Service class for managing movie data operations
 */
export class MovieDataService {
  constructor() {
    this.favorites = new Set();
    this.watchlist = new Set();
    this.ratings = new Map();
    this.lists = new Map();
    this.moviesInLists = new Map();
  }

  /**
   * Initialize all user data
   */
  async initializeUserData() {
    try {
      // Architect's Note: Check for user session before fetching
      // We catch the error here and return null to prevent 401 logs from bubbling up
      const session = await BackendApiService.getCurrentUser().catch(() => null);

      if (!session) {
        // console.log('[MovieDataService] No active session found. Skipping data initialization.');
        return;
      }

      await Promise.all([
        this.fetchFavorites(),
        this.fetchWatchlist(),
        this.fetchLists(),
        this.fetchRatings()
      ]);
    } catch (error) {
      // Only log actual unexpected errors, not simple 401s
      if (error.code !== 'HTTP_401') {
        console.error('[MovieDataService] Unexpected error during initialization:', error);
      }
    }
  }

  /**
   * Fetch and store user's favorite movies from our backend
   */
  async fetchFavorites() {
    try {
      const favorites = await BackendApiService.getFavorites();
      this.favorites = new Set(favorites.map(f => f.movieId));
    } catch (error) {
      console.error('Failed to fetch favorite movies from backend:', error);
    }
  }

  /**
   * Fetch and store user's watchlist movies from our backend
   */
  async fetchWatchlist() {
    try {
      const watchlist = await BackendApiService.getWatchlist();
      this.watchlist = new Set(watchlist.map(w => w.movieId));
    } catch (error) {
      console.error('Failed to fetch watchlist movies from backend:', error);
    }
  }

  /**
   * Fetch and store user's rated movies from our backend
   */
  async fetchRatings() {
    try {
      const ratings = await BackendApiService.getRatings();
      const allRatingMovies = new Map();

      for (const r of ratings) {
        allRatingMovies.set(r.movieId, r.rating);
      }

      this.ratings = allRatingMovies;
    } catch (error) {
      console.error('Failed to fetch rated movies from backend:', error);
    }
  }

  /**
   * Fetch and store user's custom movie lists from our backend
   */
  async fetchLists() {
    try {
      const lists = await BackendApiService.getLists();
      const allMovieLists = new Map();
      const updatedMoviesInList = new Map();

      for (const list of lists) {
        allMovieLists.set(list.id, {
          name: list.name,
          item_count: list._count.listMovies,
        });

        // Populate movies in lists
        const listDetails = await BackendApiService.getListDetails(list.id);
        if (listDetails && listDetails.listMovies) {
          updatedMoviesInList.set(list.id, new Set(listDetails.listMovies.map(m => m.movieId)));
        }
      }

      this.lists = allMovieLists;
      this.moviesInLists = updatedMoviesInList;
    } catch (error) {
      console.error('Failed to fetch movies list from backend:', error);
    }
  }

  /**
   * Add movie to favorites
   */
  async addToFavorites(movieId, title) {
    try {
      const result = await BackendApiService.addFavorite(movieId);
      if (result) {
        this.favorites.add(movieId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  /**
   * Remove movie from favorites
   */
  async removeFromFavorites(movieId, title) {
    try {
      await BackendApiService.removeFavorite(movieId);
      this.favorites.delete(movieId);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  /**
   * Add movie to watchlist
   */
  async addToWatchlist(movieId, title) {
    try {
      const result = await BackendApiService.addToWatchlist(movieId);
      if (result) {
        this.watchlist.add(movieId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  }

  /**
   * Remove movie from watchlist
   */
  async removeFromWatchlist(movieId, title) {
    try {
      await BackendApiService.removeFromWatchlist(movieId);
      this.watchlist.delete(movieId);
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  }

  /**
   * Rate a movie
   */
  async rateMovie(movieId, rating) {
    try {
      const result = await BackendApiService.addRating(movieId, rating);
      if (result) {
        this.ratings.set(movieId, rating);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error rating movie:', error);
      return false;
    }
  }

  /**
   * Delete movie rating
   */
  async deleteRating(movieId) {
    try {
      await BackendApiService.removeRating(movieId);
      this.ratings.delete(movieId);
      return true;
    } catch (error) {
      console.error('Error deleting rating:', error);
      return false;
    }
  }

  /**
   * Create a new custom list
   */
  async createList(name) {
    try {
      const newList = await BackendApiService.createList(name);
      if (newList) {
        this.lists.set(newList.id, {
          name: newList.name,
          item_count: 0
        });
        this.moviesInLists.set(newList.id, new Set());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  }

  /**
   * Delete a custom list
   */
  async deleteList(listId) {
    try {
      await BackendApiService.deleteList(listId);
      this.lists.delete(listId);
      this.moviesInLists.delete(listId);
      return true;
    } catch (error) {
      console.error('Error deleting list:', error);
      throw error;
    }
  }

  /**
   * Add movie to a custom list
   */
  async addMovieToList(listId, movieId) {
    try {
      const result = await BackendApiService.addMovieToList(listId, movieId);
      if (result) {
        const existingList = this.lists.get(listId);
        if (existingList) {
          this.lists.set(listId, {
            ...existingList,
            item_count: (existingList.item_count || 0) + 1,
          });
        }

        if (!this.moviesInLists.has(listId)) {
          this.moviesInLists.set(listId, new Set());
        }
        this.moviesInLists.get(listId).add(movieId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding movie to list:', error);
      return false;
    }
  }

  /**
   * Remove movie from a custom list
   */
  async removeMovieFromList(listId, movieId) {
    try {
      await BackendApiService.removeMovieFromList(listId, movieId);
      const existingList = this.lists.get(listId);
      if (existingList) {
        this.lists.set(listId, {
          ...existingList,
          item_count: Math.max((existingList.item_count || 1) - 1, 0),
        });
      }

      if (this.moviesInLists.has(listId)) {
        this.moviesInLists.get(listId).delete(movieId);
      }
      return true;
    } catch (error) {
      console.error('Error removing movie from list:', error);
      return false;
    }
  }

  /**
   * Get all movie data combined with user status
   */
  getProcessedMovies(movies, fallbackPosterUrl) {
    return movies.map((movie) => {
      const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fallbackPosterUrl;
      const movieTitle = movie.title || "N/A";
      const score = movie.vote_average || "N/A";
      const originalLang = movie.original_language || "N/A";
      const releaseDate = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";

      const isFavorite = this.favorites.has(movie.id);
      const isWatchlist = this.watchlist.has(movie.id);
      const rating = this.ratings.get(movie.id) || 0;

      return {
        id: movie.id,
        posterUrl,
        movieTitle,
        score,
        originalLang,
        releaseDate,
        isFavorite,
        isWatchlist,
        rating,
      };
    });
  }

  getFavorites() { return this.favorites; }
  getWatchlist() { return this.watchlist; }
  getRatings() { return this.ratings; }
  getLists() { return this.lists; }
  getMoviesInLists() { return this.moviesInLists; }
}
