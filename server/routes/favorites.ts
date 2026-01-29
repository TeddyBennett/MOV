import { Router } from 'express';
import { favoriteController } from '../controllers/favoriteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// All favorite routes are protected
router.use(authMiddleware);

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/:movieId', favoriteController.removeFavorite);
router.get('/check/:movieId', favoriteController.checkFavorite);

export default router;
