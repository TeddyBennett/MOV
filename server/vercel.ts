// server/vercel.ts
import './utils/env';
import app from './app';

// Export the Express app for Vercel's serverless environment
export default app;
