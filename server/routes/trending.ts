import { Router } from 'express';
import { TrendingController } from '../controllers/trendingController.js';

const router = Router();

// Public: Anyone can see trending movies
router.get('/', TrendingController.getTopTrending);

// Public or Protected: We'll make it public so guest searches also count
router.post('/increment', TrendingController.incrementCount);

export default router;
