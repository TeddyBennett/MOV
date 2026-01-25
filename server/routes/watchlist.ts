import { Router } from 'express';
import { watchlistController } from '../controllers/watchlistController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All watchlist routes are protected
router.use(authMiddleware);

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:movieId', watchlistController.removeFromWatchlist);
router.get('/check/:movieId', watchlistController.checkWatchlist);

export default router;
