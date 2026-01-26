import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protect the session info endpoint
router.get('/me', authMiddleware, userController.getSession);

export default router;
