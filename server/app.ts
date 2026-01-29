import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import indexRouter from './routes/index.js';
import favoriteRouter from './routes/favorites.js';
import userRouter from './routes/user.js';
import watchlistRouter from './routes/watchlist.js';
import listRouter from './routes/lists.js';
import ratingRouter from './routes/ratings.js';
import authRouter from './routes/auth.js';
import tmdbRouter from './routes/tmdb.js';
import trendingRouter from './routes/trending.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const app: Application = express();

// Middleware
// Architect's Note: Credentials must be enabled for better-auth cookie handling
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


// Better Auth Handler
app.use("/api/auth", authRouter);


app.use('/', indexRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/user', userRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/lists', listRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/tmdb', tmdbRouter);
app.use('/api/trending', trendingRouter);

// Global Error Handler (must be after all routes)
app.use(errorMiddleware);

// Fallback for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
