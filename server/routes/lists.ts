import { Router } from 'express';
import { listController } from '../controllers/listController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Protect all list routes
router.use(authMiddleware);

router.get('/', listController.getLists);
router.get('/:id', listController.getListById);
router.post('/', listController.createList);
router.delete('/:id', listController.deleteList);

// Movie management within lists
router.post('/:id/movies', listController.addMovie);
router.delete('/:id/movies/:movieId', listController.removeMovie);

export default router;
