import { Router } from 'express';
import { favoriteController } from '../controllers/favoriteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All favorite routes are protected
router.use(authMiddleware);

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/:movieId', favoriteController.removeFavorite);
router.get('/check/:movieId', favoriteController.checkFavorite);

export default router;
