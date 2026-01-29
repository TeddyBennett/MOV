// server/vercel.ts
import './utils/env.js';
import app from './app.js';

// Export the Express app for Vercel's serverless environment
export default app;
