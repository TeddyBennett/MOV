// src/utils/errorHandler.ts
// Single Responsibility: Handle and format errors consistently across the application

export interface AppError {
  message: string;
  code: string;
  timestamp: string;
  originalError: any;
  status?: number;
  [key: string]: any;
}

/**
 * Format API error response
 * @param error - Error object
 * @returns Formatted error message
 */
export function formatApiError(error: any): string {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Network error: Please check your internet connection.';
  }

  if (error.response) {
    // Server responded with error status
    return `Server error (${error.response.status}): ${error.response.statusText}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'Request failed: No response from server.';
  } else {
    // Something else happened
    return `Error: ${error.message || 'An unknown error occurred.'}`;
  }
}

/**
 * Log error with context
 * @param context - Context where error occurred
 * @param error - Error object
 */
export function logError(context: string, error: any): void {
  console.error(`[${context}] Error:`, error);
}

/**
 * Create a standardized error object
 * @param message - Error message
 * @param code - Error code
 * @param originalError - Original error object
 * @returns Standardized error object
 */
export function createError(message: string, code: string = 'UNKNOWN_ERROR', originalError: any = null): AppError {
  return {
    message,
    code,
    timestamp: new Date().toISOString(),
    originalError,
  };
}

/**
 * Handle API response and throw appropriate errors
 * @param response - Fetch response object
 * @returns Parsed response data
 */
export async function handleApiResponse(response: Response): Promise<any> {
  // 1. Handle Errors Immediately (Fail Fast)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`[Frontend Agent] API Error ${response.status}:`, errorData);

    const errorMessage = errorData.message || errorData.status_message || `HTTP error! Status: ${response.status}`;

    // Custom error keeps your stack traces clean
    throw createError(errorMessage, `HTTP_${response.status}`, {
      status: response.status,
      ...errorData
    });
  }

  // 2. Handle No Content (Essential for 204 or empty responses)
  const isNoContent = response.status === 204;
  const isEmpty = response.headers.get('content-length') === '0';

  if (isNoContent || isEmpty) {
    return null;
  }

  // 3. Robust JSON Parsing
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    try {
      return await response.json();
    } catch (e) {
      console.warn('[Frontend Agent] Expected JSON but parsing failed.');
      return null;
    }
  }

  return null;
}
