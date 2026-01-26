import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../utils/auth.js';

const authRouter = Router();
console.log('Auth router mounted');
// This will mount all better-auth routes under /api/auth
authRouter.all('*splat', toNodeHandler(auth));

export default authRouter;
