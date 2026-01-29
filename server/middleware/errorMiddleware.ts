// server/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';
import { ZodError } from 'zod';

/**
 * Global error handling middleware for Express.
 * Catches all errors thrown in routes and formats them consistently.
 */
export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // If headers already sent, delegate to default Express handler
    if (res.headersSent) {
        return next(err);
    }

    let error = err;

    // Convert ZodError to ApiError
    if (err instanceof ZodError) {
        error = ApiError.badRequest('Validation Error', err.issues);
    }

    // Log error for server-side debugging
    console.error(`[API Error] ${req.method} ${req.path}:`, {
        message: error.message,
        status: error.status || 500,
        details: error.details,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Send consistent error response
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    const details = error.details || null;

    res.status(status).json({
        message,
        status,
        details,
        timestamp: new Date().toISOString()
    });
};
