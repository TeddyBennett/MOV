// server/utils/errors.ts
/**
 * Custom error class for API-related errors.
 */
export class ApiError extends Error {
    constructor(
        public message: string,
        public status: number = 500,
        public details: any = null
    ) {
        super(message);
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(message: string, details?: any) {
        return new ApiError(message, 400, details);
    }

    static unauthorized(message: string = 'Unauthorized') {
        return new ApiError(message, 401);
    }

    static forbidden(message: string = 'Forbidden') {
        return new ApiError(message, 403);
    }

    static notFound(message: string = 'Not Found') {
        return new ApiError(message, 404);
    }

    static internal(message: string = 'Internal Server Error') {
        return new ApiError(message, 500);
    }
}
