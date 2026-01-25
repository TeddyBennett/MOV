import { Router } from 'express';
import { getHealthStatus } from '../controllers/indexController';

const router = Router();

router.get('/health', getHealthStatus);

export default router;
