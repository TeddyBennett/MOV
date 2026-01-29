// src/utils/errorHandler.ts
/**
 * Custom error class for application-specific errors.
 * Captures status code, context, and raw details for better debugging.
 */
export class AppError extends Error {
    constructor(
        public message: string,
        public status: number = 500,
        public context: string = 'GENERAL',
        public details: any = null
    ) {
        super(message);
        this.name = 'AppError';
        // Proper prototype chain for instanceof checks in compiled JS
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Parses the fetch response and throws an AppError with full context if the response is not OK.
 */
export async function handleApiResponse(response: Response, context: string = 'API'): Promise<any> {
    if (response.ok) {
        // Handle successful but empty responses (like 204 No Content)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        }
        return null;
    }

    let errorMessage = `Request failed (${response.status})`;
    let details = null;

    try {
        const errorData = await response.json();
        // Prefer specific server message over generic HTTP status text
        errorMessage = errorData.message || errorData.status_message || errorMessage;
        details = errorData.errors || errorData;
    } catch {
        // Fallback to status text if JSON parsing fails
        errorMessage = response.statusText || errorMessage;
    }

    throw new AppError(errorMessage, response.status, context, details);
}

/**
 * Converts any error into a user-friendly message string.
 */
export function getFriendlyErrorMessage(error: any): string {
    if (error instanceof AppError) {
        // If the error is already a processed AppError, use its message
        return error.message;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
        return 'Network error: Unable to connect to the server.';
    }

    return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Standardized logging for errors.
 */
export function logError(error: any, context?: string): void {
    const errorContext = context || (error instanceof AppError ? error.context : 'UNKNOWN');
    console.error(`[${errorContext}] Error:`, {
        message: error.message,
        status: error.status,
        details: error.details,
        stack: error.stack
    });
}