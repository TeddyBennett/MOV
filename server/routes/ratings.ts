import { Router } from 'express';
import * as ratingController from '../controllers/ratingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', ratingController.getRatings);
router.post('/', ratingController.addRating);
router.delete('/:movieId', ratingController.removeRating);
router.get('/check/:movieId', ratingController.checkRating);

export default router;
