import { BackendApiService } from './backendApiService';
import { Movie, ListInfo, ProcessedMovie } from '../types';
import { processMoviesWithUserStatus } from '../utils/movieUtils';

/**
 * Service class for managing movie data operations
 */
export class MovieDataService {
  private favorites: Set<number>;
  private watchlist: Set<number>;
  private ratings: Map<number, number>;
  private lists: Map<number, ListInfo>;
  private moviesInLists: Map<number, Set<number>>;

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
  async initializeUserData(): Promise<void> {
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
    } catch (error: any) {
      // Only log actual unexpected errors, not simple 401s
      if (error.code !== 'HTTP_401') {
        console.error('[MovieDataService] Unexpected error during initialization:', error);
      }
    }
  }

  /**
   * Fetch and store user's favorite movies from our backend
   */
  async fetchFavorites(): Promise<void> {
    try {
      const favorites = await BackendApiService.getFavorites();
      this.favorites = new Set(favorites.map((f: { movieId: number }) => f.movieId));
    } catch (error) {
      console.error('Failed to fetch favorite movies from backend:', error);
    }
  }

  /**
   * Fetch and store user's watchlist movies from our backend
   */
  async fetchWatchlist(): Promise<void> {
    try {
      const watchlist = await BackendApiService.getWatchlist();
      this.watchlist = new Set(watchlist.map((w: { movieId: number }) => w.movieId));
    } catch (error) {
      console.error('Failed to fetch watchlist movies from backend:', error);
    }
  }

  /**
   * Fetch and store user's rated movies from our backend
   */
  async fetchRatings(): Promise<void> {
    try {
      const ratings = await BackendApiService.getRatings();
      const allRatingMovies = new Map<number, number>();

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
  async fetchLists(): Promise<void> {
    try {
      const lists = await BackendApiService.getLists();
      const allMovieLists = new Map<number, ListInfo>();
      const updatedMoviesInList = new Map<number, Set<number>>();

      for (const list of lists) {
        allMovieLists.set(list.id, {
          name: list.name,
          item_count: list._count.listMovies,
        });

        // Populate movies in lists
        const listDetails = await BackendApiService.getListDetails(list.id);
        if (listDetails && listDetails.listMovies) {
          updatedMoviesInList.set(list.id, new Set(listDetails.listMovies.map((m: { movieId: number }) => m.movieId)));
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
  async addToFavorites(movieId: number): Promise<boolean> {
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
  async removeFromFavorites(movieId: number): Promise<boolean> {
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
  async addToWatchlist(movieId: number): Promise<boolean> {
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
  async removeFromWatchlist(movieId: number): Promise<boolean> {
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
  async rateMovie(movieId: number, rating: number): Promise<boolean> {
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
  async deleteRating(movieId: number): Promise<boolean> {
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
  async createList(name: string): Promise<boolean> {
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
  async deleteList(listId: number): Promise<boolean> {
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
  async addMovieToList(listId: number, movieId: number): Promise<boolean> {
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
        this.moviesInLists.get(listId)!.add(movieId);
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
  async removeMovieFromList(listId: number, movieId: number): Promise<boolean> {
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
        this.moviesInLists.get(listId)!.delete(movieId);
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
  getProcessedMovies(movies: Partial<Movie>[], fallbackPosterUrl: string): ProcessedMovie[] {
    return processMoviesWithUserStatus(
      movies,
      this.favorites,
      this.watchlist,
      this.ratings,
      fallbackPosterUrl
    );
  }

  getFavorites() { return this.favorites; }
  getWatchlist() { return this.watchlist; }
  getRatings() { return this.ratings; }
  getLists() { return this.lists; }
  getMoviesInLists() { return this.moviesInLists; }
}
