// server/routes/tmdb.ts
import { Router } from 'express';
import { TmdbController } from '../controllers/tmdbController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Publicly available read operations (or could be protected if desired)
router.get('/popular', TmdbController.getPopularMovies);
router.get('/search', TmdbController.searchMovies);
router.get('/genre/:genreId', TmdbController.getMoviesByGenre);
router.get('/movie/:movieId', TmdbController.getMovieDetails);

// Protected operations (Require authentication)
router.use(authMiddleware);

router.post('/favorite', TmdbController.updateFavorite);
router.post('/watchlist', TmdbController.updateWatchlist);
router.post('/rating', TmdbController.rateMovie);
router.delete('/rating/:movieId', TmdbController.deleteRating);
router.post('/list/:listId/movies', TmdbController.addMovieToList);
router.delete('/list/:listId/movies', TmdbController.removeMovieFromList);

// Account data (Protected)
router.get('/account/favorites', TmdbController.getFavoriteMovies);
router.get('/account/watchlist', TmdbController.getWatchlistMovies);
router.get('/account/ratings', TmdbController.getRatedMovies);
router.get('/account/lists', TmdbController.getLists);
router.get('/account/list/:listId', TmdbController.getListDetails);

export default router;
