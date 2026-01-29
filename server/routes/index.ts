import { Router } from 'express';
import { getHealthStatus } from '../controllers/indexController.js';

const router = Router();

router.get('/health', getHealthStatus);

export default router;
