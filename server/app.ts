import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import indexRouter from './routes/index';
import favoriteRouter from './routes/favorites';
import userRouter from './routes/user';
import watchlistRouter from './routes/watchlist';
import listRouter from './routes/lists';
import ratingRouter from './routes/ratings';
import authRouter from './routes/auth';

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

// Fallback for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
